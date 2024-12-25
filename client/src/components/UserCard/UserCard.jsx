import React, { useEffect, useState } from 'react'
import defaultImg from '../../assets/default-profile.png'
import './usercard.css'

function UserCard({ user, showLastMessage, lastMessage }) {
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if(!lastMessage) return
        lastMessage.map((msg) => {
            if(msg.senderId === user._id || msg.receiverId === user._id) {
                setMessage(msg)
            }
        })
    },[lastMessage])
  return (
    <div className='user-card'>
        <img src={user.profilePic || defaultImg} alt="Profile" className='profile-pic' />
        {showLastMessage ? (
            <div className='with-last-message'>
                <p className='username'>{user.name}</p>
                <p className='last-message'>{message && (message.messageType === 'audio' ? 'sent an audio message': message.content)}</p>
            </div>
        ):<p>{user.name}</p>}
    </div>
  )
}

export default UserCard