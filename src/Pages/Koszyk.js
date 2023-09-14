import NavbarE from './../Components/NavBar.js';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

export default function Koszyk() {

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [loginID, setLoginID] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

    const [KoszykID, setKoszykID] = useState(null); // Początkowo ustawiamy na null, ponieważ ID_Koszyka może być null, jeśli koszyk jest pusty
    const [koszyk, setKoszyk] = useState([]);
    const [sizes, setSizes] = useState({});

    const [total, setTotal] = useState(0);

    const [subtractItemsCart, setSubtractItemsCart] = useState(0);

    const lowerItemsCount = () => {
      setSubtractItemsCart(prevCount => prevCount - 1); // Zmniejszenie licznika o 1
    };

    // funkcja do obliczania sumy cen

    const calculateTotal = () => {
        let sum = 0;
        koszyk.forEach(pizza => {
            switch (sizes[pizza.ID_Kombinacji]) {
                case 'Mala':
                    sum += pizza.Cena_Mala;
                    break;
                case 'Srednia':
                    sum += pizza.Cena_Srednia;
                    break;
                case 'Duza':
                    sum += pizza.Cena_Duza;
                    break;
                case 'Maksimum':
                    sum += pizza.Cena_Maksimum;
                    break;
                default:
                    sum += pizza.Cena_Mala; // cena domyślna dla braku wybranej wielkości
            }
        });
        return sum;
    }

    const handleSizeChange = (event, pizza) => {
        const newSizes = { ...sizes };
        newSizes[pizza.ID_Kombinacji] = event.target.value;
        setSizes(newSizes);
    };

    useEffect(() => {
        setTotal(calculateTotal()); // obliczanie sumy cen po zmianie wielkości pizzy
    }, [koszyk, sizes])

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

    useEffect(() => {
        Axios.get(`/Koszyk/${loginID}`)
            .then(response => {
                setKoszyk(response.data);
                setLoading(false); // zmiana stanu loading na false
                setKoszykID(response.data[0].ID_Koszyka);
            })
            .catch(error => console.error(error));
    }, [loginStatus]);

    const handleRemove = (pizzaId) => {
        const newKoszyk = koszyk.filter((pizza) => pizza.ID_Kombinacji !== pizzaId);
        setKoszyk(newKoszyk);
        setSizes((sizes) => {
            const { [pizzaId]: _, ...rest } = sizes;
            return rest;
        });
        // Dodajemy kod Axios tutaj
        lowerItemsCount();
        Axios.post('/UsunZKoszyka', { pizzaId })
            .then((response) => {
                // Opcjonalnie można dodać kod obsługi odpowiedzi z serwera
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // ZAMOWIENIE PIZZ WSZYSTKICH
    const handleZamowienie = async () => {
        // Gather the pizza data and order data from your front-end state
        const pizzaData = koszyk.map((pizza) => {

            const rozmiar = sizes[pizza.ID_Kombinacji] || 'Mala';
            let cena;
        
            switch (rozmiar) {
              case 'Mala':
                cena = pizza.Cena_Mala;
                break;
              case 'Srednia':
                cena = pizza.Cena_Srednia;
                break;
              case 'Duza':
                cena = pizza.Cena_Duza;
                break;
              case 'Maksimum':
                cena = pizza.Cena_Maksimum;
                break;
              default:
                cena = pizza.Cena_Mala; // Default to the small size price if an invalid size is selected
                break;
            }

          return {
            ID_Pizzy: pizza.ID_Pizzy,
            ID_Kombinacji: pizza.ID_Kombinacji,
            Rozmiar_Pizzy: rozmiar,
            Cena: cena,
          };
        });
        
        const orderData = {
          ID_Uzytkownika: loginID,
          Cena: total,
          Dostawa: 'Tak',
          Status: 'Zamówiono', // You can set the initial status to "Submitted" here
          Data_Zlozenia: new Date(), // You can set the order submission date here
        };

        const koszykData = {
            ID_Koszyka: KoszykID,
        };
      
        try {
          // Send the data to the server-side endpoint
          const response = await fetch('/ZamowPizze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pizzas: pizzaData, orderData, koszykData }),
          });
          
          if (response.ok) {
            window.location.reload();
          } else {
            // The order submission failed
            // Handle the error, e.g., showing an error message, logging the error, etc.
          }
        } catch (error) {
          // Handle fetch or other errors that may occur
        }
      };

    return <div style={{ height: "1000px" }}>
        <NavbarE subtractItemsCart={subtractItemsCart} />
        {loading ? (
        <div>Ładowanie... <Spinner animation="border" variant="primary" size="sm" /></div>
        ) : (
        <div className="mt-5">
            <h3>Koszyk:</h3>
            
            <table className="table text-white">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nazwa</th>
                        <th>Skladniki</th>
                        <th>Rozmiar</th>
                        <th>Cena</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {koszyk.map((pizza) => (
                        <tr key={pizza.ID_Kombinacji}>
                            <td>{pizza.ID_Pizzy}</td>
                            <td>{pizza.Nazwa}</td>
                            <td>{pizza.Skladniki}</td>
                            <td>
                                <select
                                    value={sizes[pizza.ID_Kombinacji] || 'Mala'}
                                    onChange={(event) => handleSizeChange(event, pizza)}>
                                    <option value="Mala">Mala</option>
                                    <option value="Srednia">Średnia</option>
                                    <option value="Duza">Duża</option>
                                    <option value="Maksimum">Gigant</option>
                                </select>
                            </td>
                            <td>
                                {!sizes[pizza.ID_Kombinacji] && `${pizza.Cena_Mala} zł`}
                                {sizes[pizza.ID_Kombinacji] === 'Mala' && `${pizza.Cena_Mala} zł`}
                                {sizes[pizza.ID_Kombinacji] === 'Srednia' && `${pizza.Cena_Srednia} zł`}
                                {sizes[pizza.ID_Kombinacji] === 'Duza' && `${pizza.Cena_Duza} zł`}
                                {sizes[pizza.ID_Kombinacji] === 'Maksimum' && `${pizza.Cena_Maksimum} zł`}
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleRemove(pizza.ID_Kombinacji)}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        
            <div className="d-flex justify-content-end me-5">
                <div>Łącznie: {total} zł</div>
            </div>
            <div className="d-flex justify-content-end me-5 mt-3">
                <button className="btn btn-danger" onClick={handleZamowienie}>Zamów</button>
            </div>
        
        </div>
        )}
    </div>
}