import React, {useState} from 'react'
import UserList from '../components/UserList'
import ChatWindow from '../components/ChatWindow'
import ChatInfo from '../components/ChatInfo/ChatInfo';

function Home() {
  const [user, setUser] = useState(null);

  return (
    <div className="chatapp">
      <UserList />
      <ChatWindow />
      <ChatInfo />
    </div>
  )
}

export default Home