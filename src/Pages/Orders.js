import NavbarE from './../Components/NavBar.js';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Axios from 'axios';
import { Button } from "react-bootstrap";
import { SessionContext } from '../SessionContext/Session.js';

export default function Orders() {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const userSession = useContext(SessionContext).userSession;

    console.log(userSession?.ID_Uzytkownika);

    useEffect(() => {
      if (userSession?.ID_Uzytkownika) { // Sprawdź, czy userID nie jest pusty
        Axios.get(`/Zamowienia/${userSession?.ID_Uzytkownika}`)
            .then(response => {
                setOrders(response.data);
                setLoading(false); // zmiana stanu loading na false
            })
            .catch(error => console.error(error));
          }
    }, [userSession?.ID_Uzytkownika]);

  return (
    <div style={{ minHeight: "140vh" }}>
      <NavbarE />
      {loading ? (
        <div style={{ height: "1000px" }}>
          <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {/* Zamówione/Gotowe */}
          <div className="m-5 rounded-5" style={{ marginTop: "10px", background: "#182218" }}>
            <div className="d-flex justify-content-center flex-wrap">
              <h1 className="col-10 col-md-6 border border-5 mt-4 p-3" style={{ background: "#df3400" }}>Zamówione/Gotowe</h1>
            </div>
            <div className="d-flex justify-content-center flex-wrap">
              {orders.length === 0 ? (
                <div className="alert alert-info m-3">
                  Nie masz żadnych aktywnych zamówień. Aby złożyć zamówienie, zerknij do naszego menu:
                  <div><Button className="mt-2" href="/menu">Chodźmy!</Button></div>
                </div>
              ) : (
                orders.map((order) => {
                  if (order.Status === "Zamówiono" || order.Status === "Gotowe") {
                    return (
                      <div key={order.ID_Zamowienia} className="border border-5 rounded p-3 mb-5 ms-3 mt-5" style={{
                        backgroundColor: order.Status === 'Gotowe' ? '#066345' : '#303030',
                        color: 'white',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "500px",
                        width: "370px"
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
                        <p>
                          Status:{" "}
                          <span
                            style={{
                              padding: '0.5rem',
                              borderRadius: '8px',
                              backgroundColor: order.Status === 'Gotowe' ? '#28a745' : '#ffa107',
                              color: '#fff',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            {order.Status}
                          </span>
                        </p>
                        <div>Odbiór:</div>
                      </div>

                    );
                  } else {
                    return <div></div>; // Skip this order for "Historia zamówień" section
                  }
                }))}
            </div>
          </div>

          {/* Historia zamówień */}
          <div className="m-5 rounded-5" style={{ marginTop: "10px", background: "#441818" }}>
            <div className="d-flex justify-content-center flex-wrap">
              <h1 className="col-10 col-md-6 border border-5 m-2 p-3" style={{ background: "#921818" }}>Historia zamówień</h1>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
              {orders.length === 0 ? (
                <div className="alert alert-info m-3">
                  Nie masz żadnych dokonanych zamówień. Złóż zamówienie, a historia twojego zamówienia się tu pokaże, gdy zostanie ono wykonane!
                </div>
              ) : (
                orders.map((order) => {
                  if (order.Status === "Zakończone") {
                    return (
                      <div key={order.ID_Zamowienia} className="border border-5 rounded p-3 mb-5 ms-3 mt-5" style={{
                        backgroundColor: '#303030',
                        color: 'white',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "500px",
                        width: "370px"
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
                      </div>
                    );
                  } else {
                    return null; // Skip this order for "Zamówione/Gotowe" section
                  }
                }))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
    