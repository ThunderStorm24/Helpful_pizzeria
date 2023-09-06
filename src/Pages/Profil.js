import NavbarE from './../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';

export default function Profil() {

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [loginID, setLoginID] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [user, setUser] = useState({});

  const [skladniki, setSkladniki] = useState([]);
  const [ulubione, setUlubione] = useState([]);


  const handleSkladnikClick = (skladnik, skladnikId) => {
    Axios.post('/ZmienUlubione', {
      ID_Skladnika: skladnikId,
      ID_Uzytkownika: loginID,
      Nazwa: skladnik
    }).then((response) => {
      console.log(response)
    })
    window.location.reload();
  }

  useEffect(() => {
    fetch('/skladniki')
      .then(response => response.json())
      .then(data => setSkladniki(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch('/ulubioneskladniki')
      .then(response => response.json())
      .then(data => setUlubione(data))
      .catch(error => console.error(error));
  }, []);

  const isUlubiony = (skladnik) => {
    const found = ulubione.find(u => u.Nazwa === skladnik.Nazwa && u.ID_Uzytkownika === loginID);
    if (found) {
      if (found.Ulubiony === 'Tak') {
        return 'ulubiony';
      } else if (found.Ulubiony === 'Nie') {
        return 'znienawidzony';
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

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

  //Jeszcze ikonki jakies dodac do składników
  //Wyświetlanie zalogowanego użytkownika, trzeba jeszcze zrobić edycję zalogowanego użytkownika
  useEffect(() => {
    Axios.get(`/uzytkownicy/${loginID}`)
    .then(response => {
      setUser(response.data);
      setLoading(false); // zmiana stanu loading na false
    })
      .catch(error => console.error(error));
  }, [loginStatus]);

  function handleEdytujClick() {
    console.log("Edytuj profil")
  }
  
  return <div style={{ height: "1000px" }}>

    <NavbarE />
    {loading ? (
        <p>Ładowanie...</p>
        ) : (
    <div>
        
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-dark text-white">
              <div className="card-header text-center border-secondary">
                <h4>Profil użytkownika</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Imię:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Imie}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Nazwisko:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Nazwisko}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Adres:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Adres}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Kod pocztowy:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Kod_Pocztowy}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Telefon:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Telefon}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Login:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{user.Login}</h6>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-primary" style={{ textAlign: "left" }}>Edytuj</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="col-md-5">
          <h1 className="mt-5">ULUBIONE/ZNIENAWIDZONE SKŁADNIKI</h1>
          {skladniki.sort((a, b) => a.Nazwa.localeCompare(b.Nazwa)).map(skladnik => (
            <button
              key={skladnik.ID_Skladnika}
              className={`skladnik ${isUlubiony(skladnik)}`}
              onClick={() => handleSkladnikClick(isUlubiony(skladnik), skladnik.ID_Skladnika)}
            >
              {skladnik.Nazwa}
            </button>
          ))}
        </div>
      </div>
     
    </div>
        )}
  </div>



}