import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post('/login', {
            Login: username, 
            Password: password
        }).then((response) => {

            if(response.data.message){
                setLoginStatus(response.data.message)
            } else {
                setLoginStatus("Jesteś zalogowany jako: "+response.data[0].Login)
                navigate("/");
                window.location.reload();
            }
        })
    }

    useEffect(() => {
        Axios.get("/login").then((response) => {
            if (response.data.loggedIn == true) {
            setLoginStatus(response.data.user[0].Login)
            navigate("/Profil");
            }
        })
    }, [])

    return   <div>
    <NavbarE />
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column col-12 col-md-6">
        <div className="d-flex flex-column m-5 p-5 border border-5 rounded">
          <h1 className="text-center">LOGOWANIE</h1>

          <div className="form-group mt-3">
            <label htmlFor="username">Login:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button onClick={login} className="btn btn-primary mt-5 w-100">
            Login
          </button>

          <p className="mt-3">
            Nie masz jeszcze konta? Przejdź do{" "}
            <a href="/Register">rejestracji!</a>
          </p>

          {loginStatus && (
            <div className="alert alert-danger mt-3" role="alert">
              {loginStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
}

