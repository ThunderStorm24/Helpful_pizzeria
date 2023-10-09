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
import { Route, Routes} from "react-router-dom";
import { SessionContext } from "./SessionContext/Session.js";
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  const [userSession,setUserSession] = useState(null);

  useEffect(() => {
    Axios.get("/login").then((response) => {
      if (response.data.loggedIn == true) {
        setUserSession(response.data.user[0])
      } else {
      }
    })
  }, [])
  
  return (
    <div className="App black text-white">
      <SessionContext.Provider value={{ userSession, setUserSession }}>
        
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Menu" element={<Menu />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Rejestracja" element={<Register />}></Route>
        <Route path="/Profil" element={<Profil />}></Route>
        <Route path="/Koszyk" element={<Koszyk />}></Route>
        <Route path="/Orders" element={<Orders />}></Route>
        <Route path="/AdminOrders" element={<AdminOrders />}></Route>
        <Route path="/AdminOrdersNotLogged" element={<AdminOrdersNotLogged />}></Route>
        <Route path="/Users" element={<Users />}></Route>
      </Routes>
      </SessionContext.Provider>

    </div>
  );
}

export default App;
