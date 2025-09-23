
import React, { useRef, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, AppBar, Toolbar, ToggleButton, ToggleButtonGroup } from '@mui/material';

const LoginPage = ({ setUserType }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [userType, setUserTypeState] = useState('citizen');
  React.useEffect(function() {
    localStorage.setItem('type', userType);
  },[userType]);
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User logged in:', user);
        setUserType(userType);
      })
      .catch((error) => {
        alert('Error logging in:');
      });
  };

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserTypeState(newUserType);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FixMyCity
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <br />
          <form style={{ width: '100%', marginTop: 1 }} noValidate>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              aria-label="user type"
              fullWidth
              size="small"
              style={{ marginBottom: 8 }}
            >
              <ToggleButton value="citizen" aria-label="citizen">
                Citizen
              </ToggleButton>
              <ToggleButton value="admin" aria-label="admin">
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: '24px 0px 16px' }}
              onClick={handleLogin}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/create-user" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
