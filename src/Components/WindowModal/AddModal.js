import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form } from 'react-bootstrap';
import Button from "react-bootstrap/Button";


const PizzaModal = ({ show, onHide, onSubmit, message, messageAdd, showButton, Added }) => {

  const [pizzaAdded, setPizzaAdded] = useState(false);

  const [name, setName] = useState("");
  const [priceSmall, setPriceSmall] = useState();
  const [priceMedium, setPriceMedium] = useState();
  const [priceLarge, setPriceLarge] = useState();
  const [priceGiant, setPriceGiant] = useState();
  const [checkedItems, setCheckedItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [skladniki, setSkladniki] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSkladniki = skladniki.filter((skladnik) =>
    skladnik.Nazwa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (event) => {
    if(pizzaAdded === false){
      setPizzaAdded(Added);
    event.preventDefault();
    onSubmit({
      name,
      checkedItems,
      priceSmall,
      priceMedium,
      priceLarge,
      priceGiant,
    });
  } else {

  }
  };

  useEffect(() => {
    fetch('/skladniki')
      .then(response => response.json())
      .then(data => setSkladniki(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="border" closeButton style={{ backgroundColor: '#444444', color: 'white' }}>
        <Modal.Title>Dodaj nową pizzę</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border" style={{ backgroundColor: '#141414', color: 'white' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Nazwa pizzy</Form.Label>
            <Form.Control
              type="text"
              placeholder="Wprowadź nazwę pizzy"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-2" style={{ fontWeight: "bold" }}>Składniki</Form.Label>
            <Form.Control
              type="text"
              placeholder="Szukaj składnika"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div
              className="mt-2 mb-2"
              style={{ height: "150px", overflowY: "scroll" }}
            >
              {filteredSkladniki.map((skladnik) => (
                <Form.Check
                  key={skladnik.ID_Skladnika}
                  type="checkbox"
                  label={skladnik.Nazwa}
                  value={skladnik.Nazwa}
                  onChange={handleCheckboxChange}
                  checked={checkedItems.includes(skladnik.Nazwa)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontWeight: "bold" }}>Cena</Form.Label>
            <Form.Control
              type="number"
              placeholder="Cena małej pizzy"
              value={priceSmall}
              onChange={(event) => setPriceSmall(event.target.value)}
            />
            <Form.Control
              className="mt-2"
              type="number"
              placeholder="Cena średniej pizzy"
              value={priceMedium}
              onChange={(event) => setPriceMedium(event.target.value)}
            />
            <Form.Control
              className="mt-2"
              type="number"
              placeholder="Cena dużej pizzy"
              value={priceLarge}
              onChange={(event) => setPriceLarge(event.target.value)}
            />
            <Form.Control
              className="mt-2"
              type="number"
              placeholder="Cena gigantycznej pizzy"
              value={priceGiant}
              onChange={(event) => setPriceGiant(event.target.value)}
            />
          </Form.Group>
          {showButton ? (
            <Button variant="primary" type="submit" className="mt-2 blueButton">
              Dodaj
            </Button>
          ) : (
            <Button type="button" className="mt-2 btn btn-primary blueButton" onClick={() => onHide(false)}>
              OK
            </Button>
          )}
          <div className="" style={{ fontWeight: "bold" }}>Status Pizzy:</div>
          {message && message.length > 0 ? (
            message.map((msg, index) => (
              <ul className="text-danger" style={{ margin: "0px" }} key={index}><li>{msg}</li></ul>
            ))
          ) : (
            <p>{messageAdd}</p>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PizzaModal;