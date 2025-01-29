import React from 'react'
import { IoIosCall } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import './chatheader.css'
import { useWindow } from '../../hooks/useWindow';
import TimeAgo from 'react-timeago'
import defaultProfile from '../../assets/default-profile.png'

function ChatHeader({ user }) {
  const { toggleChatInfo, isChatInfoOpen, toggleChatWindow } = useWindow() 

  const formattedString = (value, unit, suffix) => {
    if(unit === 'second') return 'Active now'
    if(unit === 'minute') return 'Active ' + value + 'm ' + 'ago'
    if(unit === 'hour') return 'Active ' + value + 'h ' + 'ago'
    if(unit === 'day') return 'Active ' + value + 'd ' + 'ago'
    if(unit === 'week') return 'Active ' + value + 'w ' + 'ago'
    if(unit === 'month') return 'Active ' + value + 'm ' + 'ago'
    if(unit === 'year') return 'Active ' + value + 'y ' + 'ago'
}

  return (
    <div className='chat-header'>
        <IoMdArrowBack size={30} color='#61afed'  className='chat-window-back-icon' onClick={toggleChatWindow}/>
        <div className="name-image-container">
            <img src={user.profilePic || defaultProfile} alt="Profile" className='profile-pic-chat' />
            <div className="name-status">
              <h2>{user.name}</h2>
              <p>{user.active ? 'Active now' : <TimeAgo date={user.lastActive} formatter={formattedString}/>}</p>
            </div>
        </div>
        <IoIosCall size={30} color='#61afed'  className='header-icon'/>
        <MdVideoCall size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} />
        {isChatInfoOpen ? 
        <MdMenuOpen size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/> 
        : <IoMdMenu size={40} color='#61afed' className='header-icon' style={{marginTop: -5}} onClick={toggleChatInfo}/>}
    </div>
  )
}

export default ChatHeader