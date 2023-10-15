import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function Login({ setUserSession }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post('/login', {
            Login: username, 
            Password: password
        }).then((response) => {
                setUserSession(response.data)
                navigate("/");
        })
    }


    return   <div style={{ minHeight: "100vh" }}>
    <NavbarE />
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-wrap" style={{width:"700px"}}>
      <Container
      className="d-flex flex-column mt-5 mb-5 p-5 border border-5 rounded"
      style={{width: "75%"}}
    >
      <h1 className="text-center">LOGOWANIE</h1>

      <Form.Group className="mt-3">
        <Form.Label htmlFor="username">Login:</Form.Label>
        <Form.Control
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label htmlFor="password">Password:</Form.Label>
        <Form.Control
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button onClick={login} className="btn btn-primary mt-5 w-100">
        Login
      </Button>

      <p className="mt-3">
        Nie masz jeszcze konta? Przejdź do <a href="/Rejestracja">rejestracji!</a>
      </p>

      {loginStatus && (
        <Alert variant="danger" className="mt-3">
          {loginStatus}
        </Alert>
      )}
    </Container>
      </div>
    </div>
  </div>
}

