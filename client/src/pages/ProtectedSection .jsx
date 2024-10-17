import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import UsersList from '../components/UsersList';
import FriendRequestsList from '../components/FriendRequestsList';
import FriendsList from '../components/FriendsList';
import Chat from '../components/Chat';

const ProtectedSection = () => {
    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem('token');
    //const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Please log in to access this page');
            return;
        }

        try {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        } catch (e) {
            setError('Invalid token');
        }
    }, [token]);

    useEffect(() => {
        if (token && user) {
            const fetchUsersAndRequests = async () => {
                try {
                    const response = await fetch('http://localhost:4000/protected', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const message = await response.text();
                        setError(message);
                    } else {
                        const data = await response.json();
                        setUsers(data.users || []);
                        setFriendRequests(data.friendRequests || []);
                        setSentRequests(data.sentRequests || []);
                        setFriends(data.friends || []);
                    }
                } catch (error) {
                    setError('An error occurred while fetching the users');
                }
            };

            fetchUsersAndRequests();
        }
    }, [token, user]);

   

    const sendFriendRequest = async (friendUsername) => {
        if (sentRequests.some(req => req.username === friendUsername)) {
            setError('Friend request already sent');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/send-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ friendUsername }),
            });

            if (!response.ok) {
                const message = await response.text();
                setError(message);
            } else {
                alert('Friend request sent successfully');
                setSentRequests(prevRequests => [...prevRequests, { username: friendUsername }]);
            }
        } catch (error) {
            setError('Failed to send friend request');
        }
    };

    const acceptFriendRequest = async (friendUsername) => {
        try {
            const response = await fetch('http://localhost:4000/accept-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ friendUsername }),
            });

            if (!response.ok) {
                const message = await response.text();
                setError(message);
            } else {
                setFriendRequests(prevRequests => prevRequests.filter(req => req.username !== friendUsername));
                setFriends(prevFriends => {
                    if (!prevFriends.some(friend => friend.username === friendUsername)) {
                        return [...prevFriends, { username: friendUsername }];
                    }
                    return prevFriends;
                });
            }
        } catch (error) {
            setError('Failed to accept friend request');
        }
    };

    const selectFriend = (friend) => {
        setSelectedFriend(friend);
    };

    return (
        <div id="protected-container">
            
          <div id="lists">
            <h2>Welcome, {user?.username}</h2>
            <FriendsList
              friends={friends}
              users={users}
              selectFriend={selectFriend}
            />
            <FriendRequestsList
              friendRequests={friendRequests}
              acceptFriendRequest={acceptFriendRequest}
            />
            <UsersList
              users={users}
              user={user}
              friends={friends}
              sentRequests={sentRequests}
              sendFriendRequest={sendFriendRequest}
            />
          
          </div>
          <div id="chat-box">
            {selectedFriend && <Chat user={user} friend={selectedFriend} />}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
    );
};

export default ProtectedSection;
