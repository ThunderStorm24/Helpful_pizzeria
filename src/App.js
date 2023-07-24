import React from "react";
import './App.css';
import Home from './Pages/Home.js';
import Menu from './Pages/Menu.js';
import Login from './Auth/Login.js';
import Profil from './Pages/Profil.js'
import Register from './Auth/Register.js';
import Koszyk from './Pages/Koszyk.js';
import Orders from './Pages/Orders.js';
import AdminOrders from './Pages/AdminOrder.js';
import Users from './Pages/Users.js'
import { Route, Routes} from "react-router-dom";

function App() {
  
  return (
    <div className="App black text-white">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Menu" element={<Menu />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Register" element={<Register />}></Route>
        <Route path="/Profil" element={<Profil />}></Route>
        <Route path="/Koszyk" element={<Koszyk />}></Route>
        <Route path="/Orders" element={<Orders />}></Route>
        <Route path="/AdminOrders" element={<AdminOrders />}></Route>
        <Route path="/Users" element={<Users />}></Route>
      </Routes>

    </div>
  );
}

export default App;
