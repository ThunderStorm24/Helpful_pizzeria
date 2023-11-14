import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";

export default function Login({ setUserSession }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [captchaText, setCaptchaText] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    const recaptchaRef = useRef();
    const key = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' //DO TESTOW
    const handleRecaptchaChange = (value) => {
      setCaptchaText('')
      setRecaptchaValue(value);
    };

    Axios.defaults.withCredentials = true;

    const login = () => {

      if (!recaptchaValue) {
        setCaptchaText("Udowodnij, że nie jesteś robotem.")
        return;
      }

        Axios.post('/login', {
            Login: username, 
            Password: password
          }).then((response) => {
            setUserSession(response.data);
            navigate("/");
            window.location.reload();
        }).catch((error) => {
                setLoginStatus(error.response.data.error);
                setRecaptchaValue(null);  
                if (recaptchaRef.current) {
                  recaptchaRef.current.reset();
                }
        });
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
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
        <Form.Control
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label htmlFor="password">Hasło:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i className="fa fa-lock ml-2"></i></InputGroup.Text>
        <Form.Control
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </InputGroup>
      </Form.Group>

      <div className="d-flex justify-content-center mt-2">
      <ReCAPTCHA
        className="recaptchaa"
        ref={recaptchaRef}
        sitekey='6LeqfAwpAAAAALFmnlMsOko8ext2FeVzkTE_N9Pt'
        onChange={handleRecaptchaChange}
        theme='dark'
        size='normal'
      />
      </div>
      <div className="text-danger">{captchaText}</div>

      <Button onClick={login} className="btn btn-primary mt-4 w-100">
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

