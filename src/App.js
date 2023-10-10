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
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import UserPrivateRoute from "./PrivateRoutes/UserPrivateRoute.js"
import PrivateRoute from './PrivateRoutes/PrivateRoute.js';
import NotLoggedRoute from "./PrivateRoutes/NotLoogedRoute.js";

function App() {

  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(null);

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
  }, []);


  return (
    <div className="App black text-white">
      <SessionContext.Provider value={{ userSession, setUserSession }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Menu" element={<Menu />}></Route>

          <Route path="/Login" 
          element={
            <NotLoggedRoute element={
              <Login />
            }>
            </NotLoggedRoute> 
          }> 
        </Route>

          <Route path="/Rejestracja" element={
            <NotLoggedRoute element={
              <Register />
            }>
            </NotLoggedRoute>
          }>
          </Route>

          <Route path="/Profil" element={<Profil />}>
          </Route>

          <Route path="/Koszyk" element={
          <UserPrivateRoute element={
          <Koszyk />
          }>
          </UserPrivateRoute>
        }>
          </Route>

          <Route path="/Orders" element={
          <NotLoggedRoute element={<Orders />}>
          </NotLoggedRoute>          
            }>
          </Route>

          <Route path="/AdminOrders" element={<AdminOrders />}>
          </Route>

          <Route path="/AdminOrdersNotLogged" element={<AdminOrdersNotLogged />}>
          </Route>

          <Route path="/Users" element={<Users />}></Route>
          
        </Routes>
      </SessionContext.Provider>

    </div>
  );
}

export default App;
