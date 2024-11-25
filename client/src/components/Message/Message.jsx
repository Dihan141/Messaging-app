import React from 'react'
import './Message.css'

function Message({message, isSender}) {
    const { senderId, receiverId, content } = message
  return (
    <div className={`msg-container ${isSender ? 'pinned-right': ''}`}>
        <p>{content}</p>
    </div>
  )
}

export default Message