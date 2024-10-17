import React from 'react';

const UsersList = ({ users, user, friends, sentRequests, sendFriendRequest }) => {
    return (
        <div id='UsersList'>
            <h3>Users:</h3>
            <div style={{ overflowY:"scroll" }}>
            <ul>
                {users.filter((u) => u.username !== user?.username).map((u) => (
                    <li key={u.username}>
                        {u.username}
                        {friends.some(friend => friend.username === u.username) ? (
                            <span style={{marginLeft:"10px",color:"blue"}}> (Friend)</span>
                        ) : sentRequests.some(req => req.username === u.username) ? (
                            <span> (Request Sent)</span>
                        ) : (
                            <button  style={{marginLeft: "10px"}} onClick={() => sendFriendRequest(u.username)}>Send Friend Request</button>
                        )}
                    </li>
                ))}
                {users.length === 0 && <li>No users found</li>}
            </ul>
            </div>
        </div>
    );
};

export default UsersList;
