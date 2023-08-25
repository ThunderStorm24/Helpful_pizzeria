import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function Login() {
    const navigate = useNavigate();

    const [logReg, setLogReg] = useState('');
    const [passReg, setPassReg] = useState('');
    const [nameReg, setNameReg] = useState('');
    const [surnameReg, setSurnameReg] = useState('');
    const [addressReg, setAdressReg] = useState('');
    const [zipCodeReg, setZipCodeReg] = useState('');
    const [phoneReg, setPhoneReg] = useState('+48');

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);

    Axios.defaults.withCredentials = true;

    const register = () => {
        Axios.post('/register', {
            Name: nameReg, 
            Surname: surnameReg, 
            Adress: addressReg, 
            Zipcode: zipCodeReg, 
            Phone: phoneReg, 
            Login: logReg, 
            Password: passReg
        }).then((data) => {
            console.log(data)
            setMessage(data.data);
            setErrors([]);
            navigate("/Login");
        }).catch((error) => {
            console.log('error', error);
            setErrors(error.response.data.errors);
    })
    }
    //Rejestracja do zrobienia, od strony serwera i frontendu
    return <div style={{ minHeight: "100vh" }}>
    <NavbarE />
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-wrap" style={{width: "600px"}}>
      <Container
      className="d-flex flex-column m-5 p-5 border border-5 rounded col-10 col-md-12"
      style={{ margin: "auto" }}
    >
      <h1>REJESTRACJA</h1>

      <Form.Group controlId="username" className="mt-3">
        <Form.Label>Login:</Form.Label>
        <Form.Control
          type="text"
          value={logReg}
          onChange={(e) => setLogReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="password" className="mt-3">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={passReg}
          onChange={(e) => setPassReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="name" className="mt-3">
        <Form.Label>Imię:</Form.Label>
        <Form.Control
          type="text"
          value={nameReg}
          onChange={(e) => setNameReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="surname" className="mt-3">
        <Form.Label>Nazwisko:</Form.Label>
        <Form.Control
          type="text"
          value={surnameReg}
          onChange={(e) => setSurnameReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="address" className="mt-3">
        <Form.Label>Adres:</Form.Label>
        <Form.Control
          type="text"
          value={addressReg}
          onChange={(e) => setAdressReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="zip-code" className="mt-3">
        <Form.Label>Kod Pocztowy:</Form.Label>
        <Form.Control
          type="text"
          value={zipCodeReg}
          onChange={(e) => setZipCodeReg(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="phone-number" className="mt-3">
        <Form.Label>Numer Telefonu:</Form.Label>
        <Form.Control
          type="text"
          value={phoneReg}
          onChange={(e) => setPhoneReg(e.target.value)}
        />
      </Form.Group>

      {errors && errors.length > 0 ? (  
        <Alert variant="danger" className="mt-4">
        <ul className="text-danger" style={{ margin: "0px", textAlign: "left" }}>
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      </Alert>
          ) : (
            <p className="mt-4 text-success">{message}</p>  
          )}

      <Button onClick={register} className="mt-2" variant="primary">
        Zarejestruj
      </Button>

      <p className="mt-3">
        Masz już konto? Przejdź do <a href="/Login">Logowania!</a>
      </p>
      </Container>
        
        </div>
    </div>
    </div>
}

