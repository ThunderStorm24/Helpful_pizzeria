import NavbarE from '../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { Spinner, Button } from 'react-bootstrap';
import Axios from 'axios';
import ConfirmModal from '../Components/WindowModal/ConfirmCancelModal.js'

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
    const [orderID, setOrderID] = useState('');
    const [orderPizza, setOrderPizza] = useState([])

    const [loginID, setLoginID] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [rola,setRola] = useState("");

    useEffect(() => {
      Axios.get("/login").then((response) => {
          if (response.data.user[0].Rola == "admin" && response.data.loggedIn == true) {
              setRola(response.data.user[0].Rola)
              setLoginStatus(response.data.user[0].Login)
              setLoginID(response.data.user[0].ID_Uzytkownika)
              setLoading(false); // zmiana stanu loading na falsee
          } else {
              navigate("/");
          }
      })
  }, [])
    

    useEffect(() => {
        Axios.get(`/ZamowieniaAdmin`)
            .then(response => {
                setOrders(response.data);
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

  return (<div style={{ minHeight: "140vh"}}>
    <NavbarE />
    {loading ? (
      <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
    ) : (rola === "admin" ? ( 
      <div style={{ marginTop: "10px"}}>
        {/* Zamówione*/}
        <div className="m-5 rounded-5" style={{background: "#301818"}}>
          <div className="d-flex justify-content-center">
            <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{background: "#df3400"}}>Zamówione</h1>
          </div>
          <div className="d-flex flex-wrap justify-content-left">
            {orders.map((order) => {
              if (order.Status === "Zamówiono") {
                return (
                  <div
                    key={order.ID_Zamowienia}
                    className="col-11 col-md-4 col-xl-2 border border-5  rounded p-3 ms-3 mt-3 mb-3"
                    style={{
                      background: "#303030",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "500px",
                    }}
                  >
                    <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                    <div className="d-flex flex-column flex-wrap">
                      <div>Dostawa: {order.Dostawa}</div>
                      <div>Data złożenia: {order.Data_Zlozenia}</div>
                      <p>Cena całego zamówienia: {order.Cena} PLN</p>
                    </div>
                    <h3>Opis zamówienia:</h3>
                    <ul className="d-flex flex-wrap" style={{ overflowY: 'scroll', maxHeight: '100px' }}>
                      {order.Pizze_z_cenami.split(",").map((pizza) => (
                        <li className="me-2" key={pizza}>{pizza}</li>
                      ))}
                    </ul>
                    <p>Status: <span
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        backgroundColor: order.Status === 'Gotowe' ? '#28a745' : '#ff4400',
                        color: '#fff',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    >{order.Status}</span></p>
                    <div className="mt-auto">
                      <Button
                        onClick={() => handleReady(order)}
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                      >Gotowe</Button>
                    </div>
                  </div>
                );
              } else {
                return null; // Skip this order for "Historia zamówień" section
              }
            })}
          </div>
        </div>

        {/* Gotowe */}
        <div className="m-5 rounded-5" style={{marginTop: "10px",background: "#183218"}}>
          <div className="d-flex justify-content-center">
            <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{background: "#287745"}}>Gotowe</h1>
          </div>
          <div className="d-flex flex-wrap">
            {orders.map((order) => {
              if (order.Status === "Gotowe") {
                return (
                  <div
                    key={order.ID_Zamowienia}
                    className="col-11 col-md-4 col-xl-2 border border-5 rounded p-3 ms-3 mt-3 mb-3"
                    style={{
                      background: "#303030",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "500px",
                    }}>
                    <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                    <div className="d-flex flex-column flex-wrap">
                      <div>Dostawa: {order.Dostawa}</div>
                      <div>Data złożenia: {order.Data_Zlozenia}</div>
                      <p>Cena całego zamówienia: {order.Cena} PLN</p>
                    </div>
                    <h3>Opis zamówienia:</h3>
                    <ul className="d-flex flex-wrap" style={{ overflowY: 'scroll', maxHeight: '100px' }}>
                      {order.Pizze_z_cenami.split(",").map((pizza) => (
                        <li key={pizza}>{pizza}</li>
                      ))}
                    </ul>
                    <p>Status: <span
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        backgroundColor: order.Status === 'Gotowe' ? '#28a745' : '#ffc107',
                        color: '#fff',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    >{order.Status}</span></p>
                    <div className="mt-auto">
                      <Button
                        onClick={() => handleFinish(order)}
                        className="btn btn-success"
                        style={{ width: "100%" }}
                      >Zakończ</Button>
                    </div>
                  </div>
                );
              } else {
                return null; // Skip this order for "Historia zamówień" section
              }
            })}
          </div>
        </div>

        {/* Historia zamówień */}
        <div className="rounded-5" style={{marginLeft: "48px", marginRight: "48px",marginTop: "10px",background: "#541818"}}>
          <div className="d-flex justify-content-center">
            <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{background: "#dc3545"}}>Historia zamówień</h1>
          </div>
          <div className="d-flex flex-wrap">
            {orders.map((order) => {
              if (order.Status === "Zakończone") {
                return (
                  <div
                    key={order.ID_Zamowienia}
                    className="col-11 col-md-4 col-xl-2 border border-5 rounded p-3 ms-3 mt-3 mb-3"
                    style={{
                      background: "#303030",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "500px",
                    }}>
                    <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                    <div className="d-flex flex-column flex-wrap">
                      <div>Dostawa: {order.Dostawa}</div>
                      <div>Data złożenia: {order.Data_Zlozenia}</div>
                      <p>Cena całego zamówienia: {order.Cena} PLN</p>
                    </div>
                    <h3>Opis zamówienia:</h3>
                    <ul className="d-flex flex-wrap" style={{ overflowY: 'scroll', maxHeight: '100px' }}>
                      {order.Pizze_z_cenami.split(",").map((pizza) => (
                        <li key={pizza}>{pizza}</li>
                      ))}
                    </ul>
                    <p>Status: <span style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}>{order.Status}</span></p>

                    <div className="mt-auto">
                      <Button
                        onClick={() => handleDelete(order)}
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                      >Usuń</Button>
                    </div>
                  </div>
                );
              } else {
                return null; // Skip this order for "Zamówione/Gotowe" section
              }
            })}
          </div>
        </div>
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