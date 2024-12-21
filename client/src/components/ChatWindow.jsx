import React, { useEffect, useState, useRef } from 'react'
import { IoMdSend } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaMicrophone } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { ImBin2 } from "react-icons/im";
import { IoIosPause } from "react-icons/io";
import io from 'socket.io-client'
import { useAuthContext } from '../hooks/useAuthContext'
import Message from './Message/Message'
import axios from 'axios'
import WaveSurfer from 'wavesurfer.js'
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import ChatHeader from './ChatHeader/ChatHeader';
import { useWindow } from '../hooks/useWindow';
const backendUrl = import.meta.env.VITE_BACKEND_URL
const socket = io(backendUrl)

function ChatWindow({ user, setLastUser }) {
  const { isChatInfoOpen, isChatWindowOpen, toggleChatWindow } = useWindow() 
  const recorderControls = useVoiceVisualizer();
  // console.log(recorderControls);
  const userInfo = useAuthContext()
  const currUserId = userInfo.user.newUser.id

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  //audio recording
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [wavesurfer, setWavesurfer] = useState(null)
  const waveformRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)

  const handleResize = () => {
    if(window.innerWidth > 650 && window.innerWidth < 850){
      if(!isChatWindowOpen){
        toggleChatWindow()
      }
    }
  };

  useEffect(() => {
    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // const visualizerWrapperRef = useRef(null);
  // const [wrapperWidth, setWrapperWidth] = useState(0);

  // useEffect(() => {
  //   // Measure the parent container's width
  //   const handleResize = () => {
  //     if (visualizerWrapperRef.current) {
  //       setWrapperWidth(visualizerWrapperRef.current.offsetWidth);
  //     }
  //   };

  //   // Initial size measurement
  //   handleResize();

  //   // Update size on window resize
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  //initialize wavesurfer
  // useEffect(() => {
  //   if(waveformRef.current){
  //     const wavesurfer = WaveSurfer.create({
  //       container: waveformRef.current,
  //       waveColor: 'violet',
  //       progressColor: 'purple',
  //       cursorWidth: 1,
  //       barWidth: 3,
  //       barRadius: 3,
  //       responsive: true,
  //       height: 100,
  //       hideScrollbar: true
  //     })
  //     setWavesurfer(wavesurfer)
  //   }
  //   return () => wavesurfer && wavesurfer.destroy()
  // },[])

  //start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    setMediaRecorder(recorder)
    mediaRecorderRef.current = recorder

    const audioChunks = []
    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data)
    }
    
    recorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' })
      setAudioBlob(blob)
    }

    recorder.start()

    setIsRecording(true)

    //wavesurfer effects
    // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // const source = audioContext.createMediaStreamSource(stream);
    // const processor = audioContext.createScriptProcessor(2048, 1, 1);

    // wavesurfer && wavesurfer.backend.setFilter(source);
    // source.connect(processor);
    // processor.connect(audioContext.destination);

    // processor.onaudioprocess = (e) => {
    //   const inputBuffer = e.inputBuffer.getChannelData(0);
    //   wavesurfer.backend.peaks = inputBuffer;
    //   wavesurfer.drawBuffer();
    // };
  }

  const stopRecording = () => {
    if(mediaRecorderRef.current){
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    wavesurfer && wavesurfer.stop()
  }

  useEffect(() => {
    if(messages.length === 0) return;
    const messagesContainer = document.querySelector('.chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if(user){
      socket.emit('joinRoom', currUserId)

      axios.get(`${backendUrl}/api/messages/${user._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.user.token}`
        }
      }).then((res) => {
        // console.log('working')
        // console.log(res.data)
        setMessages(res.data.messages)
      }).catch((err) => {
        console.log(err)
      })
    }

    socket.on('receiveMessage', (newMessage) => {
      console.log('message received', newMessage)
      setLastUser(newMessage.senderId)
      if(newMessage.senderId === user._id){
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  },[user])

  const sendMessage = async () => {
    recorderControls.stopRecording()
    recorderControls.clearCanvas()
    if(input.trim() || recorderControls.isAvailableRecordedAudio){
      const formData = new FormData()

      // const message = {
      //   senderId: currUserId,
      //   receiverId: user._id,
      //   content: input
      // }

      formData.append('senderId', currUserId)
      formData.append('receiverId', user._id)
      formData.append('content', input)
      formData.append('messageType', recorderControls.isAvailableRecordedAudio? 'audio': 'text')
      if(recorderControls.isAvailableRecordedAudio){
        formData.append('file', recorderControls.recordedBlob, 'audio.weba')
      }

      await axios.post(`${backendUrl}/api/messages`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.user.token}`,
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        // console.log(res.data)
        setMessages((prevMessages) => [...prevMessages, res.data.message])
        setLastUser(user._id)
        setInput('')
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <div className={isChatInfoOpen || !isChatWindowOpen ? 'chat-window hide-chat-window': 'chat-window'}>  
      { user ? <div className="message-window">
        <ChatHeader user={user} />
        <div className="chat-messages">
        {/* Here you can render message history or live chat messages */}
          {messages.map((msg, index) => (
              <Message key={index} message={msg} isSender={msg.senderId === currUserId} />
          ))}
        </div>
        <div className="input-container">
          <button className='message-input-btn'  onClick={() => {}} >
            <GrGallery size='25px' color='white' />
          </button>
          <button className='message-input-btn'  onClick={recorderControls.isRecordingInProgress? recorderControls.stopRecording: recorderControls.startRecording} >
            <FaMicrophone size='25px' color={recorderControls.isRecordingInProgress? 'red': 'white'} />
          </button>
          {!recorderControls.isCleared &&
            <button className='message-input-btn' onClick={recorderControls.togglePauseResume}>
              {(recorderControls.isPausedRecording && !recorderControls.isPausedRecordedAudio) || (!recorderControls.isPausedRecording && recorderControls.isPausedRecordedAudio)? 
              <FaPlay size='25px' color='white'/> : <IoIosPause size='25px' color='white'/>}
            </button>
          }
          {
            recorderControls.isRecordingInProgress || !recorderControls.isCleared?
            <VoiceVisualizer
              controls={recorderControls} 
              isDefaultUIShown={false} 
              isControlPanelShown={false} 
              onlyRecording={false}
              secondaryBarColor='white'
              rounded={2}
              height={50}
              mainContainerClassName='audio-visualizer'
              canvasContainerClassName='canvas-container'
            />
            : <input type="text" placeholder="Type a message..." className="message-input" value={input} onChange={(e) => setInput(e.target.value)}/>
          }
          {!recorderControls.isCleared &&
            (<button className='message-input-btn' onClick={recorderControls.clearCanvas}>
              <ImBin2 size='25px' color='white'/>
            </button>)
          }
          <button className='message-input-btn'  onClick={sendMessage} >
            <IoMdSend size='25px' color='white' />
          </button>
        </div>
      </div> : <div className='no-chat'>
        <p>Select a user to open inbox</p>
        </div>}       
    </div>
  )
}

export default ChatWindow