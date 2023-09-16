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

    const handleCloseModal = () => {
      setReadyModal(false);
      setFinishModal(false);
};

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [orderID, setOrderID] = useState('');
    const [orderPizza, setOrderPizza] = useState([])
    

    useEffect(() => {
        Axios.get(`/ZamowieniaAdmin`)
            .then(response => {
                setOrders(response.data);
                setLoading(false); // zmiana stanu loading na false
            })
            .catch(error => console.error(error));
    }, []);

    //DODAWANIE użytkownika
    const handleReady = (order) => {
      setReadyModal(true);
      setOrderID(order.ID_Zamowienia)
      setOrderPizza(order.Pizze_z_cenami.split(","))
    };

    const handleReadyOrder = () => {
      console.log("Zamówienie przygotowane")
    };

    const handleFinish = (order) => {
      setFinishModal(true);
      setOrderID(order.ID_Zamowienia)
      setOrderPizza(order.Pizze_z_cenami.split(","))
    };

    const handleFinishOrder = () => {
      console.log("Zamówienie zakończone")
    };

    return ( <div style={{ minHeight: "140vh" }}>
    <NavbarE />
    {loading ? (
      <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
    ) : (
      <div style={{marginTop: "10px"}}>
        {/* Zamówione*/}
        <div>
        <div className="d-flex justify-content-center">
          <h1 className="col-10 col-md-3 border border-5 m-2 p-3 rounded">Zamówione</h1>
          </div>
          <div className="d-flex flex-wrap justify-content-left">
          {orders.map((order) => {
            if (order.Status === "Zamówiono") {
              return (
                  <div key={order.ID_Zamowienia} className="col-11 col-md-2 border rounded p-3 ms-3 mt-3">
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <p>Jaka Dostawa: {order.Dostawa}</p>
                  <p>Data złożenia: {order.Data_Zlozenia}</p>
                  <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  <h3>Opis zamówienia:</h3>
                  <ul>
                    {order.Pizze_z_cenami.split(",").map((pizza) => (
                      <li key={pizza}>{pizza}</li>
                    ))}
                  </ul>
                  <p>Status: <span>{order.Status}</span></p>
                  <Button onClick={() => handleReady(order)} className="btn-primary">Gotowe</Button>
                </div>
              );
            } else {
              return null; // Skip this order for "Historia zamówień" section
            }
          })}
          </div>
        </div>

        {/* Gotowe */}
        <div style={{marginTop: "10px"}}>
        <div className="d-flex justify-content-center">
        <h1 className="col-10 col-md-3 border border-5 m-2 p-3 rounded">Gotowe</h1>
        </div>
        <div className="d-flex">
        {orders.map((order) => {
            if (order.Status === "Gotowe") {
              return (
                  <div key={order.ID_Zamowienia} className="col-11 col-md-2 border rounded p-3 ms-3 mt-3">
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <p>Jaka Dostawa: {order.Dostawa}</p>
                  <p>Data złożenia: {order.Data_Zlozenia}</p>
                  <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  <h3>Opis zamówienia:</h3>
                  <ul>
                    {order.Pizze_z_cenami.split(",").map((pizza) => (
                      <li key={pizza}>{pizza}</li>
                    ))}
                  </ul>
                  <p>Status: <span>{order.Status}</span></p>
                  <Button onClick={() => handleFinish(order)} className="btn-success">Zakończ</Button>
                </div>
              );
            } else {
              return null; // Skip this order for "Historia zamówień" section
            }
          })}
          </div>
          </div>

        {/* Historia zamówień */}
        <div style={{marginTop: "10px"}}>
          <div className="d-flex justify-content-center">
          <h1 className="col-10 col-md-3 border border-5 m-2 p-3 rounded">Historia zamówień</h1>
          </div>
          <div className="d-flex">
          {orders.map((order) => {
            if (order.Status === "Zakończone") {
              return (
                <div key={order.ID_Zamowienia} className="col-11 col-md-2 border rounded p-3 ms-3 mt-3">
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <p>Jaka Dostawa: {order.Dostawa}</p>
                  <p>Data złożenia: {order.Data_Zlozenia}</p>
                  <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  <h3>Opis zamówienia:</h3>
                  <ul>
                    {order.Pizze_z_cenami.split(",").map((pizza) => (
                      <li key={pizza}>{pizza}</li>
                    ))}
                  </ul>
                  <p>Status: <span>{order.Status}</span></p>
                </div>
              );
            } else {
              return null; // Skip this order for "Zamówione/Gotowe" section
            }
          })}
          </div>
        </div>
      </div>
    )}
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
  </div>
);
}