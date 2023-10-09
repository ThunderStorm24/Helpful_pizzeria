import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect, useRef, useContext } from 'react';
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
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import MySpeechRecognition from './SpeechRecognition';
import { SessionContext } from '../SessionContext/Session.js';

const NavbarE = ({addItemsCart, subtractItemsCart}) => {

  const userSession = useContext(SessionContext).userSession;

  console.log(userSession?.ID_Uzytkownika);
  const navigate = useNavigate();

  const [rola, setRola] = useState ("");
  const [loading, setLoading] = useState(true);
  const [browser, setBrowser] = useState(true);

  const [message, setMessage] = useState('');

  const dictionary = [
    'Menu',
    'Login',
    'Rejestracja',
    'Profil',
    'Opis',
    'Lokalizacja',
    'Kontakt',
    'slowo',
    // Dodaj więcej słów do słownika w razie potrzeby
  ];
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const blurTimeoutRef = useRef(null);

  const [CountItemsCart, setCountItemsCart] = useState(0); //Liczy ile zalogowany użytkownik ma produktów w koszyku

  const [countOrders, setCountOrders] = useState(0); //Liczy ile zalogowany użytkownik ma złożonych zamówień

  const [countAdminOrders, setCountAdminOrders] = useState(0); //Liczy ile admin ma nowych zamówień


  
  //Pobranie informacji odnośnie liczby pizz w koszyku dla zalogowanego użytkownika
  useEffect(() => {
    if(userSession?.ID_Uzytkownika){
    Axios.get(`/Koszyk/${userSession?.ID_Uzytkownika}`)
      .then(response => { 
        const data = response.data;
        setCountItemsCart(data.length);
      })
      .catch(error => {
        console.error('Wystąpił błąd podczas pobierania danych z koszyka:', error);
      });
    }
  }, [userSession?.ID_Uzytkownika]);
    //Pobranie informacji odnośnie liczby zamówień dla zalogowanego użytkownika
    useEffect(() => {
      if (userSession?.ID_Uzytkownika) { // Sprawdź, czy userID nie jest pusty
      Axios.get(`/Zamowienia/${userSession?.ID_Uzytkownika}`)
        .then(response => { 
          const data = response.data;
          setCountOrders(data.length);
        })
        .catch(error => {
          console.error('Wystąpił błąd podczas pobierania danych z koszyka:', error);
        });
      }
    }, [userSession?.ID_Uzytkownika]);
        //Pobranie informacji odnośnie liczby zamówień dla pracowników pizzeri
        useEffect(() => {
          Axios.get(`/ZamowieniaAdmin`)
            .then(response => { 
              const data = response.data;
              const orderedOrders = data.filter(order => order.Status === "Zamówiono");
              setCountAdminOrders(orderedOrders.length);
            })
            .catch(error => {
              console.error('Wystąpił błąd podczas pobierania danych z koszyka:', error);
            });
        }, []);

  //DODAWANIE I ODEJMOWANIE PRODUKTOW Z KOSZYKA (Jesli nic nie robilismy i sa dane undefined to niech je ustawi poprostu na 0)
  if (typeof addItemsCart === 'undefined') {
    addItemsCart=0;
  }
  if (typeof subtractItemsCart === 'undefined') {
    subtractItemsCart=0;
  }

  //Liczba pizz w koszyku dla zalogowanego użytkownika + liczba pizz dodanych w menu + liczba pizz odjętych w koszyku
  const TotalItemsCart = CountItemsCart + addItemsCart + subtractItemsCart;
  //Liczba zamówień dla zalogowanego użytkownika
  const TotalOrders = countOrders;
  //Liczba zamówień dla pracowników pizzerii
  const TotalAdminOrders = countAdminOrders;

  const handleLogout = () => {
    Axios.get('/wyloguj').then((response) => {
      alert('Wylogowano!');
      navigate('/');
      window.location.reload();
    });
  };

  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setMessage(userInput);

    // Wyszukaj pasujące sugestie do wprowadzonego tekstu
    const suggestedWords = dictionary.filter((word) =>
      word.toLowerCase().includes(userInput.toLowerCase())
    );
    setSuggestions(suggestedWords);
    setShowDropdown(true);
  };

  const handleInputClick = (event) => {
    const userInput = event.target.value;
    setMessage(userInput);

    // Wyszukaj pasujące sugestie do wprowadzonego tekstu
    const suggestedWords = dictionary.filter((word) =>
      word.toLowerCase().includes(userInput.toLowerCase())
    );
    setSuggestions(suggestedWords);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion); // Ustaw wybraną sugestię jako wartość w polu wyszukiwania
    setShowDropdown(false);
    console.log('Aktualna wartość message:', message);
  };

  const handleInputBlur = () => {
    // Obsługa zdarzenia onBlur z opóźnieniem (200ms)
    blurTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleInputFocus = () => {
    // Obsługa zdarzenia onFocus
    clearTimeout(blurTimeoutRef.current);
    setShowDropdown(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Sprawdzamy, czy wartość message znajduje się w sugestiach
    const suggestedWords = dictionary.filter((word) =>
      word.toLowerCase().includes(message.toLowerCase())
    );
// Jeśli wartość message jest zawarta w sugestiach, przekieruj na odpowiednią podstronę
    if (suggestedWords.includes(message)) {

      // Jeśli wartość message to Opis
      if (message === "Opis") {
        // Przekieruj użytkownika na daną sekcję z odpowiednim id (np. #about)
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
        // Jeśli wartość message to Lokalizacja
    } 
  } else if (message === "Lokalizacja") {
      // Przekieruj użytkownika na daną sekcję z odpowiednim id (np. #Location)
        const localizationSection = document.getElementById("Location");
        if (localizationSection) {
          localizationSection.scrollIntoView({ behavior: "smooth" });
    } 
  } else if (message === "Kontakt") {
    // Przekieruj użytkownika na daną sekcję z odpowiednim id (np. #Contact)
      const ContactSection = document.getElementById("Contact");
      if (ContactSection) {
        ContactSection.scrollIntoView({ behavior: "smooth" });
    } 
  } else {
      navigate(`/${message}`);
      }
    } else {
      // W przeciwnym razie przekieruj na stronę główną
      alert('Nie ma takiej podstrony')
      navigate('/');
    }
  };

    return (
      
       <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
  <Container fluid>
    <Navbar.Brand  href="#">Pizzeria La Thunderas</Navbar.Brand>
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
      <div className="mx-auto d-flex col-4">
        <Form onSubmit={handleFormSubmit}> 
        <div className="d-flex">
          <Form.Control variant="dark" className="searchBar col-12 col-md-12" type="search" placeholder="Search" value={message} aria-label="Search" 
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus} />
          <Button className="col-6 col-md-3 ms-3 blueButton" type="submit" style={{margin: '5px'}}>Znajdź</Button>
          </div>
        
          <Dropdown show={showDropdown && suggestions.length > 0} align="start" className="mt-1">
        <Dropdown.Menu className="col-12 col-md-12" variant="dark" style={{ maxHeight: '200px', overflowY: 'auto'}}>
          {suggestions.map((suggestion) => (
            <Dropdown.Item
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

        </Form>
      </div>
      <MySpeechRecognition />
      <div className="ms-2 me-2">
      
    </div>
    
      
      
      {userSession?.ID_Uzytkownika ? (
        <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-item-button" className="ms-2 loginButton">
          {userSession?.ID_Uzytkownika}
        </Dropdown.Toggle>
  
        <Dropdown.Menu align="end" variant="dark">
          <Dropdown.Item href="/Profil">Mój profil</Dropdown.Item>
          {rola === 'user' ? (
            <>
              <Dropdown.Item href="/koszyk">Koszyk ({TotalItemsCart})</Dropdown.Item>
              <Dropdown.Item href="/Orders">Moje zamówienia ({TotalOrders})</Dropdown.Item>
            </>
          ) : (
            <>
              <Dropdown.Item href="/Menu">Pizze</Dropdown.Item>
              <Dropdown.Item href="/adminOrders">
                {TotalAdminOrders > 0 ? (
                  <strong>Zamówienia ({TotalAdminOrders})</strong>
                ) : (
                  <span>Zamówienia ({TotalAdminOrders})</span>
                )}
              </Dropdown.Item>
              <Dropdown.Item href="/Users">Użytkownicy</Dropdown.Item>
            </>
          )}
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Wyloguj</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ) : (
    <Button href="/Login" className="btn-secondary ms-3 me-3 loginButton">{loading ? (<div> <Spinner animation="border" variant="primary" size="sm" /></div>) : (<div>Zaloguj</div>)}</Button>
)}
    </Navbar.Collapse>
  </Container>
</Navbar>
    );
}   

export default NavbarE
