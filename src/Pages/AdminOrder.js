import NavbarE from '../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import Axios from 'axios';

export default function AdminOrders() {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    

    useEffect(() => {
        Axios.get(`/Zamowienia`)
            .then(response => {
                setOrders(response.data);
                setLoading(false); // zmiana stanu loading na false
            })
            .catch(error => console.error(error));
    }, []);

    return ( <div style={{ height: "1500px" }}>
    <NavbarE />
    {loading ? (
      <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
    ) : (
      <div style={{marginTop: "30px"}}>
        {/* Zamówione*/}
        <div>
          <h1>Zamówione</h1>
          <div className="d-flex">
          {orders.map((order) => {
            if (order.Status === "Zamówiono") {
              return (
                  <div key={order.ID_Zamowienia} className="border rounded p-3 ms-3">
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
                  <button>Gotowe</button>
                </div>
              );
            } else {
              return null; // Skip this order for "Historia zamówień" section
            }
          })}
          </div>
        </div>

        {/* Gotowe */}
        <div>
        <h1>Gotowe</h1>
        <div className="d-flex">
        {orders.map((order) => {
            if (order.Status === "Gotowe") {
              return (
                  <div key={order.ID_Zamowienia} className="border rounded p-3 ms-3">
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
                  <button>Zakończ</button>
                </div>
              );
            } else {
              return null; // Skip this order for "Historia zamówień" section
            }
          })}
          </div>
          </div>

        {/* Historia zamówień */}
        <div>
          <h1>Historia zamówień</h1>
          <div className="d-flex">
          {orders.map((order) => {
            if (order.Status === "Zakończone") {
              return (
                <div key={order.ID_Zamowienia} className="border rounded p-3 ms-3">
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
  </div>
);
}