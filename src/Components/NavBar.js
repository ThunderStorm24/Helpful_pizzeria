import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import  Modal  from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const NavbarE = ({addItemsCart, subtractItemsCart}) => {
  const navigate = useNavigate();

  const [loginStatus, setLoginStatus] = useState ("");
  const [loginID, setLoginID] = useState (0);

  const [isListening, setIsListening] = useState (false);
  const [message, setMessage] = useState('');

  const [CountItemsCart, setCountItemsCart] = useState(0);
  
  useEffect(() => {
    Axios.get(`/Koszyk/${loginID}`)
      .then(response => { 
        const data = response.data;
        console.log("DANE:", data);
        console.log("Login:", loginID);
        setCountItemsCart(data.length);
      })
      .catch(error => {
        console.error('Wystąpił błąd podczas pobierania danych z koszyka:', error);
      });
  }, [loginStatus]);

  if (typeof addItemsCart === 'undefined') {
    addItemsCart=0;
  }
  if (typeof subtractItemsCart === 'undefined') {
    subtractItemsCart=0;
  }

  const TotalItemsCart = CountItemsCart + addItemsCart + subtractItemsCart;

  console.log("LICZBA DODAJ DO KOSZYKA:"+addItemsCart);
  console.log("LICZBA ODEJMIJ DO KOSZYKA:"+subtractItemsCart);
  
  useEffect(() => {
    Axios.get("/login").then((response) => {
        if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].Login)
        setLoginID(response.data.user[0].ID_Uzytkownika)
        }
    })
}, [])

  const handleLogout = () => {
    Axios.get('/wyloguj').then((response) => {
      alert('Wylogowano!');
      setLoginStatus("");
      navigate('/');
      window.location.reload();
    });
  };

  const commands = [
    {
      command: ['menu','jedzenie','ceny','głodny','jeść',            
                'food','hungry','price','eat'],
      callback: () => {
        setMessage('Menu');
        setIsListening(false);
        SpeechRecognition.stopListening();
      }
    },
    {
      command: ['wyczyść','odśwież','zresetuj',
                'clear','reset','refresh'],
      callback: ({resetTranscript}) => resetTranscript()
    },
    {
      command: ['zatrzymaj',
                'stop'],
      callback: () => {
        setIsListening(false);
        SpeechRecognition.stopListening()
      }
    }
  ]

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({continuous: true});
      setIsListening(true);
    }
  }

  const {
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const{ transcript , resetTranscript} = useSpeechRecognition ({ commands });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

    return (
      
       <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
  <Container fluid>
    <Navbar.Brand href="#">Pizzeria La Thunderas</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px'}} navbarScroll sticky='top'>
        <Nav.Link href="/">Strona Główna</Nav.Link>
        <Nav.Link href="/Menu">Menu</Nav.Link>
        <NavDropdown title="Inne" id="navbarScrollingDropdown">
          <NavDropdown.Item href="/#Contact">Kontakt</NavDropdown.Item>
          <NavDropdown.Item href="/#Location">
            Lokalizacja
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/#about">
            O nas
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Form className="d-flex ms-3" action={message} method="GET">
        <Form.Control type="search" placeholder="Search" value={message} className="me-2" aria-label="Search" />
        <Button type="submit" style={{margin: '5px'}}>Znajdź</Button>
      </Form>
      <Button onClick={toggleListening} style={{margin: '5px'}}>{isListening ? 'Stop' : 'Start'}</Button>
      {loginStatus ? (
    <DropdownButton className="ms-2" variant="secondary" title={loginStatus} id="dropdown-item-button" align="end">
    <Dropdown.Item href="/Profil">Mój profil</Dropdown.Item>
    <Dropdown.Item href="/koszyk">Koszyk ({TotalItemsCart})</Dropdown.Item>
    <Dropdown.Item href="/zamowienia">Moje zamówienia ()</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item onClick={handleLogout}>Wyloguj</Dropdown.Item>
    </DropdownButton>
    ) : (
    <Button href="/Login" className="btn-success ms-2">Zaloguj</Button>
)}
    </Navbar.Collapse>
  </Container>
  <Modal
    show={isListening}
    onHide={() => {
      setIsListening(false);
      SpeechRecognition.stopListening();
    }}
    dialogClassName="modal-90w"
    aria-labelledby="example-custom-modal-styling-title"
  >
    <Modal.Header closeButton style={{backgroundColor: '#444444' , color: 'white'}}>
      <Modal.Title id="example-custom-modal-styling-title">
        Co mówisz
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{backgroundColor: '#141414' , color: 'white'}}>
      <p>
        {transcript}
      </p>
      <Button onClick={toggleListening} style={{margin: '5px'}}>{isListening ? 'Stop' : 'Start'}</Button>
      <Button onClick={resetTranscript} style={{margin: '5px'}}>Reset</Button>
    </Modal.Body>
  </Modal>
</Navbar>
    );
}   

export default NavbarE
