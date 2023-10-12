import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl, Alert } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Axios from 'axios';


const EditModal = ({ show, onHide, onSubmit, title, userID, button, Added, message, errors }) => {

    const [userAdded, setUserAdded] = useState(false);
    const [user, setUser] = useState([]);
    const [index, setIndex] = useState(null);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [adress, setAdress] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [phone, setPhone] = useState("");
    const [login, setLogin] = useState("");

    const handleSubmit = (event) => {
        if(userAdded === false){
            event.preventDefault();
            setUserAdded(Added);
            onSubmit({
              userID,
              name,
              surname,
              adress,
              zipcode,
              phone,
              login,
            });
    };
}

//WYŚWIETLANIE użytkownika do zedytowania
useEffect(() => {
  if (userID) { // Sprawdź, czy userID nie jest pusty
    Axios.get(`/userEdit/${userID}`)
    .then(response => {
      setUser(response.data);
    })
      .catch(error => console.error(error));
      
      setIndex(0);
    }
  },[show]);

  useEffect(() => {
    if (user.length > 0 && index !== null) {
      const users = user[index];
      setName(users.Imie)
      setSurname(users.Nazwisko)
      setAdress(users.Adres)
      setZipcode(users.Kod_Pocztowy)
      setPhone(users.Telefon)
      setLogin(users.Login)
    }
  }, [index, user]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="border" closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border" style={{ backgroundColor: '#141414', color: 'white' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Imię:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź imię"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Nazwisko:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź nazwisko"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Adres:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź adres"
              value={adress}
              onChange={(event) => setAdress(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Kod_Pocztowy:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź kod pocztowy"
              value={zipcode}
              onChange={(event) => setZipcode(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Telefon:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź telefon"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Login:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
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

            <Button variant="primary" type="submit" className="mt-2 blueButton">
              {button}
            </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;