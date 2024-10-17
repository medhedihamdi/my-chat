import React from 'react';

const FriendRequestsList = ({ friendRequests, acceptFriendRequest }) => {
    return (
        <div>
            <h3>Friend Requests:</h3>
            <div style={{ overflowY:"scroll" }}>

            <ul>
                {friendRequests.map((request) => (
                    <li key={request.username}>
                        {request.username} sent you a friend request
                        <button   style={{marginLeft: "10px"}} onClick={() => acceptFriendRequest(request.username)}>Accept</button>
                    </li>
                ))}
                {friendRequests.length === 0 && <li>No friend requests</li>}
            </ul>
            </div>
           
        </div>
    );
};

export default FriendRequestsList;
