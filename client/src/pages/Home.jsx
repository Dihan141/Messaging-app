import React from 'react'
import UserList from '../components/UserList'
import ChatWindow from '../components/ChatWindow'

function Home() {
  return (
    <div className="chatapp">
      <UserList />
      <ChatWindow />
    </div>
  )
}

export default Home