
import React from 'react';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

const HomePage = ({ user }) => {

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User logged out');
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default HomePage;
