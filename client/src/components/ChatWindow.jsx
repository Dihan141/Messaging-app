import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuthContext } from '../hooks/useAuthContext'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const socket = io(backendUrl)

function ChatWindow({ user }) {
  const userInfo = useAuthContext()
  const currUserId = userInfo.user.newUser.id

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
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
        console.log('working')
        console.log(res.data)
        setMessages(res.data.messages)
      }).catch((err) => {
        console.log(err)
      })
    }

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  },[user])

  const sendMessage = async () => {
    if(input.trim()){
      const message = {
        senderId: currUserId,
        receiverId: user._id,
        content: input
      }

      await axios.post(`${backendUrl}/api/messages`, message, {
        headers: {
          Authorization: `Bearer ${userInfo.user.token}`
        }
      }).then((res) => {
        console.log(res.data)
        setMessages((prevMessages) => [...prevMessages, res.data.message])
        setInput('')
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <div className='chat-window'>  
      { user ? <div className="message-window">
        <h2>Chat with {user.name}</h2>
        <div className="chat-messages">
        {/* Here you can render message history or live chat messages */}
          {messages.map((msg, index) => (
              <p key={index}>{msg.content}</p>
          ))}
        </div>
        <div className="input-container">
          <input type="text" placeholder="Type a message..." className="message-input" value={input} onChange={(e) => setInput(e.target.value)}/>
          <button className='message-input-btn'  onClick={sendMessage} >Send</button>
        </div>
      </div> : <div className='no-chat'>
        <p>Select a user to open inbox</p>
        </div>}       
    </div>
  )
}

export default ChatWindow