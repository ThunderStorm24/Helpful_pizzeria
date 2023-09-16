import NavbarE from './../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Axios from 'axios';
import { Button } from "react-bootstrap";



export default function Orders() {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [loginID, setLoginID] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        Axios.get("/login").then((response) => {
            if (response.data.loggedIn == true) {
                setLoginStatus(response.data.user[0].Login)
                setLoginID(response.data.user[0].ID_Uzytkownika)
            } else {
                navigate("/");
            }
        })
    }, [])

    useEffect(() => {
      if (loginID) { // Sprawdź, czy userID nie jest pusty
        Axios.get(`/Zamowienia/${loginID}`)
            .then(response => {
                setOrders(response.data);
                console.log(orders);
                setLoading(false); // zmiana stanu loading na false
            })
            .catch(error => console.error(error));
          }
    }, [loginID]);

    return (
        <div style={{ minHeight: "140vh" }}>
          <NavbarE />
          {loading ? (
            <div style={{height: "1000px"}}>
            <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
            </div>
          ) : (
            <div style={{marginTop: "30px"}}>
              {/* Zamówione/Gotowe */}
              <div>
              <div className="d-flex justify-content-center flex-wrap">
                <h1 className="col-10 col-md-3 border border-5 m-2 p-3">Zamówione/Gotowe</h1>
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                {orders.length === 0 ? (
        <div className="alert alert-info m-3">
          Nie masz żadnych aktywnych zamówień. Aby złożyć zamówienie, zerknij do naszego menu:
          <div><Button className="mt-2" href="/menu">Chodźmy!</Button></div>
        </div>
      ) : (
        orders.map((order) => {
                  if (order.Status === "Zamówiono" || order.Status === "Gotowe") {
                    return (
                      <div key={order.ID_Zamowienia} className="border rounded p-3 ms-3 mt-3" style={{ backgroundColor: 'black', color: 'white', height: "500px", width: "400px" }}>
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
                      <p>
                        Status:{" "}
                        <span
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: order.Status === 'Gotowe' ? '#28a745' : '#ffc107',
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
              <div>
              <div className="d-flex justify-content-center flex-wrap">
                <h1 className="col-10 col-md-3 border border-5 m-2 p-3">Historia zamówień</h1>
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
                      <div key={order.ID_Zamowienia} className="border rounded p-3 ms-3 mt-3 mb-3" style={{ backgroundColor: 'black', color: 'white', height: "500px", width: "400px" }}>
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
    