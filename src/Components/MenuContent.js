import React, { useEffect, useState, useContext } from "react";
import Axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from 'react-paginate';
import Spinner from 'react-bootstrap/Spinner';
import ToastAddPizza from './smallComponents/ToastAddPizza'
import { Table, OverlayTrigger, Tooltip, Tabs, Tab } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import LikeDisLike from './menuComponents/LikeDisLike'; 
import PizzaFilter from './menuComponents/PizzaFilter'; 
import AlertLog from './smallComponents/Alert'; 
import { SessionContext } from '../SessionContext/Session.js';

function Bookmarks({ updateItemsCount, actions }) {

  const userSession = useContext(SessionContext).userSession;

  console.log(userSession?.ID_Uzytkownika);

  const [loading, setLoading] = useState(true);

  const ID = userSession?.ID_Uzytkownika;
  const Rola = userSession?.Rola;

  const [showAlert, setShowAlert] = useState(false);
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
  const [ulubione, setUlubione] = useState([])

  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [currentPageM, setCurrentPageM] = useState(1); // Dodane
  const [currentPageU, setCurrentPageU] = useState(1); // Dodane
  const pizzasPerPage = 10;

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
  useEffect(() => {
    const filteredPizzeU = filterPizze(pizzeU, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy);
    setCurrentPizzasU(filteredPizzeU.slice(indexOfFirstPizzaU, indexOfLastPizzaU));
  }, [indexOfFirstPizzaU, indexOfLastPizzaU, pizzeU, ulubioneChecked, nieUlubioneChecked, searchTerm, sortBy]);

  const currentPizzas = filteredPizze.slice(indexOfFirstPizza, indexOfLastPizza);
  const currentPizzasC = filteredPizzeC.slice(indexOfFirstPizzaC, indexOfLastPizza);
  const currentPizzasM = filteredPizzeM.slice(indexOfFirstPizzaM, indexOfLastPizzaM);
  const [currentPizzasU, setCurrentPizzasU]=useState([])

  //WYŚWIETLANIE ulubionych
  useEffect(() => {
      Axios.get(`/pizzeUlubione/${ID}`)
        .then(response => setUlubione(response.data))
        .catch(error => console.error(error));
  }, [ID]);

  const handleCheckboxChange = (pizza) => {
    const isChecked = ulubione.some(item => item.ID_Pizzy === pizza.ID_Pizzy);

    if (!isChecked) {
      // Usuń relację z bazy danych
      Axios.delete(`/usunRelacje/${ID}/${pizza.ID_Pizzy}`)
        .then(response => {
          // Po udanym usunięciu odśwież stan lub inne odpowiednie działania
          if (response.status === 200) {
            setUlubione(prevUlubione => [...prevUlubione, { ID_Pizzy: pizza.ID_Pizzy }]);
            setPizzeU(prevPizzeU => [...prevPizzeU, pizza]);
          }
        })
        .catch(error => console.error(error));
    } else {
      // Dodaj relację do bazy danych
      Axios.post(`/dodajRelacje/${ID}/${pizza.ID_Pizzy}`)
        .then(response => {
          // Po udanym dodaniu odśwież stan lub inne odpowiednie działania
          if (response.status === 200) {
            setUlubione(prevUlubione => prevUlubione.filter(item => item.ID_Pizzy !== pizza.ID_Pizzy));
            setPizzeU(prevPizzas => prevPizzas.filter(item => item.ID_Pizzy !== pizza.ID_Pizzy));
          }
        })
        .catch(error => console.error(error));
    }
  };

  //WYŚWIETLANIE pizzy oryginalnych
  useEffect(() => {
    fetch('/pizze')
      .then(response => response.json())
      .then(data => {
        setPizze(data);
        setLoading(false);
      })
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
      Axios.get(`/pizzeM/${ID}`)
        .then(response => setPizzeM(response.data))
        .catch(error => console.error(error));
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
    fetch(`/Ulubioneskladniki/${ID}`)
      .then(response => response.json())
      .then(data => setSkladniki(data))
      .catch(error => console.error(error));
  }, [ID]);

  console.log(skladniki);

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
    if (type === "Oryginal") {
      actions.showModal();
    }
    if (type === "Custom") {
      actions.customShowModal();
    }
  };

  const [tableWidth, setTableWidth] = useState('100%');

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 1500) {
        setTableWidth('1500px');
      } else {
        setTableWidth('100%');
      }
    }

    // DODANIE nasłuchiwania zmiany rozmiaru ekranu
    window.addEventListener('resize', handleResize);

    // WYWOŁANIE handleResize po pierwszym renderowaniu
    handleResize();

    // USUWANIE nasłuchiwanie po odmontowaniu komponentu
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const [userLikes, setUserLikes] = useState([]);

  // WCZYTANIE pizz z polubieniami na tak oraz polubienami na nie
  useEffect(() => {
    fetch('/pizzeLike')
      .then(response => response.json())
      .then(data => {
        setUserLikes(data);
      })
      .catch(error => console.error(error));
  }, []);

  // POLUBIENIA I NIEPOLUBIENIA wystawione przez użytkowników
  useEffect(() => {
    fetch('/Likes')
      .then(response => response.json())
      .then(data => setUserLikes(data))
      .catch(error => console.error(error));
  }, []);


  const [likeButtonStates, setLikeButtonStates] = useState({});

  //WYSTAWIENIE LIKE
  const handleLikeClick = (ID_Pizzy) => {
    console.log(ID_Pizzy)
    const existingLikeIndex = userLikes.findIndex(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak');
    const existingDislikeIndex = userLikes.findIndex(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie');

    if (existingLikeIndex !== -1) {
      // JEŚLI polubienie istnieje, to zostaje usuwane z userLikes
      const updatedLikes = [...userLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      setUserLikes(updatedLikes);
    } else {
      // JEŚLI polubienie nie istnieje, to zostaje dodawane do UserLikes
      const newLike = {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID,
        Polubienie: 'Tak'
      };
      setUserLikes([...userLikes, newLike]);
    }

    if (existingDislikeIndex !== -1) {
      // JEŚLI dislike istnieje, to zostaje usuwany z userLikes
      const updatedLikes = [...userLikes];
      updatedLikes.splice(existingDislikeIndex, 1);
      setUserLikes(updatedLikes);

      // DODAWANIE dislike
      const newLike = {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID,
        Polubienie: 'Tak'
      };
      setUserLikes([...updatedLikes, newLike]);
    }


    // JEŚLI polubienie nie istnieje,to zostaje dodane
    Axios.post('/UserLike', {
      ID_Pizzy: ID_Pizzy,
      ID_Uzytkownika: ID
    })
      .then(response => {

      })
      .catch(error => {
        console.error('Błąd podczas wykonywania żądania do /UserLike', error);
      });
  };

  const [disLikeButtonStates, setDisLikeButtonStates] = useState({});

  //WYSTAWIANIE dislike
  const handleDislikeClick = (ID_Pizzy) => {
    const existingLikeIndex = userLikes.findIndex(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak');
    const existingDislikeIndex = userLikes.findIndex(like => like.ID_Pizzy === ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie');

    if (existingDislikeIndex !== -1) {
      // JEŚLI dislike istnieje, to zostaje usuwany z userLikes
      const updatedLikes = [...userLikes];
      updatedLikes.splice(existingDislikeIndex, 1);
      setUserLikes(updatedLikes);
    } else {
      // JEŚLI dislike nie istnieje, to zostaje dodawany do UserLikes
      const newDislike = {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID,
        Polubienie: 'Nie'
      };
      setUserLikes([...userLikes, newDislike]);
    }

    if (existingLikeIndex !== -1) {
      // JEŚLI like istnieje, to zostaje usuwany z userLikes
      const updatedLikes = [...userLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      setUserLikes(updatedLikes);

      // DODAWANIE dislike
      const newDislike = {
        ID_Pizzy: ID_Pizzy,
        ID_Uzytkownika: ID,
        Polubienie: 'Nie'
      };
      setUserLikes([...updatedLikes, newDislike]);
    }

    // JEŚLI polubienie nie istnieje, to zostaje dodane
    Axios.post('/UserDisLike', {
      ID_Pizzy: ID_Pizzy,
      ID_Uzytkownika: ID
    })
      .then(response => {

      })
      .catch(error => {
        console.error('Błąd podczas wykonywania żądania do /UserLike', error);
      });
  }

  const showNotification = () => {
    setShowAlert(true);
  }

  return (
    <div className="d-flex flex-wrap mt-2" style={{ minHeight: "90vh" }}>
      <div className="ms-3 col-11 col-md-8 ">
        <Tabs fill defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Pizze Oryginalne">
            {loading ? (
              <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
            ) : (
              <div className="mb-3">
                <Table style={{ width: tableWidth }} responsive striped bordered hover size="lg">
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
                        Polubienia
                      </th>
                      {Rola === 'admin' && (
                        <th className="col-2">Opcje</th>
                      )}
                      {Rola === 'user' && (
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
                              onChange={() => handleCheckboxChange(pizza)}
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
                        <LikeDisLike
                          pizza={pizza}
                          ID={ID}
                          handleLikeClick={handleLikeClick}
                          likeButtonStates={likeButtonStates}
                          handleDislikeClick={handleDislikeClick}
                          disLikeButtonStates={disLikeButtonStates}
                          userLikes={userLikes}
                          Role={Rola}
                          showNotification={showNotification}
                        />
                        {Rola === 'admin' && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleEdit(pizza)}>
                              Edytuj
                            </button>
                            <button className="btn btn-warning" onClick={() => handleDelete(pizza)}>
                              Usuń
                            </button>
                          </td>
                        )}
                        {Rola === "user" && (
                          <td className="">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                            Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {Rola === 'admin' && (
                  <button className="btn btn-primary mb-3 blueButton mt-3" onClick={() => handleAdd("Oryginal")}>
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
                <Table style={{ width: tableWidth }} responsive striped bordered hover  size="lg">
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
                      <th scope="col">
                        Polubienia
                      </th>
                      {Rola === "admin" && (
                        <th className="col-2">Opcje</th>
                      )}
                      {Rola === 'user' && (
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
                              onChange={() => handleCheckboxChange(pizza)}
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
                        <td>
                          <LikeDisLike
                            pizza={pizza}
                            ID={ID}
                            handleLikeClick={handleLikeClick}
                            likeButtonStates={likeButtonStates}
                            handleDislikeClick={handleDislikeClick}
                            disLikeButtonStates={disLikeButtonStates}
                            userLikes={userLikes}
                            Role={Rola}
                            showNotification={showNotification}
                          />
                        </td>
                        {Rola === "admin" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleEdit(pizza)}>
                              Edytuj
                            </button>
                            <button className="btn btn-warning" onClick={() => handleDelete(pizza)}>
                              Usuń
                            </button>
                          </td>
                        )}
                        {Rola === "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {Rola === 'user' && (
                  <button className="btn btn-primary mb-3 blueButton mt-3" onClick={() => handleAdd("Custom")}>
                    Dodaj pizze Customową
                  </button>
                )}
              </div>
            )}
            <ReactPaginate
              pageCount={Math.ceil(pizzeC.length / pizzasPerPage)}
              onPageChange={handlePageChangeC}
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
              <Table style={{ width: tableWidth }} responsive striped bordered hover  size="lg">
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
                      <th scope="col">
                        Polubienia
                      </th>
                      {Rola === 'user' && (
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
                            onChange={() => handleCheckboxChange(pizza)}
                          />
                          <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                        </td>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        <td>
                          <LikeDisLike
                            pizza={pizza}
                            ID={ID}
                            handleLikeClick={handleLikeClick}
                            likeButtonStates={likeButtonStates}
                            handleDislikeClick={handleDislikeClick}
                            disLikeButtonStates={disLikeButtonStates}
                            userLikes={userLikes}
                            Role={Rola}
                            showNotification={showNotification}
                          />
                        </td>
                        {Rola === "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {Rola === 'user' && (
                  <button className="btn btn-primary mb-3 blueButton mt-3" onClick={() => handleAdd("Custom")}>
                    Dodaj pizze Customową
                  </button>
                )}
              </div>
              <ReactPaginate
                pageCount={Math.ceil(pizzeM.length / pizzasPerPage)}
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

          ) : Rola === "admin" ? (
            <Tab eventKey={3} title="Pizze do zatwierdzenia">
              <div className="table-responsive mb-3">
              <Table style={{ width: tableWidth }} responsive striped bordered hover  size="lg">
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
                      {Rola === "admin" && (
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
                        {Rola === "admin" && (
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
                </Table>
              </div>
            </Tab>
          ) : null}
          {Rola === "user" ? (
            <Tab eventKey={4} title="Pizze oczekujące na dodanie">
              <div className="table-responsive mb-3">
              <Table style={{ width: tableWidth }} responsive striped bordered hover  size="lg">
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
                      {Rola === 'user' && (
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
                </Table>
              </div>
            </Tab>

          ) : null}
          {Rola === "user" ? (
            <Tab eventKey={5} title="Moje ulubione pizze">
              <div className="table-responsive mb-3">
              <Table style={{ width: tableWidth }} responsive striped bordered hover  size="lg">
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
                      <th scope="col">
                        Polubienia
                      </th>
                      {Rola === 'user' && (
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
                            onChange={() => handleCheckboxChange(pizza)}
                          />
                          <label htmlFor={`star${pizza.ID_Pizzy}`} title="Dodaj do ulubionych!">stars</label>
                        </td>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        <td>
                          <LikeDisLike
                            pizza={pizza}
                            ID={ID}
                            handleLikeClick={handleLikeClick}
                            likeButtonStates={likeButtonStates}
                            handleDislikeClick={handleDislikeClick}
                            disLikeButtonStates={disLikeButtonStates}
                            userLikes={userLikes}
                            Role={Rola}
                            showNotification={showNotification}
                          />
                        </td>
                        {Rola === "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
      <PizzaFilter
        ulubioneChecked={ulubioneChecked}
        setUlubioneChecked={setUlubioneChecked}
        ulubioneTooltipVisible={ulubioneTooltipVisible}
        setUlubioneTooltipVisible={setUlubioneTooltipVisible}
        ulubioneSkladniki={ulubioneSkladniki}
        nieUlubioneChecked={nieUlubioneChecked}
        setNieUlubioneChecked={setNieUlubioneChecked}
        nieUlubioneTooltipVisible={nieUlubioneTooltipVisible}
        setNieUlubioneTooltipVisible={setNieUlubioneTooltipVisible}
        nieUlubioneSkladniki={nieUlubioneSkladniki}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ToastAddPizza title="Dodano pizze do koszyka!" describe={`Dodano pizzę o nazwie: ${pizzaName} do twojego koszyka.`} background="success" time="5000" show={showToast} hide={handleToastClose} />
      <AlertLog showAlert={showAlert} setShowAlert={setShowAlert} />
    </div>




  );
}

export default Bookmarks;



