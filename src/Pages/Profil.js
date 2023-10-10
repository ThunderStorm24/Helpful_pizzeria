import NavbarE from './../Components/NavBar.js';
import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import EditModal from "../Components/WindowModal/EditUserModal.js"
import Spinner from 'react-bootstrap/Spinner';
import { SessionContext } from '../SessionContext/Session.js';

export default function Profil() {


  const userSession = useContext(SessionContext).userSession;
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [added, setAdded] = useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const [skladniki, setSkladniki] = useState([]);
  const [ulubione, setUlubione] = useState([]);
  const [colors, setColors] = useState({});
  const [initialColors, setInitialColors] = useState({});
  const [change, setChange] = useState(false);

  const handleCloseModal = () => {
    setEditModal(false);
};

  const handleSkladnikClick = async (skladnik, skladnikId) => {
    setChange(true);
    const updatedColors = { ...colors };

    // Jeśli składnik jest szary, zmieniamy go na zielony, jeśli jest zielony, zmieniamy na czerwony, a jeśli jest czerwony, zmieniamy na szary
    if (updatedColors[skladnikId]) {
    updatedColors[skladnikId] = (updatedColors[skladnikId] === 'ulubiony')
      ? 'nieulubiony'
      : '';
  } else {
    // Jeśli składnik nie istnieje, dodaj go do stanu i ustaw na 'ulubiony'
    updatedColors[skladnikId] = 'ulubiony';
  }

    // Aktualizujemy stan kolorów
    setColors(updatedColors);
  }

  const getChangedColors = () => {
    const changedColors = {};
    for (const skladnikId in colors) {
      if (colors[skladnikId] !== initialColors[skladnikId]) {
        changedColors[skladnikId] = colors[skladnikId];
      }
    }
    return changedColors;
  };

  const handleSkladnikAccept = () => {
    const changedColors = getChangedColors();

    const loginID=userSession?.ID_Uzytkownika;

    // Wyślij zmienione składniki na serwer za pomocą Axios
    Axios.post('/ZmienUlubione', { changedColors, loginID })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        // Obsłuż błąd, jeśli to konieczne
      });
  };

  console.log(colors);
  //Jeszcze ikonki jakies dodac do składnikóww
  useEffect(() => {
    fetch('/skladniki')
      .then(response => response.json())
      .then(data => setSkladniki(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (userSession?.ID_Uzytkownika) {
      Axios.get(`/ulubioneskladniki/${userSession?.ID_Uzytkownika}`)
        .then(response => {
          const data = response.data; // Odczytaj dane z odpowiedzi Axios
  
          // Tworzymy obiekt kolorów na podstawie danych z bazy danych
          const colorsObject = {};
          const initialColors = {};
          data.forEach(item => {
            if (item.Ulubiony === 'Tak') {
              colorsObject[item.ID_Skladnika] = 'ulubiony';
              initialColors[item.ID_Skladnika] = 'ulubiony';
            } else if (item.Ulubiony === 'Nie') {
              colorsObject[item.ID_Skladnika] = 'nieulubiony';
              initialColors[item.ID_Skladnika] = 'nieulubiony';
            } else {
              colorsObject[item.ID_Skladnika] = '';
              initialColors[item.ID_Skladnika] = '';
            }
          });
          setColors(colorsObject);
          setInitialColors(initialColors);
          setUlubione(data);
          setLoading(false);
        })
        .catch(error => console.error(error));
    }
  }, [userSession?.ID_Uzytkownika]);

  const isUlubiony = (skladnik) => {
    const status = colors[skladnik.ID_Skladnika];
    if (status === 'ulubiony') {
      return 'ulubiony';
    } else if (status === 'nieulubiony') {
      return 'nieulubiony';
    } else {
      return null;
    }
  };

  //EDYTOWANIE zalogowanego użytkownika
  const handleChange = () => {
    
    setEditModal(true);
  };

  const handleEditModal = async (user) => {
    console.log(`Zmieniam użytkownika o ID ${user.userID} ${user.name} ${user.surname}`);
    Axios.post('http://localhost:5000/EdytujUzytkownika', {
        UserID: user.userID,
        Name: user.name,
        Surname: user.surname,
        Adress: user.adress,
        Zipcode: user.zipcode,
        Phone: user.phone,
        Login: user.login,
      //Password: user.password,
    }).then((data) => {
      console.log(data)
      setMessage(data.data);
      setErrors([]);
      window.location.reload();
    }).catch((error) => {
      console.log('error', error);
      setErrors(error.response.data.errors);
    })
  };
  
  return <div style={{ height: "1200px" }}>

    <NavbarE />
    <div>
        
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card bg-dark text-white">
              <div className="card-header text-center border-secondary">
                <h4>Profil użytkownika [ID: {userSession?.ID_Uzytkownika}]</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Imię:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Imie}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Nazwisko:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Nazwisko}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Adres:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Adres}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Kod pocztowy:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Kod_Pocztowy}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Telefon:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Telefon}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <h6 className="text-muted ms-5" style={{ textAlign: "left" }}>Login:</h6>
                  </div>
                  <div className="col-8">
                    <h6 className="ms-5" style={{ textAlign: "left" }}>{userSession?.Login}</h6>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button onClick={() => handleChange()} className="btn btn-primary" style={{ textAlign: "left" }}>Edytuj</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="col-md-5">
    <h1 className="mt-3">SKŁADNIKI</h1>
    <div className="text-center mt-2 mb-3">
      <div className="d-inline-block p-2 text-white border" style={{backgroundColor: "green"}}>ULUBIONE</div>
      <div className="d-inline-block p-2 text-white border" style={{backgroundColor: "red"}}>NIEULUBIONE</div>
      <div className="d-inline-block p-2 text-white border" style={{backgroundColor: "#303030"}}>OBOJĘTNE</div>
    </div>
    {loading ? (
  // Ten blok zostanie wyrenderowany podczas ładowania danych
  <div className="text-center mt-2">Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
) : (
  <div>
  {skladniki.sort((a, b) => a.Nazwa.localeCompare(b.Nazwa)).map(skladnik => (
    <button
      key={skladnik.ID_Skladnika}
      className={`skladnik ${colors[skladnik.ID_Skladnika] || ''}`}
      onClick={() => handleSkladnikClick(isUlubiony(skladnik), skladnik.ID_Skladnika)}
    >
      {skladnik.Nazwa}
      {skladnik.ikona && (
        <img className="ms-1" style={{ width: "30px", height: "30px" }} src={skladnik.ikona} alt={skladnik.Nazwa} />
      )}
    </button>
  ))}
</div>
)}
          </div>

      </div>
      <button className={`mt-3 btn btn-primary ${change ? 'saveIngredients' : ''}`} onClick={() => handleSkladnikAccept()} disabled={!change}>Zapisz składniki</button>
      <div className="mt-5" >
      <a href="https://www.flaticon.com/free-icons/vegetable" title="vegetable icons">Vegetable icons created by SA Family - Flaticon</a>
      </div>
     
    </div>

        <EditModal 
        show={editModal}
        onHide={handleCloseModal}
        onSubmit={handleEditModal}
        title={`Edytowanie twoich danych`}
        userID={userSession?.ID_Uzytkownika}
        button={`Edytuj`}
        Added={added}
        message={message}
        errors={errors}
        />
  </div>



}