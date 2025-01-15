import React from 'react'

function TextMessage({ isSender, content, positionStyle }) {

  return (
    <div className={`msg-container ${positionStyle()} ${isSender ? 'pinned-right' : ''}`}>
      <p>{content}</p>
    </div>
  )
}

export default TextMessage