import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import { Container, Form, Button, Alert, InputGroup } from 'react-bootstrap';

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

    const [validated, setValidated] = useState(false);

    Axios.defaults.withCredentials = true;

    const register = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const form = event.currentTarget;

    if (form.checkValidity() === true) {

    }
    setValidated(true);

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
      <div className="d-flex flex-wrap" style={{width:"1000px"}}>
      <Container
      className="d-flex flex-column mt-5 mb-5 p-5 border border-5 rounded"
      style={{width: "75%"}}
    >
      <h1>REJESTRACJA</h1>

      <Form noValidate validated={validated}>

      <Form.Group controlId="username" className="mt-3">
        <Form.Label>Login:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="^[a-zA-Z0-9]+$"
          maxLength="50"
          minLength="4"
          type="text"
          value={logReg}
          onChange={(e) => setLogReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Login musi mieć conajmniej 4 znaki i nie może zawierać znaków specjalnych!
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="password" className="mt-3">
        <Form.Label>Password:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i className="fa fa-lock"></i></InputGroup.Text>
        <Form.Control
          required
          maxLength="150"
          minLength="5"
          type="password"
          value={passReg}
          onChange={(e) => setPassReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Hasło musi mieć conajmniej 5 znaków!
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="name" className="mt-3">
        <Form.Label>Imię:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$"
          maxLength="50"
          minLength="3"
          type="text"
          value={nameReg}
          onChange={(e) => setNameReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Imię musi zaczynać się z dużej litery, mieć conajmniej 3 znaki i nie może zawierać znaków specjalnych
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="surname" className="mt-3">
        <Form.Label>Nazwisko:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i class="fa fa-user"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$"
          maxLength="50"
          minLength="3"
          type="text"
          value={surnameReg}
          onChange={(e) => setSurnameReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Nazwusji musi zaczynać się z dużej litery, mieć conajmniej 3 znaki i nie może zawierać znaków specjalnych
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="address" className="mt-3">
        <Form.Label>Adres:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i class="fa fa-address-card" aria-hidden="true"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s]+)\s(\d+\/\d+[A-Za-z]*)\s([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+)"
          maxLength="70"
          type="text"
          value={addressReg}
          onChange={(e) => setAdressReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Adres musi być w formacie: ulica numer/mieszkanie miasto
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="zip-code" className="mt-3">
        <Form.Label>Kod Pocztowy:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i class="fa fa-map-pin" aria-hidden="true"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="\d{2}-\d{3}"
          maxLength="6"
          type="text"
          value={zipCodeReg}
          onChange={(e) => setZipCodeReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Kod pocztowy musi być w formacie XX-XXX
        </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="phone-number" className="mt-3">
        <Form.Label>Numer Telefonu:</Form.Label>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1"><i class="fa fa-phone"></i></InputGroup.Text>
        <Form.Control
          required
          pattern="\+48\d{9}"
          maxLength="12"
          type="text"
          value={phoneReg}
          onChange={(e) => setPhoneReg(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          Telefon musi być w formacie +48XXXXXXXXX
        </Form.Control.Feedback>
        </InputGroup>
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

      </Form>
      <p className="mt-3">
        Masz już konto? Przejdź do <a href="/Login">Logowania!</a>
      </p>
      </Container>
        
        </div>
    </div>
    </div>
}

