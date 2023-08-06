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
        <Modal.Body style={{backgroundColor: '#141414' , color: 'white'}}>{description}</Modal.Body>
        <Modal.Footer style={{backgroundColor: '#141414' , color: 'white'}}>
          <Button className="greenButton" variant="success" onClick={onHide}>
            {buttonSuccess}
          </Button>
          <Button className="redButton" variant="danger" onClick={operation}>
            {buttonDanger}
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ConfirmCancelModal;