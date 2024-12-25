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
import { useUserContext } from '../hooks/useUserContext';
const backendUrl = import.meta.env.VITE_BACKEND_URL
const socket = io(backendUrl)

function ChatWindow({ user, setLastMessage }) {
  const { userNotFound, notFound, dispatch } = useUserContext()
  const { isChatInfoOpen, isChatWindowOpen, toggleChatWindow } = useWindow() 
  const recorderControls = useVoiceVisualizer();
  // console.log(recorderControls);
  const userInfo = useAuthContext()
  const currUserId = userInfo.user.newUser.id

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

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


  useEffect(() => {
    if(messages.length === 0) return;
    const messagesContainer = document.querySelector('.chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const getUser = async () => {
      if(userNotFound){
        const userResponse = await axios.get(`${backendUrl}/api/user/get/${notFound.uid}`, {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        })
    
        const userData = userResponse.data;
        console.log('user data', userData)  
        if(userData.success){
          dispatch({ type: 'ADD_USER', payload: { user: userData.user, msg: notFound.msg } })
        }
      }
    }

    getUser()
  }, [userNotFound, user]);


  //fetch messages with a particular user
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

    //realtime message receiving with socket
    socket.on('receiveMessage', (newMessage) => {
      console.log('message received', newMessage)
      dispatch({ type: 'UPDATE_USERS', payload: {uid: newMessage.senderId, msg: newMessage} })
      // setLastMessage(newMessage)
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
        // setLastUser(user._id)
        dispatch({ type: 'UPDATE_USERS', payload: {uid: user._id, msg: res.data.message} })
        // setLastMessage(res.data.message)
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