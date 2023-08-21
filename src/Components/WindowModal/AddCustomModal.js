import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";


const CustomPizzaModal = ({ customShow, customOnHide, customOnSubmit, customMessage, customMessageAdd, customShowButton }) => {

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

  console.log(checkedItems);
  const handleSubmit = (event) => {
    if(pizzaAdded === false){
    event.preventDefault();
    setPizzaAdded(true);
    customOnSubmit({
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
    <Modal show={customShow} onHide={customOnHide}>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj nową pizzę</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 mt-2">Pizza zostanie najpierw sprawdzona przez administrację, obserwuj Moje oczekujące pizze lub Moje pizze czy twoja pizza została dodana i ciesz się dodaną pizzą!</div>
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
            <Form.Label style={{ fontWeight: "bold" }}>Składniki</Form.Label>
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
          {customShowButton ? (
            <Button variant="primary" type="submit" className="mt-2">
              Dodaj
            </Button>
          ) : (
            <button className="mt-2 btn btn-primary" onClick={() => customOnHide(false)}>OK</button>
          )}
          <div className="" style={{ fontWeight: "bold" }}>Status Pizzy:</div>
          {customMessage && customMessage.length > 0 ? (
            customMessage.map((msg, index) => (
              <ul className="text-danger" style={{ margin: "0px" }} key={index}><li>{msg}</li></ul>
            ))
          ) : (
            <p>{customMessageAdd}</p>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomPizzaModal;