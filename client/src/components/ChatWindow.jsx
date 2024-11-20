import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

function ChatWindow({ user }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const socket = io(backendUrl)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('Message received:', message)
      setMessages((prevMessages) => [...prevMessages, message]);
    })

    return () => {
      socket.off('message')
    }
  },[])

  const sendMessage = () => {
    if(input.trim()){
      socket.emit('message', input)
      setInput('')
    }
  }

  return (
    <div className='chat-window'>  
      { user ? <div className="message-window">
        <h2>Chat with {user.name}</h2>
        <div className="chat-messages">
        {/* Here you can render message history or live chat messages */}
          {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
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