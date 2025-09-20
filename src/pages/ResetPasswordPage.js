import React, { useRef } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const emailRef = useRef();

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        console.log('Password reset email sent');
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
      });
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input 
        type="email" 
        placeholder="Email" 
        ref={emailRef}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      <p>Remember your password? <Link to="/">Log in</Link></p>
    </div>
  );
};

export default ResetPasswordPage;