import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate  } from 'react-router-dom';



function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate  = useNavigate ();

  const handleUserChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    // Perform login logic here, e.g. send login request to server

    // Clear form fields after login attempt
    setUsername('');
    setPassword('');
    navigate ('/main');
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#32CD32' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Inserisci username"
              value={username}
              onChange={handleUserChange}
            />
        </Form.Group>

        <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
            type="password"
            placeholder="Inserisci password"
            value={password}
            onChange={handlePasswordChange}
        />
        </Form.Group>
        <br/>
        <Button variant="primary" type="submit" className="w-100">
        Login
        </Button>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
