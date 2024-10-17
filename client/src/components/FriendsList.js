// FriendsList.js
import React from 'react';

const FriendsList = ({ friends, users, selectFriend }) => {
    return (
        <div>
            <h3>Your Friends:</h3>
            <div style={{ overflowY:"scroll" }}>
            <ul>
                {friends.map((friend) => (
                    <li key={friend.username}>
                        {friend.username} - 
                        <span style={{ color: users.find(u => u.username === friend.username)?.status === 'online' ? 'green' : 'red' }}>
                            {users.find(u => u.username === friend.username)?.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                        <button style={{marginLeft: "10px"}} onClick={() => selectFriend(friend)}>Chat</button>
                    </li>
                ))}
                {friends.length === 0 && <li>No friends yet</li>}
            </ul>
            </div>
        </div>
    );
};

export default FriendsList;
