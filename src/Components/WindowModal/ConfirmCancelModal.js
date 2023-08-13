import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Axios from 'axios';


const ConfirmCancelModal = ({ show, onHide, operation, buttonSuccess, buttonDanger, description, title }) => {



  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton style={{backgroundColor: '#444444' , color: 'white'}}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#141414' , color: 'white'}}>{description}?
        <Button variant="primary" onClick={showComment}>
            {buttonSuccess}
          </Button>
        <Form>
        <Form.Control as="textarea"
        className="col-6"
        placeholder="Tu wpisz komentarz"
        style={{ height: "150px", padding: "5px", marginTop: "15px", background: "white", color: "black" }}
      />
          </Form>
          
          </Modal.Body>
        <Modal.Footer style={{backgroundColor: '#141414' , color: 'white'}}>
          <Button className="greenButton" variant="success" onClick={operation}>
            {buttonSuccess}
          </Button>
          <Button className="redButton" variant="danger" onClick={onHide}>
            {buttonDanger}
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ConfirmCancelModal;