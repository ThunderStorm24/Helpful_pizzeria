import React, { useEffect, useState } from "react";
import NavbarE from './../Components/NavBar.js';
import Bookmarks from "./../Components/MenuContent.js";
import PizzaModal from "./../Components/WindowModal/AddModal";
import CustomPizzaModal from "./../Components/WindowModal/AddCustomModal";
import EditPizzaModal from "./../Components/WindowModal/EditModal";
import ConfirmCancelModal from "../Components/WindowModal/ConfirmCancelModal.js"
import ToastOperations from './../Components/smallComponents/ToastOperations'
import Axios from 'axios';

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
            setAdded(true);
            setToastTitle("Pomyślnie Dodano Pizzę!")
            setShowToast(true);
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
            setCustomMessageAdd(data.data.message)
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
            ID: idPizzy,
            name: pizza.name,
            checkedItems: pizza.checkedItemsWithPizza,
            priceSmall: pizza.priceSmall,
            priceMedium: pizza.priceMedium,
            priceLarge: pizza.priceLarge,
            priceGiant: pizza.priceGiant
        }).then((data) => {
            console.log(data)
            setEditMessageAdd(data.data.message)
            setEditMessage([])
            setShowButton(0) 
            setAdded(true);
        }).catch((error) => {
                console.log('error', error);
                setEditMessage(error.response.data.errors);
            })
            console.log(pizza);
            console.log("EDIT Blad:"+editMessage);
            console.log("Edit Sukces:"+editMessageAdd);
    };

    const handleDeletePizza = async () => {
      Axios.post('http://localhost:5000/UsunPizze', {
        ID: pizza.ID_Pizzy,
    }).then((data)=> {
      console.log(data);
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
      console.log(data);
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
      console.log(data);
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
    console.log(data);
    setDeniedModal(false);
    window.location.reload();
  }).catch((error) => {
    console.log('error', error);
  })
};
    

    return <div>
        <NavbarE addItemsCart={addItemsCart} />
    <div className="black text-white d-flex" style={{marginTop: "10px", paddingBottom: "450px"}}>
    <div className="w-100 m-2">
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
        buttonSuccess={"Anuluj"}
        buttonDanger={"Usuń Pizzę"}
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