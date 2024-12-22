import React from 'react'
import defaultProfile from '../../assets/default-profile.png'
import './profileheader.css'

function ProfileHeader({ user }) {
  return (
    <div className='profile-header'>
        <img src={user.profilePic || defaultProfile} alt="Profile" className='profile-pic' />
        <h2>Chats</h2>
    </div>
  )
}

export default ProfileHeader