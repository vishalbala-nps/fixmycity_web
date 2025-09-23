import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import CitizenPage from './pages/CitizenPage';
import axios from 'axios';
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const usertype = localStorage.getItem('type');
        if (usertype === "admin") {
          axios.post(process.env.REACT_APP_BACKEND_URL+"/api/admin/auth",{idToken:user.accessToken}).then((res) => {
              setUserType(usertype);
              setUser(user);
              localStorage.setItem('admintoken', res.data.token);
          }).catch((err) => {
            setUser(null);
            setUserType(null);
            localStorage.removeItem('type');
            auth.signOut();
            alert("Failed to Signin as Admin");
          });
        } else {
          setUserType(usertype);
          setUser(user);
        }
        console.log(user.accessToken);
      } else {
        setUser(null);
        setUserType(null);
        localStorage.removeItem('type');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/"
        element={user ? (userType === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/citizen" />) : <Navigate to="/login" />}
      />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUserType={setUserType} />} />
      <Route path="/create-user" element={user ? <Navigate to="/" /> : <CreateUserPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />
      <Route path="/citizen" element={user ? <CitizenPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;