import React, { useState, useEffect } from 'react'; 
import Axios from 'axios';
import NavbarE from './../Components/NavBar.js';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import { Navigate, useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';


function Users() {

    const navigate = useNavigate();

    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [loginID, setLoginID] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    
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

    useEffect(() => {
        Axios.get(`/Admins`)
        .then(response => {
          setAdmins(response.data);
        })
          .catch(error => console.error(error));
      }, []);
    
      useEffect(() => {
        Axios.get(`/Users`)
        .then(response => {
          setUsers(response.data);
        })
          .catch(error => console.error(error));
      }, []);

      const handleChange = (user) => {
        console.log(`Zmieniam użytkownika o ID ${user.ID_Uzytkownika}`);
      };

      const handleDelete = (user) => {
        console.log(`Usuwam użytkownika o ID ${user.ID_Uzytkownika}`);
      };

      const handleAdd = (user) => {
        console.log(`Dodaje użytkownika o roli: ${user}`);
      };

    return <div style={{ minHeight: "100vh" }}>
            <NavbarE />
            {loading ? (
            <div style={{height: "1000px"}}>
            <p>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></p>
            </div>
          ) : (
            <div className="container mt-4">
                
            <h2>Admins:</h2>
                <Table striped bordered hover variant="dark">
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
                                    <Button onClick={() => handleDelete(admin)} className="me-2" variant="danger">Usuń</Button>
                                    <Button onClick={() => handleChange(admin)} variant="warning">Edytuj</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button onClick={() => handleAdd("admin")} className="mb-4" variant="primary">Dodaj admina</Button>

                <h2>Users:</h2>
                <Table striped bordered hover variant="dark">
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
                <Button onClick={() => handleAdd("user")} className="mb-4" variant="primary">Dodaj użytkownika</Button>
            </div>
          )}
        </div>
}

export default Users;