import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Axios from 'axios';


const DeleteModal = ({  }) => {



  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Usuwanie pizzy</Modal.Title>
        </Modal.Header>
        <Modal.Body>Czy na pewno chcesz usunąć pizzę o ID: </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Usuń pizzę o ID 
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default DeleteModal;