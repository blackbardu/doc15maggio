import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyArrayContext } from '../components/MyArrayContext';
import axios from 'axios';

function LoginPage({ onLogin }) {
  

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setMyArray } = useContext(MyArrayContext);
  
  var myArray = []

  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const handleUserChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3005/api/login', { username, password });
      const { success, token, loggedInUsername, materieInsegnate, isCoordinatore, error } = response.data;
  
      if (success) {
        onLogin(loggedInUsername);
        for (let i = 0; i < materieInsegnate.length; i++) {
          myArray.push(materieInsegnate[i]);
        }
  
        if (isCoordinatore == true) {
          myArray.push('coordinatore')
        }
  
        navigate('/main', { state: { myArray } });
  
        setMyArray(myArray);
        saveTokenToLocalStorage(token);
  
      } else {
        alert(error || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An unexpected error occurred during login. Please try again later.');
    }
  
    setUsername('');
    setPassword('');
  };
  

  

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#32CD32' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUserChange}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
