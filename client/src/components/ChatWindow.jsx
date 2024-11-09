import React from 'react'

function ChatWindow() {
  return (
    <div className='chat-window'>          
        <h2>Chat with xyz</h2>
        <div className="chat-messages">
        {/* Here you can render message history or live chat messages */}
        </div>
        <input type="text" placeholder="Type a message..." className="message-input" />
    </div>
  )
}

export default ChatWindow