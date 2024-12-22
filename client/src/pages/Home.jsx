import React, {useState} from 'react'
import UserList from '../components/UserList'
import ChatWindow from '../components/ChatWindow'
import ChatInfo from '../components/ChatInfo/ChatInfo';

function Home() {
  const [user, setUser] = useState(null);
  const [lastUser, setLastUser] = useState(null);
  const [lastMessage, setLastMessage] = useState();
  return (
    <div className="chatapp">
      <UserList onUserSelect={setUser} lastUser={lastUser} lastMessage={lastMessage}/>
      <ChatWindow user={user} setLastUser={setLastUser} setLastMessage={setLastMessage}/>
      <ChatInfo />
    </div>
  )
}

export default Home