import React, { useState, useEffect } from 'react'; 
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import ConfirmCancelModal from "../Components/WindowModal/ConfirmCancelModal.js"
import EditModal from "../Components/WindowModal/EditUserModal.js"
import AddUser from "../Components/WindowModal/AddUser.js"

function Users() {

    const navigate = useNavigate();

    const [cancelModal, setCancelModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [added, setAdded] = useState(false);

    const [role,setRole] = useState('');

    const [admins, setAdmins] = useState([]);

    const [users, setUsers] = useState([]);
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loginID, setLoginID] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    
    const handleCloseModal = () => {
            setCancelModal(false);
            setEditModal(false);
            setAddModal(false);
    };

    //Sesja czy Admin jest zalogowany, narazie jest i user i admin, a ma być tylko admin
    useEffect(() => {
        Axios.get("/login").then((response) => {
            if (response.data.loggedIn == true) {
                setLoginStatus(response.data.user[0].Login)
                setLoginID(response.data.user[0].ID_Uzytkownika)
                setLoading(false); // zmiana stanu loading na falsee
            } else {
                navigate("/");
            }
        })
    }, [])

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
        })
          .catch(error => console.error(error));
      }, []);

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
            NowLoggedInUserID: loginID,
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
            <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
            </div>
          ) : (
            <div className="container mt-4">
                
                <div className="p-5 rounded-5" style={{background: '#050505'}}>
            <h2 className="">Admins:</h2>
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
                        {admins.map(admin => (
                            <tr key={admin.ID_Uzytkownika}>
                                <td>{admin.ID_Uzytkownika}</td>
                                <td>{admin.Imie}</td>
                                <td>{admin.Nazwisko}</td>
                                <td>{admin.Adres}</td>
                                <td>{admin.Kod_Pocztowy}</td>
                                <td>{admin.Telefon}</td>
                                <td>{admin.Login}</td>
                                <td>
                                {loginID === admin.ID_Uzytkownika ? (
                                    <>
                                        <Button className="me-2" variant="danger" disabled>Usuń</Button>
                                        <Button variant="warning" disabled>Edytuj</Button>
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

                <div className="p-5 rounded-5 mt-4" style={{background: '#050505'}}>
                <h2>Users:</h2>
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
                        {users.map(user => (
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
          )}

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