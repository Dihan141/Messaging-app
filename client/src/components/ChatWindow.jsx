import React, { useEffect, useState, useRef, act } from 'react'
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
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import ChatHeader from './ChatHeader/ChatHeader';
import { useWindow } from '../hooks/useWindow';
import { useUserContext } from '../hooks/useUserContext';
import { useMessageContext } from '../hooks/useMessageContext';
import { MESSAGE_ACTIONS } from '../context/MessageContext';
import { ACTIONS } from '../context/UserContext';
import { useChatUserContext } from '../hooks/useChatUserContext';
import { CHAT_USER_ACTIONS } from '../context/ChatUserContext';
import { useMessageSecurityContext } from '../hooks/useMessageSecurityContext';
import { MESSAGE_SECURITY_ACTIONS } from '../context/MessageSecurityContext';
import { acceptUser } from '../Utils/MessageSecurity';
const backendUrl = import.meta.env.VITE_BACKEND_URL
const socket = io(backendUrl)

function ChatWindow() {
  const { userNotFound, notFound, dispatch } = useUserContext()
  const { chatUser, dispatchChatUser } = useChatUserContext()
  const { messages, dispatchMsg } = useMessageContext()
  const { isChatInfoOpen, isChatWindowOpen, toggleChatWindow } = useWindow() 
  const recorderControls = useVoiceVisualizer();
  console.log(recorderControls.recordedBlob);
  const userInfo = useAuthContext()
  const currUserId = userInfo.user.newUser.id

  const { currUserConnectionStatus, chatUserConnectionStatus, dispatchSecurityAction } = useMessageSecurityContext()

  // const [messages, setMessages] = useState([])
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
  }, [userNotFound, chatUser]);

  useEffect(() => {
    socket.emit('joinRoom', currUserId)
    socket.on('get-online-users', (users) => {
      console.log('online users', users)
      dispatchChatUser({ type: CHAT_USER_ACTIONS.UPDATE_STATUS, payload: { activeUsers: users.map((user) => user._id) } })
      dispatch({ type: ACTIONS.SET_ACTIVE, payload: { activeUsers: users.map((user) => user._id) } })
    })
  }, [])

  //get and set connection status
  useEffect(() => {
    const getConnectionStatus = async(id) => {
      const response = await axios.get(`${backendUrl}/api/connections/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        }
      )

      return response.data
    }
    const fetchStatuses = async () => {
      if (chatUser) {
        const currUserConStatus = await getConnectionStatus(currUserId);
        const chatUserConStatus = await getConnectionStatus(chatUser._id);
  
        console.log(currUserConStatus);
        console.log(chatUserConStatus);
        dispatchSecurityAction({ type: MESSAGE_SECURITY_ACTIONS.SET_CONNECTION_STATUS, payload:{currUserConStatus, chatUserConStatus, currUserId, chatUserId: chatUser._id}})
      }
    };

    fetchStatuses()
  }, [chatUser])


  //fetch messages with a particular user
  useEffect(() => {
    // socket.emit('joinRoom', currUserId)
    if(chatUser){
      // socket.emit('joinRoom', currUserId)

      axios.get(`${backendUrl}/api/messages/${chatUser._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.user.token}`
        }
      }).then((res) => {
        // console.log('working')
        // console.log(res.data)
        dispatchMsg({ type: MESSAGE_ACTIONS.SET_MESSAGES, payload: res.data.messages })
      }).catch((err) => {
        console.log(err)
      })
    }

    //realtime message receiving with socket
    socket.on('receiveMessage', (newMessage) => {
      console.log('message received', newMessage)
      dispatch({ type: 'UPDATE_USERS', payload: {uid: newMessage.senderId, msg: newMessage} })
      // setLastMessage(newMessage)
      if(chatUser && newMessage.senderId === chatUser._id){
        dispatchMsg({type: MESSAGE_ACTIONS.ADD_MESSAGE, payload: newMessage})
        dispatch({ type: ACTIONS.MARK_READ, payload: { senderId: chatUser._id, receiverId: currUserId } })
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  },[chatUser])

  //mark messages as read
  useEffect(() => { 
    if(chatUser){
      axios.post(`${backendUrl}/api/messages/mark-as-read`, { otherUserId: chatUser._id }, 
        {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        })
        .then((res) => {
          if(res.data.success){
            dispatch({ type: 'MARK_READ', payload: { senderId: chatUser._id, receiverId: currUserId } })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [chatUser])

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
      formData.append('receiverId', chatUser._id)
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
        console.log('message sent')
        dispatchMsg({type: MESSAGE_ACTIONS.ADD_MESSAGE, payload: res.data.message})
        // setLastUser(user._id)
        dispatch({ type: 'UPDATE_USERS', payload: {uid: chatUser._id, msg: res.data.message} })
        // setLastMessage(res.data.message)
        setInput('')
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const lastInGroup = (index) => {
    return index == messages.length-1 || (messages[index+1] && messages[index+1].senderId != chatUser._id)
  }

  const firstMsg = (index) => {
    return messages[index] && 
           (index < messages.length - 1 && 
           messages[index].senderId === messages[index+1].senderId && 
           index > 0 && 
           messages[index].senderId !== messages[index-1]?.senderId) ||
           index == 0 && messages[index].senderId === messages[index+1].senderId ;
  };
  

  const middleMsg = (index) => {
    return messages[index] && 
           index > 0 && 
           index < messages.length - 1 &&
           (messages[index].senderId === messages[index+1].senderId && 
           messages[index].senderId === messages[index-1].senderId);
  };
  

  const lastMsg = (index) => {
    return messages[index] && 
           index > 0 && 
           (messages[index].senderId === messages[index-1].senderId && 
            messages[index].senderId !== messages[index+1]?.senderId);
  };

  //displaying input status if conn is approved from both side, show connection status if any user in blocklist or pending
  const renderConStatus = () => {
    if(currUserConnectionStatus == 'approved' && chatUserConnectionStatus == 'approved'){
      return <div className="input-container">
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
    } else if(currUserConnectionStatus == 'blocked' && chatUserConnectionStatus == 'approved') {
      return <div className="blocked-user">
        <div className="blocked-section">
          <p>You've blocked {chatUser.name}</p>
          <p>You can't message or call them in this chat and you won't receive their message or calls.</p>
          <div className="block-btn-section">
            <button className='unblock-btn'>Unblock</button>
            <button className='delete-btn'>Delete</button>
          </div>
        </div>
      </div>
    } else if(currUserConnectionStatus == 'approved' && chatUserConnectionStatus == 'blocked') {
      return <div className='blocked-by-user'>
        <p>You have been blocked by this user.</p>
      </div>
    } else if (currUserConnectionStatus == 'pending' && chatUserConnectionStatus == 'approved') {
      return <div className="pending-user">
        <p>{chatUser.name} is trying to message you.</p>
        <div className="pending-btn-section">
          <button className='pending-accept-btn' onClick={() => acceptUser(userInfo, chatUser._id)}>Accept</button>
          <button className='pending-block-btn'>Block</button>
        </div>
      </div>
    }
  }
  

  return (
    <div className={isChatInfoOpen || !isChatWindowOpen ? 'chat-window hide-chat-window': 'chat-window'}>  
      { chatUser ? <div className="message-window">
        <ChatHeader user={chatUser} />
        <div className="chat-messages">
        {/* Here you can render message history or live chat messages */}
          {messages && messages.map((msg, index) => {
              const lastMsgInGrp = lastInGroup(index)
              const msgPosition = {
                firstMsg: firstMsg(index),
                middleMsg: middleMsg(index),
                lastMsg: lastMsg(index)
              }
              return <Message key={index} message={msg} isSender={msg.senderId === currUserId} lastMsgInGrp={lastMsgInGrp} position={msgPosition}/>
          })}
        </div>
        {renderConStatus()}
      </div> : <div className='no-chat'>
        <p>Select a user to open inbox</p>
        </div>}       
    </div>
  )
}

export default ChatWindow