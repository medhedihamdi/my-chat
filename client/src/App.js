import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // لاحظ أني عدلت الاستيراد بدون الأقواس
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import ProtectedSection from './pages/ProtectedSection ';
import Register from './pages/Register';


function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [isAdmin, setIsAdmin] = useState(false); // حالة لتحديد إذا كان المستخدم أدمن
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === 'admin'); // التحقق إذا كان المستخدم هو أدمن
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    setIsAdmin(false);
  sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleGoBack = () => {
    document.body.style.backgroundColor = '';
    navigate('/protected');
  };

  return (
    <div className="App">
      <nav id="nav">
  <div id="l-n">
    <Link to="/">Home</Link>
    <Link to="/contact">Contact</Link>
    {isAdmin && <Link to="/admin">Admin Dashboard</Link>} {/* رابط يظهر فقط للأدمن */}
  </div>
  <div id="r-n">
  {isLoggedIn ? (
    <div>
        <Link
    to="/" // استخدم `Link` للانتقال إلى الصفحة الرئيسية
    id="logout"
    onClick={(e) => {
      e.preventDefault(); // منع الانتقال الافتراضي لـ `<Link>`
      logout(); // تنفيذ دالة `logout` ثم الانتقال
    }}
  >
    Logout
  </Link>
    </div>
  ) : (
    <Link to="/register">Register</Link>
  )}
</div>

</nav>
      <Routes>
        <Route
          path="/"
          element={
            <div id='home'>
            <h1>Welcome</h1>
            {isLoggedIn ? (
              <p>
                <Link to="/protected"  style={{color:"aqua"}}>Start chatting with your friends</Link>
                <br></br>
              </p>
            ) : (
              <p>
               <Link to="/register" style={{color:"orange"}}>registering here</Link> if you don't have an account or login if you have an account.
              </p>
            )}
            <div id='home-logo'></div>
          </div>
            
          }
        />
        <Route path="/register" element={<Register setToken={setToken} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/protected" element={<ProtectedSection />} />
        <Route path="/admin" element={<AdminDashboard goBack={handleGoBack} />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;  
