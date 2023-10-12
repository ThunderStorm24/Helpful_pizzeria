import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Axios from 'axios';


const EditPizzaModal = ({ show, onHide, onSubmit, message, messageAdd, showButton, idPizzy, custom, Added }) => {

  const [pizzaAdded, setPizzaAdded] = useState(false);
  const [pizze, setPizze] = useState([]);
  const [index, setIndex] = useState(null);

  const [name, setName] = useState("");
  const [priceSmall, setPriceSmall] = useState('');
  const [priceMedium, setPriceMedium] = useState('');
  const [priceLarge, setPriceLarge] = useState('');
  const [priceGiant, setPriceGiant] = useState('');
  const [pizzaStatus, setPizzaStatus] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedItemsWithPizza, setCheckedItemsWithPizza] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [skladniki, setSkladniki] = useState([]);

  const handleCheckboxChange = (event) => {
    const skladnikName = event.target.value;
  
    // Jeśli składnik jest zaznaczony, dodaj go do tablicy
    // checkedItemsWithPizza. W przeciwnym razie usuń go z tablicy.
    if (event.target.checked) {
      setCheckedItemsWithPizza((prevCheckedItems) => [...prevCheckedItems, skladnikName]);
    } else {
      setCheckedItemsWithPizza((prevCheckedItems) => prevCheckedItems.filter((skladnik) => skladnik !== skladnikName));
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
    event.preventDefault();
    setPizzaAdded(Added);
    onSubmit({
      name,
      checkedItemsWithPizza,
      priceSmall,
      priceMedium,
      priceLarge,
      priceGiant,
      pizzaStatus,
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

    //WYŚWIETLANIE pizzy do zedytowania
    useEffect(() => {
        Axios.get(`/pizzeEdit/${idPizzy}`)
        .then(response => {
          setPizze(response.data);
        })
          .catch(error => console.error(error));
          
          setIndex(0);
      },[idPizzy]);

      useEffect(() => {
        if (pizze.length > 0 && index !== null) {
          const pizza = pizze[index];
          setPizzaStatus(pizza.Status);
          setName(pizza.Nazwa);
          const pizzaSkladniki = pizza.Skladniki.split(", ");
          
          // Tworzymy nową tablicę z aktualnymi składnikami i składnikami z wybranej pizzy
          const updatedCheckedItemsWithPizza = [...checkedItems, ...pizzaSkladniki];
        
          // Podziel łańcuch cen na odpowiednie wartości
          const [smallPrice, mediumPrice, largePrice, giantPrice] = pizza.Cena.split(' / ').map(price => parseInt(price.trim(), 10));
        
          // Zaktualizuj ceny składników na podstawie wybranej pizzy
          setPriceSmall(smallPrice);
          setPriceMedium(mediumPrice);
          setPriceLarge(largePrice);
          setPriceGiant(giantPrice);
      
          // Zaktualizuj checkedItemsWithPizza za pomocą nowej tablicy
          setCheckedItemsWithPizza(updatedCheckedItemsWithPizza);
        }
      }, [index, pizze, checkedItems]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="border" closeButton>
        <Modal.Title>Edytuj pizzę</Modal.Title>
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
                  checked={checkedItemsWithPizza.includes(skladnik.Nazwa)}
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
            <Button variant="primary" type="submit" className="mt-2">
              Edytuj
            </Button>
          ) : (
            <button type="button" className="mt-2 btn btn-primary" onClick={() => onHide(false)}>OK</button>
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

export default EditPizzaModal;