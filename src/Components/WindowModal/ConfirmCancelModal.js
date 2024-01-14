import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Alert } from 'react-bootstrap';
import Button from "react-bootstrap/Button";

const ConfirmCancelModal = ({ show, onHide, operation, buttonSuccess, buttonDanger, description, title, disable, message, errors }) => {

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
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}
        {disable ? null : (
          <Button className="mt-2 ms-2" variant={buttonVariant} onClick={handleButtonClick}>
            {buttonText}
          </Button>
        )}

        {showComment && (
          <Form>
            <Form.Control
              as="textarea"
              className="col-6 ms"
              placeholder="Tu wpisz komentarz"
              style={{
                height: "150px",
                padding: "5px",
                marginTop: "15px",
              }}
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
            />
          </Form>
        )}
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

      </Modal.Body>
      <Modal.Footer>
        <Button className="redButton" variant="danger" onClick={onHide}>
          {buttonDanger}
        </Button>
        <Button className="greenButton" variant="success" onClick={() => operation(comment)}>
          {buttonSuccess}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmCancelModal;
