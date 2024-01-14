import React from "react";
import { Button } from "react-bootstrap";

function Orderslogged({ orders, handleReady, handleFinish, handleDelete }) {
  return (
    <div>
      {/* Zamówione */}
      <div className="m-5 rounded-5" style={{ background: "#301818" }}>
        <div className="d-flex justify-content-center">
          <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{ background: "#df3400" }}>Zamówione</h1>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {orders.map((order) => {
            if (order.Status === "Zamówiono") {
              return (
                <div
                  key={order.ID_Zamowienia}
                  className="col-11 col-md-5 col-xl-3 border border-5  rounded p-3 ms-3 me-3 mt-3 mb-3"
                  style={{
                    background: "#202020",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "500px",
                  }}
                >
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <div className="d-flex flex-column flex-wrap" style={{textAlign: "left"}}>
                    <div>Imię i Nazwisko: {order.imie}{order.nazwisko}</div>
                    <div>Telefon: {order.telefon}</div>
                    <div>Adres: {order.adres} {order.kod_pocztowy}</div>
                    <div>Dostawa: {order.Dostawa}</div>
                    <div>Data złożenia: {order.Data_Zlozenia}</div>
                    <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  </div>
                  <h3>Opis zamówienia:</h3>
                  <ul className="d-flex flex-column" style={{ overflowY: 'scroll', maxHeight: '100px', textAlign: "left" }}>
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
      <div className="m-5 rounded-5" style={{ marginTop: "10px", background: "#183218" }}>
        <div className="d-flex justify-content-center">
          <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{ background: "#287745" }}>Gotowe</h1>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {orders.map((order) => {
            if (order.Status === "Gotowe") {
              return (
                <div
                  key={order.ID_Zamowienia}
                  className="col-11 col-md-5 col-xl-3 border border-5  rounded p-3 ms-3 me-3 mt-3 mb-3"
                  style={{
                    background: "#202020",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "500px",
                  }}>
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <div className="d-flex flex-column flex-wrap" style={{textAlign: "left"}}>
                    <div>Imię i Nazwisko: {order.imie}{order.nazwisko}</div>
                    <div>Telefon: {order.telefon}</div>
                    <div>Adres: {order.adres} {order.kod_pocztowy}</div>
                    <div>Dostawa: {order.Dostawa}</div>
                    <div>Data złożenia: {order.Data_Zlozenia}</div>
                    <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  </div>
                  <h3>Opis zamówienia:</h3>
                  <ul className="d-flex flex-column" style={{ overflowY: 'scroll', maxHeight: '100px', textAlign: "left" }}>
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
      <div className="rounded-5" style={{ marginLeft: "48px", marginRight: "48px", marginTop: "10px", background: "#541818" }}>
        <div className="d-flex justify-content-center">
          <h1 className="col-10 col-md-4 border border-3 mt-4 p-3 rounded" style={{ background: "#dc3545" }}>Historia zamówień</h1>
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          {orders.map((order) => {
            if (order.Status === "Zakończone") {
              return (
                <div
                  key={order.ID_Zamowienia}
                  className="col-11 col-md-5 col-xl-3 border border-5  rounded p-3 ms-3 me-3 mt-3 mb-3"
                  style={{
                    background: "#202020",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "500px",
                  }}>
                  <h2>ID Zamówienia: {order.ID_Zamowienia}</h2>
                  <div className="d-flex flex-column flex-wrap" style={{textAlign: "left"}}>
                    <div>Imię i Nazwisko: {order.imie}{order.nazwisko}</div>
                    <div>Telefon: {order.telefon}</div>
                    <div>Adres: {order.adres} {order.kod_pocztowy}</div>
                    <div>Dostawa: {order.Dostawa}</div>
                    <div>Data złożenia: {order.Data_Zlozenia}</div>
                    <p>Cena całego zamówienia: {order.Cena} PLN</p>
                  </div>
                  <h3>Opis zamówienia:</h3>
                  <ul className="d-flex flex-column" style={{ overflowY: 'scroll', maxHeight: '100px', textAlign: "left" }}>
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
  );
}

export default Orderslogged;