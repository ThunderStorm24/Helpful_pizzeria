import NavbarE from '../Components/NavBar.js';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { Spinner, Button } from 'react-bootstrap';
import Axios from 'axios';
import ConfirmModal from '../Components/WindowModal/ConfirmCancelModal.js'
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import LogOrders from '../Components/orderComponents/LoggedOrders';
import { SessionContext } from '../SessionContext/Session.js';

export default function AdminOrders() {

    const [loading, setLoading] = useState(true);
    const [readyModal, setReadyModal] = useState(false);
    const [finishModal, setFinishModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const handleCloseModal = () => {
      setReadyModal(false);
      setFinishModal(false);
      setDeleteModal(false);
};

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [ordersNotLogged, setOrdersNotLogged] = useState([]);
    const [orderID, setOrderID] = useState('');
    const [orderPizza, setOrderPizza] = useState([])

    const userSession = useContext(SessionContext).userSession;

    console.log(userSession?.ID_Uzytkownika);

    useEffect(() => {
        Axios.get(`/ZamowieniaAdmin`)
            .then(response => {
                setOrders(response.data);
                setLoading(false); // zmiana stanu loading na false
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
      Axios.get(`/ZamowieniaAdminNiezalogowani`)
          .then(response => {
              setOrdersNotLogged(response.data);
              setLoading(false); // zmiana stanu loading na false
          })
          .catch(error => console.error(error));
  }, []);

    //Zmiana na gotowe zamowienie
    const handleReady = (order) => {
      setReadyModal(true);
      setOrderID(order.ID_Zamowienia)
      setOrderPizza(order.Pizze_z_cenami.split(","))
    };

    const handleReadyOrder = () => {
      Axios.post('/GotoweZamowienie', {
      orderID: orderID,
    }).then((response) => {
      window.location.reload();
    })
  };

    //Zmiana na zakończone zamówienie
    const handleFinish = (order) => {
      setFinishModal(true);
      setOrderID(order.ID_Zamowienia)
      setOrderPizza(order.Pizze_z_cenami.split(","))
    };

    const handleFinishOrder = () => {
      Axios.post('/ZakonczoneZamowienie', {
        orderID: orderID,
      }).then((response) => {
        window.location.reload();
      })
    };

    //Usunięcie zamówienia
    const handleDelete = (order) => {
      setDeleteModal(true);
      setOrderID(order.ID_Zamowienia)
      setOrderPizza(order.Pizze_z_cenami.split(","))
    };

    const handleDeleteOrder = () => {
      Axios.post('/UsuwaneZamowienie', {
        orderID: orderID,
      }).then((response) => {
        window.location.reload();
      })
    };

    const [viewType, setViewType] = useState("normal"); // Użyj useState do śledzenia wybranej opcji

  // Funkcje obsługujące zmianę wybranej opcji
  const handleViewChange = (value) => {
    setViewType(value);
  };

  return (<div style={{ minHeight: "140vh"}}>
    <NavbarE />
    {loading ? (
      <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
    ) : (userSession?.Rola === "admin" ? ( 
      <div style={{ marginTop: "10px"}}>

        <Button className="me-3 mt-3" href="/AdminOrder" disabled>Zamówienia</Button>
        <Button className="ms-3 mt-3" href="/AdminOrdersNotLogged">Zamówienia niezalogowanych użytkowników</Button>

      <LogOrders
        orders={orders}
        handleReady={handleReady}
        handleFinish={handleFinish}
        handleDelete={handleDelete}
      />

    </div>
    ):(<div>nieuprawniony dostęp</div>))}
    <ConfirmModal
      show={readyModal}
      onHide={handleCloseModal}
      operation={handleReadyOrder}
      buttonDanger={"Nie"}
      buttonSuccess={"Tak"}
      description={(
        <div>
          <p>{`Czy na pewno zamówienie o ID ${orderID} jest gotowe?`}</p>
          <ul>
            {orderPizza.map((pizza, index) => (
              <li key={index}>{pizza}</li>
            ))}
          </ul>
        </div>
      )}
      title={`Przygotowanie zamówienia [${orderID}]`}
      disable={true}
    />

    <ConfirmModal
      show={finishModal}
      onHide={handleCloseModal}
      operation={handleFinishOrder}
      buttonDanger={"Nie"}
      buttonSuccess={"Tak"}
      description={(
        <div>
          <p>{`Czy na pewno klient odebrał zamówienie?`}</p>
          <ul>
            {orderPizza.map((pizza, index) => (
              <li key={index}>{pizza}</li>
            ))}
          </ul>
        </div>
      )}
      title={`Odbieranie zamówienia [${orderID}]`}
      disable={true}
    />

<ConfirmModal
      show={deleteModal}
      onHide={handleCloseModal}
      operation={handleDeleteOrder}
      buttonDanger={"Nie"}
      buttonSuccess={"Tak"}
      description={(
        <div>
          <p>{`Czy na pewno chcesz usunąć zamówienie?`}</p>
          <ul>
            {orderPizza.map((pizza, index) => (
              <li key={index}>{pizza}</li>
            ))}
          </ul>
        </div>
      )}
      title={`Usuwanie zamówienia [${orderID}]`}
      disable={true}
    />
  </div>
  );
}