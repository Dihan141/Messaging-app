import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function UserList({ onUserSelect, lastUser }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const users = [];
    //const users = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Liz', 'Mallory', 'Nia', 'Oscar', 'Peggy', 'Quinn', 'Ruth', 'Steve', 'Trent', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zane'];
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const overlayRef = useRef(null);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);  


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
              <li key={user} onClick={() => onUserSelect(user)}>
               {user}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default UserList