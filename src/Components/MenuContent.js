import React, { useEffect, useState } from "react";
import Axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from 'react-paginate';
import { Toast } from 'react-bootstrap';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

function Bookmarks({props, updateItemsCount, actions}) {

  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [pizzaName, setPizzaName] = useState('');

  //ELEMENTY Z API
  const [pizze, setPizze] = useState([]);
  const [pizzeC, setPizzeC] = useState([]);
  const [pizzeM, setPizzeM] = useState([]);
  const [pizzeZ, setPizzeZ] = useState([]);
  const [pizzeO, setPizzeO] = useState([]);
  const [skladniki, setSkladniki] = useState([]);

  //SESJA
  const [Rola, setRola] = useState("");
  const [ID, setID] = useState("");

  //PAGINACJA
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageC, setCurrentPageC] = useState(1);
  const [pizzasPerPage, setPizzasPerPage] = useState(9);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  const handlePageChangeC = ({ selected }) => {
    setCurrentPageC(selected + 1);
  };

  const indexOfLastPizza = currentPage * pizzasPerPage;
  const indexOfLastPizzaC = currentPageC * pizzasPerPage;
  const indexOfFirstPizza = indexOfLastPizza - pizzasPerPage;
  const indexOfFirstPizzaC = indexOfLastPizzaC - pizzasPerPage;

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

  // funkcja, która przefiltrowuje pizze i zwróci tylko te, które zawierają ulubione lub nieulubione składniki użytkownika
  const filterPizze = () => {
    let filteredPizze = pizze;
    if (ulubioneChecked && nieUlubioneChecked) {
      filteredPizze = pizze.filter(pizza => containsUlubioneSkladniki(pizza) && !containsNieUlubioneSkladniki(pizza));
    } else if (ulubioneChecked) {
      filteredPizze = pizze.filter(pizza => containsUlubioneSkladniki(pizza));
    } else if (nieUlubioneChecked) {
      filteredPizze = pizze.filter(pizza => !containsNieUlubioneSkladniki(pizza));
    }

    if (searchTerm) {
      filteredPizze = filteredPizze.filter(pizza => pizza.Nazwa.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sortuj pizzę po cenie - od najwyższej do najniższej
    if (sortBy === 'priceDesc') {
      filteredPizze.sort((a, b) => {
        const aPriceSmall = a.Cena.split('/')[0].trim(); // pobierz cenę małej pizzy dla a
        const bPriceSmall = b.Cena.split('/')[0].trim(); // pobierz cenę małej pizzy dla b
        return bPriceSmall - aPriceSmall; // porównaj tylko ceny małych pizz
      });
    }
    // Sortuj pizzę po cenie - od najniższej do najwyższej
    else if (sortBy === 'priceAsc') {
      filteredPizze.sort((a, b) => {
        const aPriceSmall = a.Cena.split('/')[0].trim(); // pobierz cenę małej pizzy dla a
        const bPriceSmall = b.Cena.split('/')[0].trim(); // pobierz cenę małej pizzy dla b
        return aPriceSmall - bPriceSmall; // porównaj tylko ceny małych pizz
      });
    }
    else if (sortBy === 'nameAsc') {
      filteredPizze.sort((a, b) => a.Nazwa.localeCompare(b.Nazwa));
    }
    else if (sortBy === 'nameDesc') {
      filteredPizze.sort((a, b) => b.Nazwa.localeCompare(a.Nazwa));
    }
    else if (sortBy == "IDAsc") {
      filteredPizze.sort((a, b) => a.ID_Pizzy - b.ID_Pizzy)
    }
    else if (sortBy == "IDDesc") {
      filteredPizze.sort((a, b) => b.ID_Pizzy - a.ID_Pizzy)
    }

    return filteredPizze;
  };

  // funkcja, która przefiltrowuje pizze customowe i zwróci tylko te, które zawierają ulubione lub nieulubione składniki użytkownika
  const filterPizzeC = () => {
    let filteredPizzeC = pizzeC;
    if (ulubioneChecked && nieUlubioneChecked) {
      filteredPizzeC = pizzeC.filter(pizza => containsUlubioneSkladniki(pizza) && !containsNieUlubioneSkladniki(pizza));
    } else if (ulubioneChecked) {
      filteredPizzeC = pizzeC.filter(pizza => containsUlubioneSkladniki(pizza));
    } else if (nieUlubioneChecked) {
      filteredPizzeC = pizzeC.filter(pizza => !containsNieUlubioneSkladniki(pizza));
    }

    if (searchTerm) {
      filteredPizzeC = filteredPizzeC.filter(pizza => pizza.Nazwa.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sortuj pizzę po cenie - od najwyższej do najniższej
    if (sortBy === 'priceDesc') {
      filteredPizzeC.sort((a, b) => b.price - a.price);
    }
    // Sortuj pizzę po cenie - od najniższej do najwyższej
    else if (sortBy === 'priceAsc') {
      filteredPizzeC.sort((a, b) => a.price - b.price);
    }
    else if (sortBy === 'nameAsc') {
      filteredPizzeC.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sortBy === 'nameDesc') {
      filteredPizzeC.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if (sortBy == "IDAsc") {
      filteredPizzeC.sort((a, b) => a.ID_Pizzy - b.ID_Pizzy)
    }
    else if (sortBy == "IDDesc") {
      filteredPizzeC.sort((a, b) => b.ID_Pizzy - a.ID_Pizzy)
    }

    return filteredPizzeC;
  };


  //PIZZE PRZEFILTROWANE Z PAGINACJĄ
  const filteredPizze = filterPizze();
  const filteredPizzeC = filterPizzeC();
  const currentPizzas = filteredPizze.slice(indexOfFirstPizza, indexOfLastPizza);
  const currentPizzasC = filteredPizzeC.slice(indexOfFirstPizzaC, indexOfLastPizza);

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
    Axios.get(`/pizzeM/${ID}`)
      .then(response => setPizzeM(response.data))
      .catch(error => console.error(error));
    console.log(pizzeM)
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
    Axios.get(`/pizzeO/${ID}`)
      .then(response => setPizzeO(response.data))
      .catch(error => console.error(error));
    console.log(pizzeO)
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
    console.log(`Edytuję pizzę o ID ${pizza.ID_Pizzy}`);
    actions.editModal();
    actions.idPizzy(pizza.ID_Pizzy);
    actions.custom(pizza.Custom);
  };

  //OPERACJE usuwanie
  const handleDelete = (pizza) => {
    const shouldDelete = window.confirm(`Czy na pewno chcesz usunąć pizzę o ID ${pizza.ID_Pizzy}?`);
    
    if (shouldDelete) {
      // Kod do usunięcia pizzy o ID pizza.ID_Pizzy
      console.log(`Usuwam pizzę o ID ${pizza.ID_Pizzy}`);
    } else {
      // Obsługa anulowania usunięcia
      console.log('Anulowano usunięcie pizzy.');
    }
  };

  //OPERACJA akceptacja stanu pizzy
  const handleAccept = (pizza) => {
    console.log(`Akceptuje pizzę o ID ${pizza.ID_Pizzy}`);
  };

  //OPERACJA odrzucenie stanu pizzy
  const handleReject = (pizza) => {
    console.log(`Odrzucam pizzę o ID ${pizza.ID_Pizzy}`);
  };

  //OPERACJA Anulowania stanu pizzy
  const handleCancel = (pizza) => {
    console.log(`Anuluję pizzę o ID ${pizza.ID_Pizzy}`);
  };

  //OPERACJA Zmiana odrzuconej pizzy
  const handleChange = (pizza) => {
    console.log(`Zmieniam pizzę o ID ${pizza.ID_Pizzy}`);
  };
  
  //DODAWANIE PIZZY DO KOSZYKA
  const handleOrder = (pizza) => {
    Axios.post('/DodajDoKoszyka', {
      ID: ID,
      ID_Pizzy: pizza.ID_Pizzy,
    }).then((response) => {
      setPizzaName(pizza.Nazwa);
      setShowToast(true);
      console.log(response)
      updateItemsCount();
    })
  };

  const handleToastClose = () => setShowToast(false);

  //OPERACJE dodawanie
  const handleAdd = (type) => {
    if (type == "Oryginal") {
      actions.showModal();
      console.log(`Dodaję oryginalną pizzę o Nowym ID`);
    }
    if (type == "Custom") {
      actions.customShowModal();
      console.log(`Dodaję customową pizzę o Nowym ID`);
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

  return (
    <div className="d-flex flex-wrap">
      <div class="col-12 col-md-8 ">
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Pizze Oryginalne">
          {loading ? (
        <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
      ) : (
            <div className="table-responsive mb-3">
              <table className="table text-white border">
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
                    {Rola == 'admin' && (
                      <th className="col-2">Opcje</th>
                    )}
                    {Rola == 'user' && (
                      <th className="col-2">Opcje</th>
                    )}
                  </tr>
                </thead>
                <tbody className="m-1">
                  {currentPizzas.map(pizza => (
                    <tr key={pizza.ID_Pizzy}>
                      <td className="col-1">{pizza.ID_Pizzy}</td>
                      <td className="col-2">{pizza.Nazwa}</td>
                      <td className="col-4">{pizza.Skladniki}</td>
                      <td className="col-3">{pizza.Cena} zł</td>
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
              {Rola == 'admin' && (
                <button className="btn btn-primary mb-3" onClick={() => handleAdd("Oryginal")}>
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
        <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
      ) : (
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
                    {Rola == 'user' && (
                      <th className="col-2">Opcje</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentPizzasC.map(pizza => (
                    <tr key={pizza.ID_Pizzy}>
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
                <button className="btn btn-primary mb-3" onClick={() => handleAdd("Custom")}>
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
                      {Rola == 'user' && (
                        <th className="col-2">Opcje</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pizzeM.map(pizza => (
                      <tr key={pizza.ID_Pizzy}>
                        <td className="col-1">{pizza.ID_Pizzy}</td>
                        <td className="col-2">{pizza.Nazwa}</td>
                        <td className="col-4">{pizza.Skladniki}</td>
                        <td className="col-3">{pizza.Cena} zł</td>
                        {Rola == "user" && (
                          <td className="col-2">
                            <button className="btn btn-danger m-1" onClick={() => handleOrder(pizza)}>
                              Zamów <img className="col-4 col-md-2" src="Koszyk.png"></img>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Rola == 'user' && (
                  <button className="btn btn-primary mb-3" onClick={() => handleAdd("Custom")}>
                    Dodaj pizze Customową
                  </button>
                )}
              </div>
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
            <Tab eventKey={4} title="Moje oczekujące pizze">
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
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>

          ) : null}
          
        </Tabs>
      </div>
      <div className="col-12 col-md-3 border" style={{ responsive: "true", marginTop: "40px", height: "454px", marginLeft: "0px" }}>
        <fieldset>
          <legend className="mt-2">Wybierz Opcje Filtrowania</legend>
          <div className="ms-4 mt-5 mb-4 d-flex">Opcje:</div>
          <div className="d-flex flex-column">
            <div className="d-flex ms-4 text-left">
              <div className="ms-1"><input type="checkbox" id="ulubione" name="ulubione" onChange={(event) => setUlubioneChecked(event.target.checked)} /> <label htmlFor="ulubione">Moje ulubione składniki (
                {skladniki
                  .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Tak")
                  .map(skladnik => skladnik.Nazwa)
                  .join(", ")
                }
                )</label></div>
            </div>
            <div className="d-flex ms-4 text-left">
              <div className="ms-1"><input type="checkbox" id="nieulubione" name="nieulubione" onChange={(event) => setNieUlubioneChecked(event.target.checked)} /> <label htmlFor="nieulubione">Moje znienawidzone składniki (
                {skladniki
                  .filter(skladnik => skladnik.ID_Uzytkownika === ID && skladnik.Ulubiony === "Nie")
                  .map(skladnik => skladnik.Nazwa)
                  .join(", ")
                }
                )</label></div>
            </div>
            <div className="mt-3 d-flex">
              <label className="ms-3">Nazwa:</label><input className="col-6" type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="ms-3 mt-3 d-flex">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="">Sortuj według:</option>
                <option value="IDAsc">ID rosnąco</option>
                <option value="IDDesc">ID malejąco</option>
                <option value="priceAsc">Cena rosnąco</option>
                <option value="priceDesc">Cena malejąco</option>
                <option value="nameAsc">Nazwa A-Z</option>
                <option value="nameDesc">Nazwa Z-A</option>
              </select>
            </div>
          </div>
        </fieldset>
      </div>
      <ToastContainer className="position-static">
      <Toast
        show={showToast}
        onClose={handleToastClose}
        delay={5000} // Duration for which the toast will be visible (in milliseconds)
        autohide
        bg="success"
        style={{
          position: 'fixed',
          top: 'calc(70px)', // Adjust the position as needed
          left: '10px', // Adjust the left position as needed
          zIndex: 9, // Ensures the toast appears above other content
        }}
      >
        <Toast.Header closeVariant="dark" className="d-flex justify-content-between"> {/* Use the bg prop to set the primary color */}
        <img
            src="PizzaIcon.png"
            className="rounded me-2"
            alt=""
            style={{ width: '25px', height: '25px' }} // Set the width and height to 10px
          />
          <strong className="mr-auto">Dodano pizze do koszyka!</strong>
        </Toast.Header>
        <Toast.Body>{`Dodano pizzę o nazwie: ${pizzaName} do twojego koszyka.`}</Toast.Body>
      </Toast>
    </ToastContainer>
    </div>

  );
}

export default Bookmarks;



