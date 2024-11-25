import React, {useState} from 'react'
import UserList from '../components/UserList'
import ChatWindow from '../components/ChatWindow'

function Home() {
  const [user, setUser] = useState(null);
  const [lastUser, setLastUser] = useState(null);
  return (
    <div className="chatapp">
      <UserList onUserSelect={setUser} lastUser={lastUser}/>
      <ChatWindow user={user} setLastUser={setLastUser}/>
    </div>
  )
}

export default Home