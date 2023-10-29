import React from "react";
import './style/App.css';
import './style/UserProfile.css'
import './style/Buttons.css'
import Home from './Pages/Home.js';
import Menu from './Pages/Menu.js';
import Login from './Auth/Login.js';
import Profil from './Pages/Profil.js'
import Register from './Auth/Register.js';
import Koszyk from './Pages/Koszyk.js';
import Orders from './Pages/Orders.js';
import AdminOrders from './Pages/AdminOrder.js';
import AdminOrdersNotLogged from './Pages/AdminOrderNotLogged.js';
import Users from './Pages/Users.js'
import { Route, Routes } from "react-router-dom";
import { SessionContext } from "./SessionContext/Session.js";
import Axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import UserPrivateRoute from "./PrivateRoutes/UserPrivateRoute.js"
import PrivateRoute from './PrivateRoutes/PrivateRoute.js';
import NotLoggedRoute from "./PrivateRoutes/NotLoogedRoute.js";

function App() {

  const [userSession, setUserSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Dodajemy nowy stan do monitorowania, czy dane są ładowane

  useEffect(() => {
    // Sprawdzamy, czy mamy dane użytkownika w pamięci podręcznej (localStorage)
    const cachedUser = localStorage.getItem('cachedUser');

    if (cachedUser) {
      setUserSession(JSON.parse(cachedUser));
    } else {
      // Jeśli danych użytkownika nie ma w pamięci podręcznej, wykonujemy zapytanie
      Axios.get("/login").then((response) => {
        if (response.data.loggedIn === true) {
          // Zapisujemy dane użytkownika w pamięci podręcznej
          localStorage.setItem('cachedUser', JSON.stringify(response.data.user[0]));
          setUserSession(response.data.user[0]);
        } else {
        }
      });
    }
    setIsLoading(false);
  }, []);

  console.log(userSession)

  return (
    <div className="App">
      <SessionContext.Provider value={{ userSession, setUserSession }}>
        {isLoading ? (
          // Tutaj możesz dodać komunikat lub spinner oczekiwania na dane
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/Menu" element={<Menu />}></Route>

            <Route path="/Login"
              element={
                userSession ? (
                  <Navigate to="/Profil" />
                ) : (
                  <Login setUserSession={setUserSession} />
                )
              }>
            </Route>

            <Route path="/Rejestracja" element={
              userSession ? (
                <Navigate to="/Profil" />
              ) : (
                <Register />
              )
            }>
            </Route>

            <Route
              path="/Profil"
              element={
                userSession ? (
                  <Profil />
                ) : (
                  <Navigate to="/Login" />
                )
              }
            ></Route>

            <Route
              path="/Koszyk"
              element={
                userSession ? (
                  userSession.Rola === 'admin' ? (
                    <Navigate to="/" />
                  ) : (
                    <Koszyk />
                  )
                ) : (
                  <Navigate to="/Login" />
                )
              }
            />

            <Route path="/Orders" element={
              userSession ? (
                <Orders />
              ) : (
                <Navigate to="/Login" />
              )
            }>
            </Route>

            <Route path="/AdminOrders" element={
              userSession ? (
                userSession.Rola === 'admin' ? (
                  <AdminOrders />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/Login" />
              )
            }>
            </Route>

            <Route path="/AdminOrdersNotLogged" element={
              userSession ? (
                userSession.Rola === 'admin' ? (
                  <AdminOrdersNotLogged />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/Login" />
              )
            }>
            </Route>

            <Route path="/Users" element={
              userSession ? (
                userSession.Rola === 'admin' ? (
                  <Users />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/Login" />
              )
            }></Route>

            <Route path="*" element={<div className="mt-5" style={{ fontSize: "50px" }}>ERROR 404 NOT FOUND</div>}></Route>

          </Routes>
        )}
      </SessionContext.Provider>

    </div>
  );
}

export default App;
