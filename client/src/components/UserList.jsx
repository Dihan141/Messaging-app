import React, { useState } from 'react'
import axios from 'axios'

function UserList() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const users = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Liz', 'Mallory', 'Nia', 'Oscar', 'Peggy', 'Quinn', 'Ruth', 'Steve', 'Trent', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zane'];
    const [searchValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);  

    const handleSearchChange = async (e) => {
      const value = e.target.value;
      setSearchValue(value);
      
    if (value) {
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
    return (
      <div className="user-list">
        <input type="text" placeholder="Search..." className="search-input" value={searchValue} onChange={handleSearchChange} />

        {/* overlay for search results */}
        {searchValue && (
          <div className="search-overlay">
            <ul>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li key={user._id}>
                    {user.name}
                  </li>
                ))
              ) : (
                <li>No match found</li>
              )}
            </ul>
          </div>
        )}
        <ul>
          {users.map((user) => (
            <li key={user} onClick={() => onUserSelect(user)}>
              {user}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default UserList