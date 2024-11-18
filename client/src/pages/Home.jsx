import React, {useState} from 'react'
import UserList from '../components/UserList'
import ChatWindow from '../components/ChatWindow'

function Home() {
  const [user, setUser] = useState(null);
  return (
    <div className="chatapp">
      <UserList onUserSelect={setUser} />
      <ChatWindow user={user}/>
    </div>
  )
}

export default Home