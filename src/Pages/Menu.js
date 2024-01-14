import React, { useState, useContext } from "react";
import NavbarE from './../Components/NavBar.js';
import Bookmarks from "./../Components/MenuContent.js";
import PizzaModal from "./../Components/WindowModal/AddModal";
import CustomPizzaModal from "./../Components/WindowModal/AddCustomModal";
import EditPizzaModal from "./../Components/WindowModal/EditModal";
import ConfirmCancelModal from "../Components/WindowModal/ConfirmCancelModal.js"
import ToastOperations from './../Components/smallComponents/ToastOperations'
import Axios from 'axios';
import { SessionContext } from '../SessionContext/Session.js';

export default function Menu() {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [customShowModal, setCustomShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [acceptModal, setAcceptModal] = useState(false);
    const [deniedModal, setDeniedModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);

    const [idPizzy, setIdPizzy] = useState(0);
    const [pizza, setPizza] = useState([]);
    const [custom, setCustom] = useState('');

    const [addItemsCart, setAddItemsCart] = useState(0);

    const userSession = useContext(SessionContext).userSession;

    console.log(userSession?.ID_Uzytkownika);

  const increaseItemsCount = () => {
    setAddItemsCart(prevCount => prevCount + 1); // Zwiększenie licznika o 1
  };

    const handleCloseModal = () => {
        if (showButton) {
            setShowModal(false);
            setEditModal(false);
            setDeleteModal(false);
            setAcceptModal(false);
            setDeniedModal(false);
            setCancelModal(false);
          } else {
            setShowModal(false);
            setEditModal(false);
            setDeleteModal(false);
            setAcceptModal(false);
            setDeniedModal(false);
            setCancelModal(false);
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

    const [toastTitle, setToastTitle] = useState('');

    const handleToastClose = () => setShowToast(false);

    const [message, setMessage] = useState([]);
    const [messageAdd, setMessageAdd] = useState("Oczekuję na dodanie...");
    const [showButton, setShowButton] = useState(1);
    const [customMessage, setCustomMessage] = useState([]);
    const [customMessageAdd, setCustomMessageAdd] = useState('Oczekuję na dodanie...');
    const [customShowButton, setCustomShowButton] = useState(1);
    const [editMessage, setEditMessage] = useState([]);
    const [editMessageAdd, setEditMessageAdd] = useState('Oczekuję na dodanie...');
    const [editShowButton, setEditShowButton] = useState(1);

    const [added,setAdded] = useState(false);

    //Sesja
      const ID = userSession?.ID_Uzytkownika;

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
            setMessageAdd(data.data)
            setMessage([])
            setShowButton(0)
            setAdded(true);
            setToastTitle("Pomyślnie Dodano Pizzę!")
            setShowToast(true);
        }).catch((error) => {
                console.log('error', error);
                setMessage(error.response.data.errors);
        })
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
            setCustomMessageAdd(data.data.message)
            setCustomMessage([])
            setCustomShowButton(0)
            setAdded(true);
        }).catch((error) => {
                console.log('error', error);
                setCustomMessage(error.response.data.errors);
            })
    };

    const handleEditPizza = async (pizza) => {
        Axios.post('http://localhost:5000/EdytujPizze', {
            ID: idPizzy,
            name: pizza.name,
            checkedItems: pizza.checkedItemsWithPizza,
            priceSmall: pizza.priceSmall,
            priceMedium: pizza.priceMedium,
            priceLarge: pizza.priceLarge,
            priceGiant: pizza.priceGiant,
            pizzaStatus: pizza.pizzaStatus
        }).then((data) => {
            setEditMessageAdd(data.data.message)
            setEditMessage([])
            setShowButton(0) 
            setAdded(true);
        }).catch((error) => {
                console.log('error', error);
                setEditMessage(error.response.data.errors);
            })
    };

    const handleDeletePizza = async () => {
      Axios.post('http://localhost:5000/UsunPizze', {
        ID: pizza.ID_Pizzy,
    }).then((data)=> {
      setDeleteModal(false);
      window.location.reload();
    }).catch((error) => {
      console.log('error', error);
    })
  };

    const handleAcceptPizza = async (comment) => {
      Axios.post('http://localhost:5000/AkceptujPizze', {
        ID: pizza.ID_Pizzy,
        Comment: comment,
    }).then((data)=> {
      setAcceptModal(false);
      window.location.reload();
    }).catch((error) => {
      console.log('error', error);
    })
  };

    const handleDeniedPizza = async (comment) => {
      Axios.post('http://localhost:5000/OdrzucPizze', {
        ID: pizza.ID_Pizzy,
        Comment: comment,
    }).then((data)=> {
      setDeniedModal(false);
      window.location.reload();
    }).catch((error) => {
      console.log('error', error);
    })
  };

  const handleCancelModal = async () => {
    Axios.post('http://localhost:5000/AnulujPizze', {
      ID: pizza.ID_Pizzy,
  }).then((data)=> {
    setDeniedModal(false);
    window.location.reload();
  }).catch((error) => {
    console.log('error', error);
  })
};
    

    return <div>
        <NavbarE addItemsCart={addItemsCart} />
    <div className="text-white d-flex" style={{ paddingBottom: "50px", background: '#222'}}>
    <div className="col-12 col-md-12">
    <Bookmarks 
    updateItemsCount={increaseItemsCount} 
    actions={{
      showModal: () => setShowModal(true),
      customShowModal: () => setCustomShowModal(true),
      editModal: () => setEditModal(true),
      deleteModal: () => setDeleteModal(true),
      acceptModal: () => setAcceptModal(true),
      deniedModal: () => setDeniedModal(true),
      cancelModal: () => setCancelModal(true),
      pizza: setPizza,
      idPizzy: setIdPizzy,
      custom: setCustom
    }}
    />
      <PizzaModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleAddPizza}
        message={message} // Przekazanie wartości "message" jako props
        messageAdd={messageAdd}
        showButton={showButton}
        Added={added}
      />
      <CustomPizzaModal
        customShow={customShowModal}
        customOnHide={handleCloseCustomModal}
        customOnSubmit={handleAddCustomPizza}
        customMessage={customMessage} // Przekazanie wartości "message" jako props
        customMessageAdd={customMessageAdd}
        customShowButton={customShowButton}
        Added={added}
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
        Added={added}
      />
      <ConfirmCancelModal
        show={deleteModal}
        onHide={handleCloseModal}
        operation={handleDeletePizza}
        buttonSuccess={"Usuń Pizzę"}
        buttonDanger={"Anuluj"}
        description = {`Pizza "${pizza.Nazwa}" o ID: ${pizza.ID_Pizzy} ze składnikami: (${pizza.Skladniki}) zostanie usunięta na stałe. Czy na pewno chcesz to zrobić?`}
        title={`Czy chcesz usunąć pizzę [${pizza.ID_Pizzy}]`}
        disable={false}
      />
      <ConfirmCancelModal
        show={acceptModal}
        onHide={handleCloseModal}
        operation={handleAcceptPizza}
        buttonDanger={"Anuluj"}
        buttonSuccess={"Zaakceptuj"}
        description = {`Czy na pewno chcesz zaakceptować pizzę ${pizza.Nazwa} [${pizza.ID_Pizzy}]`}
        title={`Akceptacja pizzy [${pizza.ID_Pizzy}]`}
        disable={false}
      />
      <ConfirmCancelModal
        show={deniedModal}
        onHide={handleCloseModal}
        operation={handleDeniedPizza}
        buttonDanger={"Anuluj"}
        buttonSuccess={"Odrzuć"}
        description = {`Czy na pewno chcesz odrzucić pizzę ${pizza.Nazwa} [${pizza.ID_Pizzy}]`}
        title={`Odrzucenie pizzy [${pizza.ID_Pizzy}]`}
        disable={false}
      />
      <ConfirmCancelModal
        show={cancelModal}
        onHide={handleCloseModal}
        operation={handleCancelModal}
        buttonDanger={"Nie"}
        buttonSuccess={"Tak"}
        description = {`Czy na pewno chcesz anulować pizzę ${pizza.Nazwa} [${pizza.ID_Pizzy}]`}
        title={`Anulowanie pizzy [${pizza.ID_Pizzy}]`}
        disable={true}
      />

      <ToastOperations title={toastTitle} describe={messageAdd} background="success" time="5000" show={showToast} hide={handleToastClose} />
    </div>
    </div>
    </div>
}