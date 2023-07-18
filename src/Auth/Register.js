import { useState } from 'react';
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';

export default function Login() {

    const [logReg, setLogReg] = useState('');
    const [passReg, setPassReg] = useState('');
    const [nameReg, setNameReg] = useState('');
    const [surnameReg, setSurnameReg] = useState('');
    const [addressReg, setAdressReg] = useState('');
    const [zipCodeReg, setZipCodeReg] = useState('');
    const [phoneReg, setPhoneReg] = useState('');

    Axios.defaults.withCredentials = true;

    const register = () => {
        Axios.post('/register', {
            Name: nameReg, 
            Surname: surnameReg, 
            Adress: addressReg, 
            Zipcode: zipCodeReg, 
            Phone: phoneReg, 
            Login: logReg, 
            Password: passReg
        }).then((response) => {
            console.log(response)
        })
    }

    return <div>
    <NavbarE />
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column col-12 col-md-9 col-xl-6">
        <div className="d-flex flex-column m-5 p-5 center border border-5">
          <h1>REJESTRACJA</h1>
  
          <div className="form-group mt-3">
            <label htmlFor="username">Login:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              defaultValue={logReg}
              onChange={(e) => {
                setLogReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              defaultValue={passReg}
              onChange={(e) => {
                setPassReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="name">Imię:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              defaultValue={nameReg}
              onChange={(e) => {
                setNameReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="surname">Nazwisko:</label>
            <input
              type="text"
              className="form-control"
              id="surname"
              defaultValue={surnameReg}
              onChange={(e) => {
                setSurnameReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="address">Adres:</label>
            <input
              type="text"
              className="form-control"
              id="address"
              defaultValue={addressReg}
              onChange={(e) => {
                setAdressReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="zip-code">Kod Pocztowy:</label>
            <input
              type="text"
              className="form-control"
              id="zip-code"
              defaultValue={zipCodeReg}
              onChange={(e) => {
                setZipCodeReg(e.target.value);
              }}
            />
          </div>
  
          <div className="form-group mt-3">
            <label htmlFor="phone-number">Numer Telefonu:</label>
            <input
              type="text"
              className="form-control"
              id="phone-number"
              defaultValue={phoneReg}
              onChange={(e) => {
                setPhoneReg(e.target.value);
              }}
            />
          </div>
  
          <button onClick={register} className="mt-5 btn btn-primary col-12 col-md-4 col-xl-3">Zarejestruj</button>
            <p className="mt-3">Masz już konto? Przejdź do <a href="/Login">Logowania!</a></p>
        </div>
        
        </div>
    </div>
    </div>
}

