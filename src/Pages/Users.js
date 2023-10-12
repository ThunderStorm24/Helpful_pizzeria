import React, { useState, useEffect, useContext } from 'react'; 
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import { Navigate, useNavigate } from "react-router-dom";
import ConfirmCancelModal from "../Components/WindowModal/ConfirmCancelModal.js"
import EditModal from "../Components/WindowModal/EditUserModal.js"
import AddUser from "../Components/WindowModal/AddUser.js"
import { Container, Form, Button, Alert, Table, Spinner, Row, Col } from 'react-bootstrap';
import { SessionContext } from '../SessionContext/Session.js';

function Users() {

    const navigate = useNavigate();

    const [cancelModal, setCancelModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [added, setAdded] = useState(false);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState(''); 
    const [searchUser, setSearchUser] = useState('');
    const [sortByUser, setSortByUser] = useState('');
    
    const userSession = useContext(SessionContext).userSession;

    console.log(userSession?.ID_Uzytkownika);

    const handleSortByChange = (e) => {
      setSortBy(e.target.value);
    };

    const handleSortByChangeUser = (e) => {
      setSortByUser(e.target.value);
    };

    const [role,setRole] = useState('');

    const [admins, setAdmins] = useState([]);

    const [users, setUsers] = useState([]);
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const [loading, setLoading] = useState(true);
    
    const handleCloseModal = () => {
            setCancelModal(false);
            setEditModal(false);
            setAddModal(false);
    };

      //wyświetlanie użytkowników o roli ADMIN
      useEffect(() => {
        Axios.get(`/Admins`)
        .then(response => {
          setAdmins(response.data);
        })
          .catch(error => console.error(error));
      }, []);
    
      //wyświetlanie użytkowników o roli USER
      useEffect(() => {
        Axios.get(`/Users`)
        .then(response => {
          setUsers(response.data);
          setLoading(false);
        })
          .catch(error => console.error(error));
      }, []);



      function filterAndSort(data, searchValue, sortByValue) {
        return data
          .filter(item => {
            const searchLowerCase = searchValue.toLowerCase();
            const itemValues = Object.values(item).map(value => (typeof value === 'string' ? value.toLowerCase() : ''));
            const searchStringParts = searchLowerCase.split(' ');
      
            return searchStringParts.every(searchPart => {
              return itemValues.some(itemValue => itemValue.includes(searchPart));
            });
          })
  .sort((a, b) => {
    if (sortByValue === 'IDAsc') {
      return a.ID_Uzytkownika - b.ID_Uzytkownika;
    } else if (sortByValue === 'IDDesc') {
      return b.ID_Uzytkownika - a.ID_Uzytkownika;
    } else if (sortByValue === 'nameAsc') {
      const nameA = (a.Imie || '').toLowerCase();
      const nameB = (b.Imie || '').toLowerCase();
      return nameA.localeCompare(nameB);
    } else if (sortByValue === 'nameDesc') {
      const nameA = (a.Imie || '').toLowerCase();
      const nameB = (b.Imie || '').toLowerCase();
      return nameB.localeCompare(nameA);
    } else if (sortByValue === 'surnameAsc') {
      const surnameA = (a.Nazwisko || '').toLowerCase();
      const surnameB = (b.Nazwisko || '').toLowerCase();
      return surnameA.localeCompare(surnameB);
    } else if (sortByValue === 'surnameDesc') {
      const surnameA = (a.Nazwisko || '').toLowerCase();
      const surnameB = (b.Nazwisko || '').toLowerCase();
      return surnameB.localeCompare(surnameA);
    }
    else if (sortByValue === 'addressAsc') {
      const getLastCity = (address) => {
        const parts = address.split(',');
        return parts[parts.length - 1].trim();
      };
      return getLastCity(a.Adres).localeCompare(getLastCity(b.Adres));
    } else if (sortByValue === 'addressDesc') {
      const getLastCity = (address) => {
        const parts = address.split(',');
        return parts[parts.length - 1].trim();
      };
      return getLastCity(b.Adres).localeCompare(getLastCity(a.Adres));
    } else if (sortByValue === 'loginAsc') {
      const loginA = (a.Login || '').toLowerCase();
      const loginB = (b.Login || '').toLowerCase();
      return loginA.localeCompare(loginB);
    } else if (sortByValue === 'loginDesc') {
      const loginA = (a.Login || '').toLowerCase();
      const loginB = (b.Login || '').toLowerCase();
      return loginB.localeCompare(loginA);
    }
    return 0; // Domyślne sortowanie
  });
}

  // Dla adminów
const filteredAdmins = filterAndSort(admins, search, sortBy);

// Dla użytkowników
const filteredUsers = filterAndSort(users, searchUser, sortByUser);

      //EDYTOWANIE użytkownika
      const handleChange = (user) => {
        setUserID(user.ID_Uzytkownika)
        setUserName(user.Imie);
        setUserSurname(user.Nazwisko);
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


      //USUWANIE użytkownika
      const handleDelete = (user) => {
        setUserID(user.ID_Uzytkownika)
        setUserName(user.Imie);
        setUserSurname(user.Nazwisko);
        setCancelModal(true);
      };

      const handleDeleteModal = () => {
        console.log(`Usuwam użytkownika o ID: ${userID}`)
        Axios.post('http://localhost:5000/UsunUzytkownika', {
            UserID: userID,
            NowLoggedInUserID: userSession?.ID_Uzytkownika,
        }).then((data) => {
          console.log(data)
          setMessage(data.data);
          setErrors([]);
          setCancelModal(false);
          window.location.reload();
        }).catch((error) => {
          console.log('error', error);
          setErrors(error.response.data.errors);
        })
      };
      
      //DODAWANIE użytkownika
      const handleAdd = (user) => {
        setRole(user)
        setAddModal(true);
      };

      const handleAddModal = async (user) => {
        console.log(`Dodaje użytkownika o roli: ${user.role} ${user.name} ${user.surname}`);
        Axios.post('http://localhost:5000/DodajUzytkownika', {
            Role: user.role,
            Name: user.name,
            Surname: user.surname,
            Adress: user.adress,
            Zipcode: user.zipcode,
            Phone: user.phone,
            Login: user.login,
            Password: user.password,
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

    return <div style={{ minHeight: "140vh" }}>
            <NavbarE />
            {loading ? (
            <div style={{ minHeight: "100vh"}}>
            <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
            </div>
          ) : (userSession?.Rola === "admin" ? ( 
            <div className="container mt-4">
                
                <div className="p-5 rounded-5"  style={{background: '#111111'}}>
            <h2 className="">Admins:</h2>
              <Row className="mb-3">
                <Col md={2} xs={12}>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="search">Znajdź:</Form.Label>
                    <Form.Control
                      type="search"
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Szukaj..."
                    />
                  </Form.Group>
                </Col>
                <Col md={2} xs={12}>
                  <Form.Group className="mt-3">
                    <Form.Label>Sortuj:</Form.Label>
                    <Form.Select value={sortBy} onChange={handleSortByChange}>
                      <option value="">Brak sortowania</option>
                      <option value="IDAsc">ID rosnąco</option>
                      <option value="IDDesc">ID malejąco</option>
                      <option value="nameAsc">Imie A-Z</option>
                      <option value="nameDesc">Imie Z-A</option>
                      <option value="surnameAsc">Nazwisko A-Z</option>
                      <option value="surnameDesc">Nazwisko Z-A</option>
                      <option value="addressAsc">Miasto A-Z</option>
                      <option value="addressDesc">Miasto Z-A</option>
                      <option value="loginAsc">Login A-Z</option>
                      <option value="loginDesc">Login Z-A</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
                <Table responsive striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imie</th>
                            <th>Nazwisko</th>
                            <th>Adres</th>
                            <th>Kod_Pocztowy</th>
                            <th>Telefon</th>
                            <th>Login</th>
                            <th>Operacje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map(admin => (
                            <tr key={admin.ID_Uzytkownika}>
                                <td>{admin.ID_Uzytkownika}</td>
                                <td>{admin.Imie}</td>
                                <td>{admin.Nazwisko}</td>
                                <td>{admin.Adres}</td>
                                <td>{admin.Kod_Pocztowy}</td>
                                <td>{admin.Telefon}</td>
                                <td>{admin.Login}</td>
                                <td>
                                {userSession?.ID_Uzytkownika === admin.ID_Uzytkownika ? (
                                    <>
                                        <Button className="me-2" variant="danger" disabled>Usuń</Button>
                                        <Button onClick={() => handleChange(admin)} variant="warning">Edytuj</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => handleDelete(admin)} className="me-2" variant="danger">Usuń</Button>
                                        <Button onClick={() => handleChange(admin)} variant="warning">Edytuj</Button>
                                    </>
                                )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={() => handleAdd("admin")} className="mb-1 mt-2" variant="primary">Dodaj admina</Button>
                </div>

                <div className="p-5 rounded-5 mt-4" style={{background: '#111111'}}>
                <h2>Users:</h2>
                <Row className="mb-3">
                <Col md={2} xs={12}>
                  <Form.Group className="mt-3">
                    <Form.Label htmlFor="searchUser">Znajdź:</Form.Label>
                    <Form.Control
                      type="search"
                      id="searchUser"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Szukaj..."
                    />
                  </Form.Group>
                </Col>
                <Col md={2} xs={12}>
                  <Form.Group className="mt-3">
                    <Form.Label>Sortuj:</Form.Label>
                    <Form.Select value={sortByUser} onChange={handleSortByChangeUser}>
                      <option value="">Brak sortowania</option>
                      <option value="IDAsc">ID rosnąco</option>
                      <option value="IDDesc">ID malejąco</option>
                      <option value="nameAsc">Imie A-Z</option>
                      <option value="nameDesc">Imie Z-A</option>
                      <option value="surnameAsc">Nazwisko A-Z</option>
                      <option value="surnameDesc">Nazwisko Z-A</option>
                      <option value="addressAsc">Miasto A-Z</option>
                      <option value="addressDesc">Miasto Z-A</option>
                      <option value="loginAsc">Login A-Z</option>
                      <option value="loginDesc">Login Z-A</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
                <Table responsive striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imie</th>
                            <th>Nazwisko</th>
                            <th>Adres</th>
                            <th>Kod_Pocztowy</th>
                            <th>Telefon</th>
                            <th>Login</th>
                            <th>Operacje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.ID_Uzytkownika}>
                                <td>{user.ID_Uzytkownika}</td>
                                <td>{user.Imie}</td>
                                <td>{user.Nazwisko}</td>
                                <td>{user.Adres}</td>
                                <td>{user.Kod_Pocztowy}</td>
                                <td>{user.Telefon}</td>
                                <td>{user.Login}</td>
                                <td>
                                    <Button onClick={() => handleDelete(user)} className="me-2" variant="danger">Usuń</Button>
                                    <Button onClick={() => handleChange(user)} variant="warning">Edytuj</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={() => handleAdd("user")} className="mb-1 mt-2" variant="primary">Dodaj użytkownika</Button>
                </div>
            </div>
          ):(<div>Nieuprawniony dostęp</div>))}

        <ConfirmCancelModal
        show={cancelModal}
        onHide={handleCloseModal}
        operation={handleDeleteModal}
        buttonDanger={"Nie"}
        buttonSuccess={"Tak"}
        description = {`Czy na pewno chcesz usunąć użytkownika ${userName} ${userSurname} [${userID}]`}
        title={`Usuwanie użytkownika ${userName} [${userID}]`}
        disable={true}
        message={message}
        errors={errors}
      />
        <EditModal 
        show={editModal}
        onHide={handleCloseModal}
        onSubmit={handleEditModal}
        title={`Edytowanie użytkownika: ${userName} ${userSurname} [${userID}]`}
        userID={userID}
        button={`Edytuj`}
        Added={added}
        message={message}
        errors={errors}
        />
        <AddUser 
        show={addModal}
        onHide={handleCloseModal}
        onSubmit={handleAddModal}
        title={`Dodawanie nowego ${role}a`}
        userID={userID}
        button={`Dodaj ${role}a`}
        Added={added}
        Role={role}
        message={message}
        errors={errors}
        />

        </div>
}

export default Users;