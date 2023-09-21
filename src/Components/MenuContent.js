import React, { useEffect, useState } from "react";
import Axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from 'react-paginate';
import Spinner from 'react-bootstrap/Spinner';
import ToastAddPizza from './smallComponents/ToastAddPizza'
import { Table, Form, Overlay, OverlayTrigger, Tooltip, Toast, ToastContainer } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';

function Bookmarks({props, updateItemsCount, actions}) {

  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [pizzaName, setPizzaName] = useState('');
  const [ulubioneTooltipVisible, setUlubioneTooltipVisible] = useState(false);
  const [nieUlubioneTooltipVisible, setNieUlubioneTooltipVisible] = useState(false);

  //ELEMENTY Z API
  const [pizze, setPizze] = useState([]);
  const [pizzeC, setPizzeC] = useState([]);
  const [pizzeM, setPizzeM] = useState([]);
  const [pizzeZ, setPizzeZ] = useState([]);
  const [pizzeO, setPizzeO] = useState([]);
  const [pizzeU, setPizzeU] = useState([]);
  const [skladniki, setSkladniki] = useState([]);

  //SESJA
  const [Rola, setRola] = useState("");
  const [ID, setID] = useState("");
  const [ulubione,setUlubione] = useState([])

// Paginacja
const [currentPage, setCurrentPage] = useState(1);
const [currentPageC, setCurrentPageC] = useState(1);
const [currentPageM, setCurrentPageM] = useState(1); // Dodane
const [currentPageU, setCurrentPageU] = useState(1); // Dodane
const [pizzasPerPage, setPizzasPerPage] = useState(9);

const handlePageChange = ({ selected }) => {
  setCurrentPage(selected + 1);
};

const handlePageChangeC = ({ selected }) => {
  setCurrentPageC(selected + 1);
};

const handlePageChangeM = ({ selected }) => { // Dodane
  setCurrentPageM(selected + 1);
};

const handlePageChangeU = ({ selected }) => { // Dodane
  setCurrentPageU(selected + 1);
};

  const indexOfLastPizza = currentPage * pizzasPerPage;
  const indexOfLastPizzaC = currentPageC * pizzasPerPage;
  const indexOfLastPizzaM = currentPageM * pizzasPerPage;
  const indexOfLastPizzaU = currentPageU * pizzasPerPage;
  
  const indexOfFirstPizza = indexOfLastPizza - pizzasPerPage;
  const indexOfFirstPizzaC = indexOfLastPizzaC - pizzasPerPage;
  const indexOfFirstPizzaM = indexOfLastPizzaM - pizzasPerPage;
  const indexOfFirstPizzaU = indexOfLastPizzaU - pizzasPerPage;

  //FILTR - ULUBIONY SKLADNIK Z API
  const [ulubioneChecked, setUlubioneChecked] = useState(false);
  const [nieUlubioneChecked, setNieUlubioneChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState("")

  //FILTR Ulubione składniki i czy checkbox zaznaczony
  const containsUlubioneSkladniki = (pizza) => {
    const ulubioneSkladniki = skladniki
      .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Tak")
      .map(skladnik => skladnik.Nazwa);
    if (ulubioneChecked && ulubioneSkladniki.some(skladnik => pizza.Skladniki.includes(skladnik))) {
      return true;
    }
    return false;
  };

  //FILTR NieUlubione składniki i czy checkbox zaznaczony
  const containsNieUlubioneSkladniki = (pizza) => {
    const nieUlubioneSkladniki = skladniki
      .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Nie")
      .map(skladnik => skladnik.Nazwa);
    if (nieUlubioneChecked && nieUlubioneSkladniki.some(skladnik => pizza.Skladniki.includes(skladnik))) {
      return true;
    }
    return false;
  };

   const ulubioneSkladniki = skladniki
    .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Tak")
    .map(skladnik => skladnik.Nazwa);

  const nieUlubioneSkladniki = skladniki
    .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Nie")
    .map(skladnik => skladnik.Nazwa);


    // funkcja, która przefiltrowuje pizze i zwróci tylko te, które zawierają ulubione lub nieulubione składniki użytkownika
    const filterPizze = (pizzeArray, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy) => {
      let filteredPizze = [...pizzeArray]; // Tworzymy kopię tablicy, aby uniknąć modyfikowania oryginalnej tablicy
    
      if (ulubioneChecked && nieUlubioneChecked) {
        filteredPizze = filteredPizze.filter(pizza => containsUlubioneSkladniki(pizza) && !containsNieUlubioneSkladniki(pizza));
      } else if (ulubioneChecked) {
        filteredPizze = filteredPizze.filter(pizza => containsUlubioneSkladniki(pizza));
      } else if (nieUlubioneChecked) {
        filteredPizze = filteredPizze.filter(pizza => !containsNieUlubioneSkladniki(pizza));
      }
    
      if (searchTerm) {
        const keywords = searchTerm.toLowerCase().split(" ");
        filteredPizze = filteredPizze.filter(pizza => {
          const pizzaInfo = `${pizza.Nazwa} ${pizza.Skladniki} ${pizza.ID} ${pizza.Cena}`;
          const lowercasePizzaInfo = pizzaInfo.toLowerCase();
          // Sprawdzamy, czy każde słowo kluczowe występuje w informacjach o pizzy
          return keywords.every(keyword => lowercasePizzaInfo.includes(keyword));
        });
      }
    
      // Sortowanie
      if (sortBy === 'priceDesc') {
        filteredPizze.sort((a, b) => {
          const aPriceSmall = a.Cena.split('/')[0].trim();
          const bPriceSmall = b.Cena.split('/')[0].trim();
          return bPriceSmall - aPriceSmall;
        });
      } else if (sortBy === 'priceAsc') {
        filteredPizze.sort((a, b) => {
          const aPriceSmall = a.Cena.split('/')[0].trim();
          const bPriceSmall = b.Cena.split('/')[0].trim();
          return aPriceSmall - bPriceSmall;
        });
      } else if (sortBy === 'nameAsc') {
        filteredPizze.sort((a, b) => a.Nazwa.localeCompare(b.Nazwa));
      } else if (sortBy === 'nameDesc') {
        filteredPizze.sort((a, b) => b.Nazwa.localeCompare(a.Nazwa));
      } else if (sortBy === 'IDAsc') {
        filteredPizze.sort((a, b) => a.ID_Pizzy - b.ID_Pizzy);
      } else if (sortBy === 'IDDesc') {
        filteredPizze.sort((a, b) => b.ID_Pizzy - a.ID_Pizzy);
      }
    
      return filteredPizze;
    };
    
// Użycie funkcji do filtrowania standardowych pizz
const filteredPizze = filterPizze(pizze, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy);

// Użycie funkcji do filtrowania pizz customowych
const filteredPizzeC = filterPizze(pizzeC, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy);

// Użycie funkcji do filtrowania pizz serii M
const filteredPizzeM = filterPizze(pizzeM, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy);

// Użycie funkcji do filtrowania pizz serii U
const filteredPizzeU = filterPizze(pizzeU, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy);

const currentPizzas = filteredPizze.slice(indexOfFirstPizza, indexOfLastPizza);
const currentPizzasC = filteredPizzeC.slice(indexOfFirstPizzaC, indexOfLastPizza);
const currentPizzasM = filteredPizzeM.slice(indexOfFirstPizzaM, indexOfLastPizzaM);
const currentPizzasU = filteredPizzeU.slice(indexOfFirstPizzaU, indexOfLastPizzaU);

  //WYŚWIETLANIE ulubionych
  useEffect(() => {
    if (ID) { // Sprawdź, czy ID nie jest puste
    Axios.get(`/pizzeUlubione/${ID}`)
      .then(response => setUlubione(response.data))
      .catch(error => console.error(error));
    }
  }, [ID]);

const handleCheckboxChange = (pizzaID) => {
  const isChecked = ulubione.some(item => item.ID_Pizzy === pizzaID);

  if (!isChecked) {
    // Usuń relację z bazy danych
    Axios.delete(`/usunRelacje/${ID}/${pizzaID}`)
      .then(response => {
        // Po udanym usunięciu odśwież stan lub inne odpowiednie działania
        if (response.status === 200) {
          setUlubione(prevUlubione => [...prevUlubione, { ID_Pizzy: pizzaID }]);
        }
      })
      .catch(error => console.error(error));
  } else {
    // Dodaj relację do bazy danych
    Axios.post(`/dodajRelacje/${ID}/${pizzaID}`)
      .then(response => {
        // Po udanym dodaniu odśwież stan lub inne odpowiednie działania
        if (response.status === 200) {
          setUlubione(prevUlubione => prevUlubione.filter(item => item.ID_Pizzy !== pizzaID));
        }
      })
      .catch(error => console.error(error));
  }
};

  //WYŚWIETLANIE pizzy oryginalnych
  useEffect(() => {
    fetch('/pizze')
      .then(response => response.json())
      .then(data => setPizze(data))
      .catch(error => console.error(error));
  }, []);

  //WYŚWIETLANIE pizzy customowych
  useEffect(() => {
    fetch('/pizzeCustom')
      .then(response => response.json())
      .then(data => setPizzeC(data))
      .catch(error => console.error(error));

  }, []);

  //WYŚWIETLANIE pizz danego użytkownika
  useEffect(() => {
    if (ID) { // Sprawdź, czy ID nie jest puste
    Axios.get(`/pizzeM/${ID}`)
      .then(response => setPizzeM(response.data))
      .catch(error => console.error(error));
    }
  }, [ID]);

  //WYŚWIETLANIE pizz do zatwierdzenia
  useEffect(() => {
    fetch('/pizzeZ')
      .then(response => response.json())
      .then(data => setPizzeZ(data))
      .catch(error => console.error(error));

  }, []);

  //WYŚWIETLANIE pizz oczekujących
  useEffect(() => {
    if (ID) { // Sprawdź, czy ID nie jest puste
    Axios.get(`/pizzeO/${ID}`)
      .then(response => setPizzeO(response.data))
      .catch(error => console.error(error));
    }
  }, [ID]);

  //WYŚWIETLANIE pizz ulubionych
  useEffect(() => {
    if (ID) { // Sprawdź, czy ID nie jest puste
    Axios.get(`/pizzeU/${ID}`)
      .then(response => setPizzeU(response.data))
      .catch(error => console.error(error));
    }
  }, [ID]);

  //WYŚWIETLANIE ulubionych składników 
  useEffect(() => {
    fetch('/ulubioneskladniki')
      .then(response => response.json())
      .then(data => setSkladniki(data))
      .catch(error => console.error(error));
  }, []);

  //OPERACJE edytowanie
  const handleEdit = (pizza) => {
    actions.editModal();
    actions.idPizzy(pizza.ID_Pizzy);
    actions.custom(pizza.Custom);
  };

  //OPERACJE usuwanie
  const handleDelete = (pizza) => {
    actions.deleteModal();
    actions.pizza(pizza);
  };

  //OPERACJA akceptacja stanu pizzy
  const handleAccept = (pizza) => {
    actions.acceptModal();
    actions.pizza(pizza);
  };

  //OPERACJA odrzucenie stanu pizzy
  const handleReject = (pizza) => {
    actions.deniedModal();
    actions.pizza(pizza);
  };

  //OPERACJA Anulowania stanu pizzy
  const handleCancel = (pizza) => {
    actions.cancelModal();
    actions.pizza(pizza);
  };

  //DO ZROBIENIA
  //OPERACJA Zmiana odrzuconej pizzy
  const handleChange = (pizza) => {
    actions.editModal();
    actions.idPizzy(pizza.ID_Pizzy);
    actions.custom(pizza.Custom);
  };
  
  //DODAWANIE PIZZY DO KOSZYKA
  const handleOrder = (pizza) => {
    Axios.post('/DodajDoKoszyka', {
      ID: ID,
      ID_Pizzy: pizza.ID_Pizzy,
    }).then((response) => {
      setPizzaName(pizza.Nazwa);
      setShowToast(true);
      updateItemsCount();
    })
  };

  const handleToastClose = () => setShowToast(false);

  //OPERACJE dodawanie
  const handleAdd = (type) => {
    if (type == "Oryginal") {
      actions.showModal();
    }
    if (type == "Custom") {
      actions.customShowModal();
    }
  };

  //SESJA
  useEffect(() => {
    Axios.get("/login").then((response) => {
      if (response.data.loggedIn == true) {
        setRola(response.data.user[0].Rola)
        setID(response.data.user[0].ID_Uzytkownika)
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
  }, [])

  const [tableWidth, setTableWidth] = useState('100%');

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 1500) {
        setTableWidth('1500px');
      } else {
        setTableWidth('100%');
      }
    }

    // Dodaj nasłuchiwanie zmiany rozmiaru ekranu
    window.addEventListener('resize', handleResize);

    // Wywołaj handleResize po pierwszym renderowaniu
    handleResize();

    // Usuń nasłuchiwanie po odmontowaniu komponentu
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState(0);
  const [userLikes, setUserLikes] = useState([]);

  useEffect(() => {
    fetch('/pizzeLike')
      .then(response => response.json())
      .then(data => setLikes(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetch('/Likes')
      .then(response => response.json())
      .then(data => setUserLikes(data))
      .catch(error => console.error(error));
  }, []);

  const [likeButtonStates, setLikeButtonStates] = useState({});

  const handleLikeClick = (ID_Pizzy) => {
    const existingLikeIndex = userLikes.findIndex(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak');

    if (existingLikeIndex !== -1) {
      // Jeśli polubienie istnieje, usuń je z userLikes
      const updatedLikes = [...userLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      setUserLikes(updatedLikes);
    }else{
      const newLike = {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID,
        Polubienie: 'Tak'
      };
      setUserLikes([...userLikes, newLike]);
    }
      // Jeśli polubienie nie istnieje, dodaj je
      Axios.post('/UserLike', {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID
      })
      .then(response => {
        console.log('Pomyślnie wykonano żądanie do /UserLike', response.data);
        if (response.data.Polubienie === 'Tak') {
          // Tutaj kod, który ma być wykonany, gdy Polubienie === 'Tak'
          setLikeButtonStates(prevState => ({
            ...prevState,
            [ID_Pizzy]: true,
          }));
        } else {
          // Tutaj kod, który ma być wykonany, gdy Polubienie !== 'Tak'
          // Możesz np. ustawić stan na false lub wykonać inne działania
          setLikeButtonStates(prevState => ({
            ...prevState,
            [ID_Pizzy]: false,
          }));
        }
      })
      .catch(error => {
        console.error('Błąd podczas wykonywania żądania do /UserLike', error);
        // Tutaj możesz dodać kod obsługi błędu
      });
  };

  console.log(likeButtonStates)

  const [disLikeButtonStates, setDisLikeButtonStates] = useState({});

  const handleDislikeClick = (ID_Pizzy) => {
    const existingLike = userLikes.find(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie');

    if (!existingLike) {
      console.log("git");
      setDisLikeButtonStates(prevState => ({
        ...prevState,
        [ID_Pizzy]: true,
      }));
    }else{
      setDisLikeButtonStates(prevState => ({
        ...prevState,
        [ID_Pizzy]: false,
      }));
    }
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="ms-3 col-12 col-md-8 ">
        <Tabs fill defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab  eventKey={1} title="Pizze Oryginalne">
            {loading ? (
              <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
            ) : (
              <div className="mb-3">
                <Table style={{ width: tableWidth }} responsive striped bordered hover variant="dark" size="lg">
                  <thead>
                    <tr>
                      {Rola !== 'admin' && (
                        <th className="col-1">Ulubione</th>
                      )}
                      <th scope="col">
                        #
                      </th>
                      <th scope="col">
                        Nazwa
                      </th>
                      <th scope="col">
                        Składniki
                      </th>
                      <th scope="col">
                        Cena (Mała/Średnia/Duża/Gigant)
                      </th>
                      <th scope="col">
                        Ocena
                      </th>
                      {Rola == 'admin' && (
                        <th className="col-2">Opcje</th>
                      )}
                      {Rola == 'user' && (
                        <th>Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="m-1">
                    {currentPizzas.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        {(Rola === 'user' && (
                          <td className="rate col-1">
                            <input
                              type="checkbox"
                              id={`star${pizza.ID_Pizzy}`}
                              name={`rate${pizza.ID_Pizzy}`}
                              value="1"
                              checked={ulubione.some(item => item.ID_Pizzy === pizza.ID_Pizzy)}
                              onClick={() => handleCheckboxChange(pizza.ID_Pizzy)}
                            />
                            <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                          </td>
                        )) || (
                            (!Rola && (
                              <td className="rate col-1">
                                <input
                                  type="checkbox"
                                  id={`star${pizza.ID_Pizzy}`}
                                  name={`rate${pizza.ID_Pizzy}`}
                                  value="1"
                                  disabled
                                />
                                <label htmlFor={`star${pizza.ID_Pizzy}`} title="musisz być zalogowany aby dodać pizze do ulubionych!">stars</label>
                              </td>
                            ))
                          )}
                        <td>{pizza.ID_Pizzy}</td>
                        <td>{pizza.Nazwa}</td>
                        <td>{pizza.Skladniki}</td>
                        <td>{pizza.Cena} zł</td>
                        <td>
  <div className="button-container">
    <button
      className={`btn like-btn`}
      id="green"
      onClick={() => handleLikeClick(pizza.ID_Pizzy)}
    > 
        <i className={`fa fa-thumbs-up fa-lg ${likeButtonStates[pizza.ID_Pizzy] ? 'green' : 'none'} ${(userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak')) ? 'green' : 'none'}`} aria-hidden="true"></i>
      <span>
        {userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Tak') ? (
          userLikes.filter(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Tak').length
        ) : (
          0
        )}
      </span>
    </button>
    <button
      className={`btn dislike-btn`}
      id="red"
      onClick={() => handleDislikeClick(pizza.ID_Pizzy)}
    >
      <i className={`fa fa-thumbs-down fa-lg ${disLikeButtonStates[pizza.ID_Pizzy] ? 'red' : ''} ${userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie') ? 'red' : ''}`} aria-hidden="true"></i>
      <span>
        {userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Nie') ? (
          userLikes.filter(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Nie').length
        ) : (
          0
        )}
      </span>
    </button>
  </div>
</td>
                        {Rola == 'admin' && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleEdit(pizza)}>
                              Edytuj
                            </button>
                            <button className="btn btn-warning" onClick={() => handleDelete(pizza)}>
                              Usuń
                            </button>
                          </td>
                        )}
                        {Rola == "user" && (
                          <td className="col-1">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {Rola == 'admin' && (
                  <button className="btn btn-primary mb-3 blueButton" onClick={() => handleAdd("Oryginal")}>
                    Dodaj pizze Oryginalną
                  </button>
                )}
              </div>
            )}
            <ReactPaginate
              pageCount={Math.ceil(pizze.length / pizzasPerPage)}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
            />
          </Tab>
          <Tab eventKey={2} title="Pizze Customowe">
            {loading ? (
              <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
            ) : (
              <div className="table-responsive mb-3">
                <table className="table text-white">
                  <thead>
                    <tr>
                      {Rola !== 'admin' && (
                        <th className="col-1">Ulubiona</th>
                      )}
                      <th className="col-1" scope="col">
                        #
                      </th>
                      <th className="col-2" scope="col">
                        Nazwa
                      </th>
                      <th className="col-4" scope="col">
                        Składniki
                      </th>
                      <th className="col-3" scope="col">
                        Cena (M/Ś/D/G)
                      </th>
                      {Rola == "admin" && (
                        <th className="col-2">Opcje</th>
                      )}
                      {Rola == 'user' && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPizzasC.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        {(Rola === 'user' && (
                          <td className="rate col-1">
                            <input
                              type="checkbox"
                              id={`star${pizza.ID_Pizzy}`}
                              name={`rate${pizza.ID_Pizzy}`}
                              value="1"
                              checked={ulubione.some(item => item.ID_Pizzy === pizza.ID_Pizzy)}
                              onClick={() => handleCheckboxChange(pizza.ID_Pizzy)}
                            />
                            <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                          </td>
                        )) || (
                            (!Rola && (
                              <td className="rate col-1">
                                <input
                                  type="checkbox"
                                  id={`star${pizza.ID_Pizzy}`}
                                  name={`rate${pizza.ID_Pizzy}`}
                                  value="1"
                                  disabled
                                />
                                <label htmlFor={`star${pizza.ID_Pizzy}`} title="musisz być zalogowany aby dodać pizze do ulubionych!">stars</label>
                              </td>
                            ))
                          )}
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        {Rola == "admin" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleEdit(pizza)}>
                              Edytuj
                            </button>
                            <button className="btn btn-warning" onClick={() => handleDelete(pizza)}>
                              Usuń
                            </button>
                          </td>
                        )}
                        {Rola == "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Rola == 'user' && (
                  <button className="btn btn-primary mb-3 blueButton" onClick={() => handleAdd("Custom")}>
                    Dodaj pizze Customową
                  </button>
                )}
              </div>
            )}
            <ReactPaginate
              pageCount={Math.ceil(pizzeC.length / pizzasPerPage)}
              onPageChange={handlePageChangeM}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
            />
          </Tab>
          {Rola === "user" ? (
            <Tab eventKey={3} title="Moje Pizze">
              <div className="table-responsive mb-3">
                <table className="table text-white">
                  <thead>
                    <tr>
                      <th className="col-1">Ulubiona</th>
                      <th className="col-1" scope="col">
                        #
                      </th>
                      <th className="col-2" scope="col">
                        Nazwa
                      </th>
                      <th className="col-4" scope="col">
                        Składniki
                      </th>
                      <th className="col-3" scope="col">
                        Cena (M/Ś/D/G)
                      </th>
                      {Rola == 'user' && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPizzasM.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        <td className="rate col-1">
                          <input
                            type="checkbox"
                            id={`star${pizza.ID_Pizzy}`}
                            name={`rate${pizza.ID_Pizzy}`}
                            value="1"
                            checked={ulubione.some(item => item.ID_Pizzy === pizza.ID_Pizzy)}
                            onClick={() => handleCheckboxChange(pizza.ID_Pizzy)}
                          />
                          <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                        </td>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        {Rola == "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Rola == 'user' && (
                  <button className="btn btn-primary mb-3 blueButton" onClick={() => handleAdd("Custom")}>
                    Dodaj pizze Customową
                  </button>
                )}
              </div>
              <ReactPaginate
                pageCount={Math.ceil(pizzeM.length / pizzasPerPage)}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
              />
            </Tab>

          ) : Rola === "admin" ? (
            <Tab eventKey={3} title="Pizze do zatwierdzenia">
              <div className="table-responsive mb-3">
                <table className="table text-white">
                  <thead>
                    <tr>
                      <th className="col-1" scope="col">
                        #
                      </th>
                      <th className="col-2" scope="col">
                        Nazwa
                      </th>
                      <th className="col-4" scope="col">
                        Składniki
                      </th>
                      <th className="col-3" scope="col">
                        Cena (M/Ś/D/G)
                      </th>
                      {Rola == "admin" && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pizzeZ.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        {Rola == "admin" && (
                          <td className="col-2">
                            <button className="btn btn-success m-1" onClick={() => handleAccept(pizza)}>
                              Zatwierdź
                            </button>
                            <button className="btn btn-danger" onClick={() => handleReject(pizza)}>
                              Odrzuć
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
          ) : null}
          {Rola === "user" ? (
            <Tab eventKey={4} title="Pizze oczekujące na dodanie">
              <div className="table-responsive mb-3">
                <table className="table text-white">
                  <thead>
                    <tr>
                      <th className="col-1" scope="col">
                        #
                      </th>
                      <th className="col-2" scope="col">
                        Nazwa
                      </th>
                      <th className="col-4" scope="col">
                        Składniki
                      </th>
                      <th className="col-3" scope="col">
                        Cena (M/Ś/D/G)
                      </th>
                      <th className="col-3" scope="col">
                        Stan
                      </th>
                      {Rola == 'user' && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pizzeO.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        <td className="col-3">{pizza.Status} </td>
                        {Rola === "user" && (
                          <td className="col-2">
                            {pizza.Status === "Oczekuje" ? (
                              <button className="btn btn-danger m-1" onClick={() => handleCancel(pizza)}>
                                Anuluj
                              </button>
                            ) : pizza.Status === "Odrzucono" ? (
                              <button className="btn btn-warning m-1" onClick={() => handleChange(pizza)}>
                                Zmień
                              </button>
                            ) : null}
                            <OverlayTrigger
                              trigger={['hover', 'focus']}
                              placement="right"
                              overlay={<Tooltip id="overlay-tooltip">{pizza.komentarz_admina}</Tooltip>}
                            >
                              <img
                                className=""
                                src="Komentarz.png"
                                alt="Komentarz"
                                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                              />
                            </OverlayTrigger>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>

          ) : null}
          {Rola === "user" ? (
            <Tab eventKey={5} title="Moje ulubione pizze">
              <div className="table-responsive mb-3">
                <table className="table text-white">
                  <thead>
                    <tr>
                      <th className="col-1">Ulubiona</th>
                      <th className="col-1" scope="col">
                        #
                      </th>
                      <th className="col-2" scope="col">
                        Nazwa
                      </th>
                      <th className="col-4" scope="col">
                        Składniki
                      </th>
                      <th className="col-3" scope="col">
                        Cena (M/Ś/D/G)
                      </th>
                      {Rola == 'user' && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPizzasU.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        <td className="rate col-1">
                          <input
                            type="checkbox"
                            id={`star${pizza.ID_Pizzy}`}
                            name={`rate${pizza.ID_Pizzy}`}
                            value="1"
                            checked={ulubione.some(item => item.ID_Pizzy === pizza.ID_Pizzy)}
                            onClick={() => handleCheckboxChange(pizza.ID_Pizzy)}
                          />
                          <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                        </td>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        {Rola == "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                pageCount={Math.ceil(pizzeU.length / pizzasPerPage)}
                onPageChange={handlePageChangeU}
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
              />
            </Tab>

          ) : null}


        </Tabs>
      </div>
      <div className="d-flex justify-content-center col-12 col-md-3">
      <div className="col-11 col-md-11 border" style={{ responsive: "true", marginTop: "40px", height: "454px", marginLeft: "0px", background: '#222', padding: '20px' }}>
        <Form>
          <fieldset>
            <legend className="mt-2" style={{ fontWeight: "bold", fontSize: "18px" }}>Wybierz Opcje Filtrowania</legend>
            <div className="ms-4 mt-5 mb-4 d-flex" style={{ color: "white", fontWeight: "bold" }}>Opcje:</div>
            <div className="d-flex flex-column">
              <div
                className="d-flex text-left me-2"
                onMouseEnter={() => setUlubioneTooltipVisible(true)}
                onMouseLeave={() => setUlubioneTooltipVisible(false)}
              >
                <div className="ms-3 d-flex" id="ulubione">
                  <Form.Check
                    type="switch"
                    label={`Moje ulubione składniki`}
                    onChange={(event) => setUlubioneChecked(event.target.checked)}
                    checked={ulubioneChecked}
                  />
                </div>
              </div>
              <Overlay target={document.getElementById("ulubione")} show={ulubioneTooltipVisible} placement="right">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                  <div
                    {...props}
                    style={{
                      backgroundColor: 'rgba(100, 100, 255, 1)',
                      marginLeft: '10px',
                      padding: '5px 10px',
                      color: 'white',
                      borderRadius: 10,
                      ...props.style,
                    }}
                    onMouseEnter={() => setUlubioneTooltipVisible(true)}
                    onMouseLeave={() => setUlubioneTooltipVisible(false)}
                  >
                    {ulubioneSkladniki.map((skladnik, index) => (
                      <div key={index}>{skladnik}</div>
                    ))}
                  </div>
                )}
              </Overlay>
              <div
                className="d-flex text-left"
                onMouseEnter={() => setNieUlubioneTooltipVisible(true)}
                onMouseLeave={() => setNieUlubioneTooltipVisible(false)}
              >
                <div className="ms-3 d-flex" id="nieulubione">
                  <Form.Check
                    type="switch"
                    label={`Moje znienawidzone składniki`}
                    onChange={(event) => setNieUlubioneChecked(event.target.checked)}
                    checked={nieUlubioneChecked}
                  />
                </div>
              </div>
              <Overlay target={document.getElementById("nieulubione")} show={nieUlubioneTooltipVisible} placement="right">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                  <div
                    {...props}
                    style={{
                      backgroundColor: 'rgba(255, 100, 100, 1)',
                      marginLeft: '10px',
                      padding: '5px 10px',
                      color: 'white',
                      borderRadius: 10,
                      ...props.style,
                    }}
                    onMouseEnter={() => setNieUlubioneTooltipVisible(true)}
                    onMouseLeave={() => setNieUlubioneTooltipVisible(false)}
                  >
                    {nieUlubioneSkladniki.map((skladnik, index) => (
                      <div key={index}>{skladnik}</div>
                    ))}
                  </div>
                )}
              </Overlay>
              <div className="ms-3 mt-3 d-flex flex-wrap">
                <label style={{ fontWeight: "bold" }}>Nazwa:</label>
                <Form.Control
                  className="col-6"
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tu wpisz id/nazwę/składniki/cene w dowolnej kolejności"
                  style={{ padding: "5px", marginRight: "25px", marginTop: "5px", background: "white", color: "black" }}
                />
              </div>
              <div className="ms-3 mt-3 d-flex flex-wrap">
                <label style={{ fontWeight: "bold" }}>Sortuj według:</label>
                <Form.Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "5px", marginRight: "25px", marginTop: "5px", background: "#555", color: "white" }}
                >
                  <option value="">-- Wybierz --</option>
                  <option value="IDAsc">ID rosnąco</option>
                  <option value="IDDesc">ID malejąco</option>
                  <option value="priceAsc">Cena rosnąco</option>
                  <option value="priceDesc">Cena malejąco</option>
                  <option value="nameAsc">Nazwa A-Z</option>
                  <option value="nameDesc">Nazwa Z-A</option>
                </Form.Select>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
      </div>
      <ToastAddPizza title="Dodano pizze do koszyka!" describe={`Dodano pizzę o nazwie: ${pizzaName} do twojego koszyka.`} background="success" time="5000" show={showToast} hide={handleToastClose} />
    </div>




  );
}

export default Bookmarks;



