import React, { useEffect, useState } from "react";
import NavbarE from './../Components/NavBar.js';
import Bookmarks from "./../Components/MenuContent.js";
import PizzaModal from "./../Components/WindowModal/AddModal";
import CustomPizzaModal from "./../Components/WindowModal/AddCustomModal";
import EditPizzaModal from "./../Components/WindowModal/EditModal";
import Axios from 'axios';

export default function Menu() {
    const [showModal, setShowModal] = useState(false);
    const [customShowModal, setCustomShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [idPizzy, setIdPizzy] = useState(0);
    const [custom, setCustom] = useState('');

    const [addItemsCart, setAddItemsCart] = useState(0);

  const increaseItemsCount = () => {
    setAddItemsCart(prevCount => prevCount + 1); // Zwiększenie licznika o 1
  };

    const handleCloseModal = () => {
        if (showButton) {
            setShowModal(false);
            setEditModal(false);
          } else {
            setShowModal(false);
            setEditModal(false);
            window.location.reload();
          }
    };
    const handleCloseCustomModal = () => {
        if (customShowButton) {
            setCustomShowModal(false);
          } else {
            setCustomShowModal(false);
            window.location.reload();
          }
    };

    const [message, setMessage] = useState([]);
    const [messageAdd, setMessageAdd] = useState("Oczekuję na dodanie...");
    const [showButton, setShowButton] = useState(1);
    const [customMessage, setCustomMessage] = useState([]);
    const [customMessageAdd, setCustomMessageAdd] = useState('Oczekuję na dodanie...');
    const [customShowButton, setCustomShowButton] = useState(1);
    const [editMessage, setEditMessage] = useState([]);
    const [editMessageAdd, setEditMessageAdd] = useState('Oczekuję na dodanie...');

    //Sesja
    const [ID, setID] = useState("");

    //SESJA
    useEffect(() => {
        Axios.get("/login").then((response) => {
            if (response.data.loggedIn == true) {
                setID(response.data.user[0].ID_Uzytkownika)
            }
        })
    }, [])
    console.log(ID);

    const handleAddPizza = async (pizza) => {
        Axios.post('http://localhost:5000/DodajPizzeOryginalna', {
            ID: ID,
            name: pizza.name,
            checkedItems: pizza.checkedItems,
            priceSmall: pizza.priceSmall,
            priceMedium: pizza.priceMedium,
            priceLarge: pizza.priceLarge,
            priceGiant: pizza.priceGiant
        }).then((data) => {
            console.log(data)
            setMessageAdd(data.data)
            setMessage([])
            setShowButton(0)
        }).catch((error) => {
                console.log('error', error);
                setMessage(error.response.data.errors);
        })
        console.log(pizza);
        console.log("TRESC:"+message);
        console.log("TRESCDODANIA:"+messageAdd);
    };


    const handleAddCustomPizza = async (pizza) => {
        Axios.post('http://localhost:5000/DodajPizzeCustomowa', {
            ID: ID,
            name: pizza.name,
            checkedItems: pizza.checkedItems,
            priceSmall: pizza.priceSmall,
            priceMedium: pizza.priceMedium,
            priceLarge: pizza.priceLarge,
            priceGiant: pizza.priceGiant
        }).then((data) => {
            console.log(data)
            setCustomMessageAdd(data.data)
            setCustomMessage([])
            setCustomShowButton(0)
        }).catch((error) => {
                console.log('error', error);
                setCustomMessage(error.response.data.errors);
            })
            console.log(pizza);
            console.log("TRESC:"+customMessage);
            console.log("TRESCDODANIA:"+customMessageAdd);
    };

    const handleEditPizza = async (pizza) => {
        Axios.post('http://localhost:5000/EdytujPizze', {
            ID: ID,
            name: pizza.name,
            checkedItems: pizza.checkedItems,
            priceSmall: pizza.priceSmall,
            priceMedium: pizza.priceMedium,
            priceLarge: pizza.priceLarge,
            priceGiant: pizza.priceGiant
        }).then((data) => {
            console.log(data)
            setCustomMessageAdd(data.data)
            setCustomMessage([])
            setCustomShowButton(0) 
        }).catch((error) => {
                console.log('error', error);
                setCustomMessage(error.response.data.errors);
            })
            console.log(pizza);
            console.log("TRESC:"+customMessage);
            console.log("TRESCDODANIA:"+customMessageAdd);
    };

    return <div>
        <NavbarE addItemsCart={addItemsCart} />
    <div className="black text-white d-flex" style={{marginTop: "10px", paddingBottom: "1000px"}}>
    <div className="w-100 m-2">
    <Bookmarks updateItemsCount={increaseItemsCount} showModal={() => setShowModal(true)} customShowModal={() => setCustomShowModal(true)} editModal={() => setEditModal(true)} idPizzy={setIdPizzy} custom={setCustom}/>
      <PizzaModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleAddPizza}
        message={message} // Przekazanie wartości "message" jako props
        messageAdd={messageAdd}
        showButton={showButton}
      />
      <CustomPizzaModal
        customShow={customShowModal}
        customOnHide={handleCloseCustomModal}
        customOnSubmit={handleAddCustomPizza}
        customMessage={customMessage} // Przekazanie wartości "message" jako props
        customMessageAdd={customMessageAdd}
        customShowButton={customShowButton}
      />
      <EditPizzaModal
        show={editModal}
        onHide={handleCloseModal}
        onSubmit={handleEditPizza}
        message={editMessage} // Przekazanie wartości "message" jako props
        messageAdd={editMessageAdd}
        showButton={showButton}
        idPizzy={idPizzy}
        custom={custom}
      />
    </div>
    </div>
    </div>
}