import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState('');
    const [selectedUserToChangePassword, setSelectedUserToChangePassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    // حماية صفحة الأدمن
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        const user = jwtDecode(token);
        if (user.role !== 'admin') {
            alert('Access Denied');
            navigate('/');
        } else {
            // جلب قائمة المستخدمين
            const fetchUsers = async () => {
                try {
                    const response = await axios.get('http://localhost:4000/admin/dashboard', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUsers(response.data.users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers();
        }
    }, [navigate]);

    const handleDeleteUser = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await axios.delete('http://localhost:4000/admin/delete', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { username: selectedUserToDelete },
            });
            alert('User deleted successfully');
            setUsers(users.filter(user => user.username !== selectedUserToDelete));
            setSelectedUserToDelete('');
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const handleChangePassword = async () => {
        const token = sessionStorage.getItem('token');
        try {
            await axios.put('http://localhost:4000/admin/change-password', {
                username: selectedUserToChangePassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Password changed successfully');
            setSelectedUserToChangePassword('');
            setNewPassword('');
        } catch (error) {
            alert('Error changing password');
        }
    };

    const goBack =()=>{
        navigate('/protected')
    }

    return (
        <div id='admin'>
            <div  id='admin-controls'>
            <h2>Admin Dashboard</h2>
            <h3>Users List</h3>
            <div id='admin-userlist'>
            <ul>
                {users.map(user => (
                    <li key={user.username}>{user.username}</li>
                ))}
            </ul>
            </div>
           

            <div>
                <h3>Delete User</h3>
                <select value={selectedUserToDelete} onChange={(e) => setSelectedUserToDelete(e.target.value)}>
                    <option value="">Select user to delete</option>
                    {users.map(user => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button onClick={handleDeleteUser}>Delete</button>
            </div>

            <div>
                <h3>Change User Password</h3>
                <select value={selectedUserToChangePassword} onChange={(e) => setSelectedUserToChangePassword(e.target.value)}>
                    <option value="">Select user to change password</option>
                    {users.map(user => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Change Password</button>
            </div>

            <button onClick={goBack}>go back </button>
        </div>
        </div>
    );
};

export default AdminDashboard;
