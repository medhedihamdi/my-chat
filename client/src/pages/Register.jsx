import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'http://localhost:4000';

function Register({ setToken, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const register = async () => {
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.text();
        alert(data);
      } else {
        const data = await response.json();
        alert('Registration successful!');
      }
    } catch (error) {
      alert('An error occurred during registration');
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.text();
        alert(data);
      } else {
        const data = await response.json();
        const token = data.token;
        setToken(token);
        sessionStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigate('/protected');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <div  id='register'>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      
    </div>
  );
}

export default Register;

//<div id='register-logo'></div>
