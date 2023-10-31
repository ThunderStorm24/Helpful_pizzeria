import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl, Alert, Button, InputGroup } from 'react-bootstrap';

const AddUserModal = ({ show, onHide, onSubmit, title, userID, button, Added, Role, message, errors }) => {

    const [userAdded, setUserAdded] = useState(false);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [adress, setAdress] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [phone, setPhone] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

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
              password,
              role,
            });
    };
}

    useEffect(() => {
          setRole(Role)
    },[Role]);


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="border" closeButton style={{ backgroundColor: '#444444', color: 'white' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border" style={{ backgroundColor: '#141414', color: 'white' }}>
        <Form onSubmit={handleSubmit}>

           <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Rola:</Form.Label>
            <InputGroup>
            <InputGroup.Text id="basic-addon1"><i class="fa fa-users me-2" aria-hidden="true"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź Rolę"
              value={Role}
              onChange={(event) => setRole(event.target.value)}
              disabled
            />
            </InputGroup>
          </Form.Group>
          
          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Imię:</Form.Label>
            <InputGroup>
            <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź imię"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Nazwisko:</Form.Label>
            <InputGroup>
            <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź nazwisko"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Adres:</Form.Label>
            <InputGroup>
        <InputGroup.Text id="basic-addon1"><i class="fa fa-address-card" aria-hidden="true"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź adres"
              value={adress}
              onChange={(event) => setAdress(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Kod_Pocztowy:</Form.Label>
            <InputGroup>
        <InputGroup.Text id="basic-addon1"><i class="fa fa-map-pin" aria-hidden="true"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź kod pocztowy"
              value={zipcode}
              onChange={(event) => setZipcode(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Telefon:</Form.Label>
            <InputGroup>
        <InputGroup.Text id="basic-addon1"><i class="fa fa-phone"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź telefon"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Login:</Form.Label>
            <InputGroup>
            <InputGroup.Text id="basic-addon1"><i className="fa fa-user ml-2"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Hasło:</Form.Label>
            <InputGroup>
        <InputGroup.Text id="basic-addon1"><i className="fa fa-lock"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Wprowadź hasło"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
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

            <Button variant="primary" type="submit" className="mt-2 blueButton">
              {button}
            </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;