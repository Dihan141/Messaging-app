import React from 'react'
import { IoIosCall } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import './chatheader.css'
import { useChatInfo } from '../../hooks/useChatInfo';

function ChatHeader({ user }) {
  const { toggleChatInfo, isChatInfoOpen } = useChatInfo() 
  return (
    <div className='chat-header'>
        <h2>Chat with {user.name}</h2>
        <IoIosCall size={30} color='#61afed'  className='header-icon'/>
        <MdVideoCall size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} />
        {isChatInfoOpen ? 
        <MdMenuOpen size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/> 
        : <IoMdMenu size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/>}
    </div>
  )
}

export default ChatHeader