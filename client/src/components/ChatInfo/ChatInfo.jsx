import React from 'react'
import { useWindow } from '../../hooks/useWindow'
import { IoMdArrowBack } from "react-icons/io";
import './chatInfo.css'

function ChatInfo() {
  const { toggleChatInfo, isChatInfoOpen } = useWindow()
  return (
    <div className={isChatInfoOpen ? 'chat-info' : 'hidden'}>
      <IoMdArrowBack size={30} color='#61afed'  className='back-icon' onClick={toggleChatInfo}/>
      ChatInfo
    </div>
  )
}

export default ChatInfo