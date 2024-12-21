import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthContext';
import { useWindow } from '../hooks/useWindow';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UserList({ onUserSelect, lastUser }) {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const overlayRef = useRef(null);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);  
    const [debounceTimer, setDebounceTimer] = useState(null); 
    const { isChatWindowOpen, isChatInfoOpen, toggleChatWindow} = useWindow();

    const userInfo = useAuthContext();

    //Handle search input change
    const handleSearchChange = async (e) => {
      const value = e.target.value;
      setSearchValue(value);
      setFilteredUsers([]);

      if(debounceTimer) {
        clearTimeout(debounceTimer)
      }

      const newTimer = setTimeout(async () => {
        if (value) {
          setIsOverlayVisible(true);
          //setFilteredUsers([])  
          const response = await axios.get(`${backendUrl}/api/user/${value}`);
          const data = response.data
  
          if(data.success) {
            setFilteredUsers(data.users)
          } else {
            setFilteredUsers([])
          }
        };
      }, 1000);
      
      setDebounceTimer(newTimer);
  }

  //Fetch last messages and users and set the users state
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/messages/last-messages/get`, {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        });

        const data = response.data;
        console.log(data)
        if(data.success) {
          const messages = data.messages;
          const users = messages.map((message) => {
            const user = message.senderInfo._id === userInfo.user.newUser.id ? message.receiverInfo : message.senderInfo;
            return user;
          })

          setUsers(users);
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchContacts();
  }, [])

  //Close search overlay when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log('click outside')
      if(overlayRef.current && !overlayRef.current.contains(e.targer)){
        setIsOverlayVisible(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  },[])

  //Move last user to the top of the list, if the user is already in the list, move it to the top
  //else fetch the user and add it to the top of the list
  useEffect(() => {
    console.log('last user', lastUser)  
    const index = users.findIndex((user) => user._id === lastUser)
    if(index !== -1){
      const user = users[index];
      const newUsers = [...users];
      newUsers.splice(index, 1);
      newUsers.unshift(user);
      setUsers(newUsers);
    }
    else {
      const getUser = async () => {
        const userResponse = await axios.get(`${backendUrl}/api/user/get/${lastUser}`, {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        })
    
        const userData = userResponse.data;
        if(userData.success){
          const user = userData.user;
          const newUsers = [user, ...users];
          setUsers(newUsers);
        }
      }

      if(lastUser){
        getUser();
      }
    }
  }, [lastUser])

    return (
      <div className={isChatWindowOpen || isChatInfoOpen? 'user-list hide-user-list' : 'user-list'}>
        <input type="text" placeholder="Search..." className="search-input" value={searchValue} onChange={handleSearchChange} />

        {/* overlay for search results */}
        {searchValue && isOverlayVisible && (
          <div className="search-overlay" ref={overlayRef}>
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user._id} onClick={() => {
                      setSearchValue('')
                      onUserSelect(user)
                    }
                  }>
                    {user.name}
                  </li>
                ))
              ) : (
                <li>No match found</li>
              )}
            </ul>
          </div>
        )}

        {users.length === 0 ? (
          <p className='no-user'>
            Add a user to start chatting
          </p>    
        ): (
          <ul>
            {users.map((user) => (
              <li key={user._id} onClick={() => { 
                  if(!isChatWindowOpen){
                    toggleChatWindow()
                  }
                  onUserSelect(user)
                }
              }>
               {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default UserList