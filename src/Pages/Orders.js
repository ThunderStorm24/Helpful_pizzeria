import NavbarE from './../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Axios from 'axios';



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
        Axios.get(`/Zamowienia/${loginID}`)
            .then(response => {
                setOrders(response.data);
                setLoading(false); // zmiana stanu loading na false
                console.log(orders);
            })
            .catch(error => console.error(error));
    }, [loginStatus]);

    return (
        <div>
          <NavbarE />
          {loading ? (
            <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
          ) : (
            <div style={{marginTop: "30px"}}>
              {/* Zamówione/Gotowe */}
              <div>
                <h1>Zamówione/Gotowe</h1>
                <div className="d-flex flex-wrap">
                {orders.map((order) => {
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
                    return null; // Skip this order for "Historia zamówień" section
                  }
                })}
                </div>
              </div>
      
              {/* Historia zamówień */}
              <div className="mt-3">
                <h1>Historia zamówień</h1>
                <div className="d-flex flex-wrap mt-3">
                {orders.map((order) => {
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
                })}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    