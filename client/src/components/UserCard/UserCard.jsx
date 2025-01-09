import React, { useEffect, useState } from 'react'
import defaultImg from '../../assets/default-profile.png'
import './usercard.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import TimeAgo from 'react-timeago'

function UserCard({ user, showLastMessage, lastMessage }) {
    const [message, setMessage] = useState(null)
    const userInfo = useAuthContext()

    const formattedActiveStatusString = (value, unit, suffix) => {
        if(unit === 'second') return '1m'
        if(unit === 'minute') return value + 'm'
        if(unit === 'hour') return value + 'h'
        if(unit === 'day') return value + 'd'
        if(unit === 'week') return value + 'w'
        if(unit === 'month') return value + 'm'
        if(unit === 'year') return value + 'y'
    }

    const formattedString = (value, unit, suffix) => {
        if(unit === 'second') return '- now'
        if(unit === 'minute') return '- ' + value + 'm'
        if(unit === 'hour') return '- ' + value + 'h'
        if(unit === 'day') return '- ' + value + 'd'
        if(unit === 'week') return '- ' + value + 'w'
        if(unit === 'month') return '- ' + value + 'm'
        if(unit === 'year') return '- ' + value + 'y'
    }

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
        <div className="profile-container">
            <img src={user.profilePic || defaultImg} alt="Profile" className='profile-pic' />
            { user.active ? <div className="active-status"></div> : <TimeAgo className='offline-status' date={user.lastActive} formatter={formattedActiveStatusString}/>}
        </div>
        {showLastMessage && message ? (
            <>
                <div className='with-last-message'>
                    <p className='username'>{user.name}</p>
                    { message &&               
                    (<div className='message-with-time'>
                        <p className={message.senderId === userInfo.user.newUser.id || message.read ? 'last-message' : 'last-message-unread'}>
                            {message.senderId === userInfo.user.newUser.id ? 'You: ': ''}
                            {message.messageType === 'audio' ? 'sent an audio message': message.content}
                        </p>
                        <TimeAgo className='message-time' date={message && message.createdAt} formatter={
                            formattedString
                        }/>
                    </div>) 
                    }
                </div>
                <div className={message.senderId === userInfo.user.newUser.id || message.read ? '': 'unread-dot'}/>
            </>
        ):<p>{user.name}</p>}
    </div>
  )
}

export default UserCard