import React from 'react'
import { IoIosCall } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import './chatheader.css'
import { useWindow } from '../../hooks/useWindow';

function ChatHeader({ user }) {
  const { toggleChatInfo, isChatInfoOpen, toggleChatWindow } = useWindow() 
  return (
    <div className='chat-header'>
        <IoMdArrowBack size={30} color='#61afed'  className='chat-window-back-icon' onClick={toggleChatWindow}/>
        <h2>{user.name}</h2>
        <IoIosCall size={30} color='#61afed'  className='header-icon'/>
        <MdVideoCall size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} />
        {isChatInfoOpen ? 
        <MdMenuOpen size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/> 
        : <IoMdMenu size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/>}
    </div>
  )
}

export default ChatHeader