import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UserList({ onUserSelect, lastUser }) {
    const [users, setUsers] = useState([]);
    //const users = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Liz', 'Mallory', 'Nia', 'Oscar', 'Peggy', 'Quinn', 'Ruth', 'Steve', 'Trent', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zane'];
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const overlayRef = useRef(null);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);  

    const userInfo = useAuthContext();


    const handleSearchChange = async (e) => {
      const value = e.target.value;
      setSearchValue(value);
      
    if (value) {
        setIsOverlayVisible(true);
        setFilteredUsers([])  
        const response = await axios.get(`${backendUrl}/api/user/${value}`);
        const data = response.data

        if(data.success) {
          setFilteredUsers(data.users)
        } else {
          setFilteredUsers([])
        }
    };
  }

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/contacts/get`, {
          headers: {
            Authorization: `Bearer ${userInfo.user.token}`
          }
        });

        const data = response.data;
        console.log(data)
        if(data.success) {
          setUsers(data.contacts);
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchContacts();
  }, [])

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

  useEffect(() => {
    console.log('last user', lastUser)  
  }, [lastUser])

    return (
      <div className="user-list">
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
              <li key={user._id} onClick={() => onUserSelect(user)}>
               {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default UserList