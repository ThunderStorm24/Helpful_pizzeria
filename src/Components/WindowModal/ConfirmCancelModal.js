import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Axios from 'axios';


const ConfirmCancelModal = ({ show, onHide, operation, buttonSuccess, buttonDanger, description, title }) => {

  const [showComment, setShowComment] = useState(false)
  const [buttonText, setButtonText] = useState("Dodaj Komentarz");
  const [buttonVariant, setButtonVariant] = useState("primary");
  const [comment, setComment] = useState("");

  const handleButtonClick = () => {
    if (showComment) {
      setShowComment(false);
      setButtonText("Dodaj Komentarz");
      setButtonVariant("primary")
      setComment("")
    } else {
      setShowComment(true);
      setButtonText("Anuluj dodanie komentarza");
      setButtonVariant("danger")
    }
  };



  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton style={{ backgroundColor: '#444444', color: 'white' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#141414', color: 'white' }}>{description}?
        <Button className="mt-2" variant={buttonVariant} onClick={handleButtonClick}>
          {buttonText}
        </Button>
        {showComment && (
          <Form>
            <Form.Control
              as="textarea"
              className="col-6"
              placeholder="Tu wpisz komentarz"
              style={{
                height: "150px",
                padding: "5px",
                marginTop: "15px",
                background: "white",
                color: "black"
              }}
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
            />
          </Form>
        )}

      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#141414', color: 'white' }}>
        <Button className="greenButton" variant="success" onClick={() => operation(comment)}>
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