import React from 'react'

function UserList() {
    const users = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Karl', 'Liz', 'Mallory', 'Nia', 'Oscar', 'Peggy', 'Quinn', 'Ruth', 'Steve', 'Trent', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zane'];

    return (
      <div className="user-list">
        <input type="text" placeholder="Search..." className="search-input" />
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