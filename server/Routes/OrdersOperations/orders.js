const express = require("express");
const connection = require('./../db');

const router = express.Router();

//ZAMAWIANIE PIZZY W MENU
router.post('/ZamowPizze', (req, res) => {

    const { pizzas, orderData, koszykData } = req.body;
  
    // Step 1: Insert order data into the 'zamowienia' table without ID_Uzytkownika, Cena, Dostawa, Status, and Data_Zlozenia
    connection.query('INSERT INTO zamowienia SET ?', orderData, (err, result) => {
      if (err) {
        console.error('Error inserting order data:', err);
        return res.status(500).json({ error: 'Failed to submit the order.' });
      }
  
      const orderId = result.insertId; // Get the automatically generated ID_Zamowienia
  
      // Step 2: Insert pizza data into the 'zamówienia_pizzy' table using the obtained orderId
      for (const pizza of pizzas) {
        const { ID_Pizzy, ID_Kombinacji, Rozmiar_Pizzy, Cena } = pizza;
  
        const pizzaData = {
          ID_Zamowienia: orderId, // Use the generated ID_Zamowienia here
          ID_Pizzy: ID_Pizzy,
          Rozmiar_Pizzy: Rozmiar_Pizzy,
          ID_Kombinacji: ID_Kombinacji,
          Cena: Cena,
        };
  
        connection.query('INSERT INTO zamowienia_pizza SET ?', pizzaData, (err, result) => {
          if (err) {
            console.error('Error inserting pizza data:', err);
          }
        });
      }

      // Step 3: Delete all elements from the 'pizze_koszyk' table based on the ID_Koszyka
    connection.query('DELETE FROM pizze_koszyk WHERE ?', koszykData, (err, result) => {
      if (err) {
        console.error('Error deleting items from pizze_koszyk:', err);
      }
    });

  
      return res.status(200).json({ message: 'Order submitted successfully!', orderId });
    });
  });
 
//ZAMÓWIENIA DLA DANEGO UŻYTKOWNIKA
router.get("/Zamowienia/:ID_Uzytkownika", (req, res) => {
  const { ID_Uzytkownika } = req.params;
  connection.query(
      "SELECT zamowienia.ID_Zamowienia, zamowienia.ID_Uzytkownika, zamowienia.Cena, zamowienia.Dostawa, zamowienia.Status, zamowienia.Data_Zlozenia, GROUP_CONCAT(pizze.Nazwa, ' (', zamowienia_pizza.Rozmiar_Pizzy, ') - ', zamowienia_pizza.Cena, ' PLN') AS Pizze_z_cenami FROM Zamowienia JOIN Zamowienia_pizza ON zamowienia.ID_Zamowienia = zamowienia_pizza.ID_Zamowienia JOIN Pizze ON zamowienia_pizza.ID_Pizzy = pizze.ID_Pizzy WHERE zamowienia.ID_Uzytkownika = ? GROUP BY zamowienia.ID_Zamowienia;",
      [ID_Uzytkownika],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.get("/glosowezamowienia/:Telefon", (req, res) => {
  const { Telefon } = req.params;
  connection.query(
    "SELECT glosowezamowienia.ID_Zamowienia, glosowezamowienia.Cena, glosowezamowienia.Dostawa, glosowezamowienia.Status, glosowezamowienia.Data_Zlozenia, GROUP_CONCAT(pizze.Nazwa, ' (', glosowezamowienia_pizza.Rozmiar_Pizzy, ') - ', glosowezamowienia_pizza.Cena, ' PLN') AS Pizze_z_cenami FROM glosowezamowienia JOIN glosowezamowienia_pizza ON glosowezamowienia.ID_Zamowienia = glosowezamowienia_pizza.ID_Zamowienia JOIN Pizze ON glosowezamowienia_pizza.ID_Pizzy = pizze.ID_Pizzy WHERE glosowezamowienia.telefon = ? GROUP BY glosowezamowienia.ID_Zamowienia;",
    [Telefon],
    (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    }
  );
});

//Wszystie zamówienia dla pizzeri
router.get("/ZamowieniaAdmin", (req, res) => {
  connection.query(
      "SELECT zamowienia.ID_Zamowienia, zamowienia.ID_Uzytkownika, zamowienia.Cena, zamowienia.Dostawa, zamowienia.Status, zamowienia.Data_Zlozenia, GROUP_CONCAT(pizze.Nazwa, ' (', zamowienia_pizza.Rozmiar_Pizzy, ') - ', zamowienia_pizza.Cena, ' PLN') AS Pizze_z_cenami FROM Zamowienia JOIN Zamowienia_pizza ON zamowienia.ID_Zamowienia = zamowienia_pizza.ID_Zamowienia JOIN Pizze ON zamowienia_pizza.ID_Pizzy = pizze.ID_Pizzy GROUP BY zamowienia.ID_Zamowienia;",
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.get("/ZamowieniaAdminNiezalogowani", (req, res) => {
  connection.query(
      "SELECT glosowezamowienia.ID_Zamowienia, glosowezamowienia.telefon, glosowezamowienia.imie, glosowezamowienia.nazwisko, glosowezamowienia.adres, glosowezamowienia.kod_pocztowy, glosowezamowienia.Cena, glosowezamowienia.Dostawa, glosowezamowienia.Status, glosowezamowienia.Data_Zlozenia, GROUP_CONCAT(pizze.Nazwa, ' (', glosowezamowienia_pizza.Rozmiar_Pizzy, ') - ', glosowezamowienia_pizza.Cena, ' PLN') AS Pizze_z_cenami FROM glosowezamowienia JOIN glosowezamowienia_pizza ON glosowezamowienia.ID_Zamowienia = glosowezamowienia_pizza.ID_Zamowienia JOIN Pizze ON glosowezamowienia_pizza.ID_Pizzy = pizze.ID_Pizzy GROUP BY glosowezamowienia.ID_Zamowienia;",
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post("/GotoweZamowienie", (req, res) => {
  const orderID  = req.body.orderID;
  console.log(orderID)
  connection.query(
    "UPDATE Zamowienia SET Status = 'Gotowe' WHERE ID_Zamowienia = ?;",
    [orderID],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post("/GotoweZamowienieNiezalogowani", (req, res) => {
  const orderID  = req.body.orderID;
  console.log(orderID)
  connection.query(
    "UPDATE glosowezamowienia SET Status = 'Gotowe' WHERE ID_Zamowienia = ?;",
    [orderID],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post("/ZakonczoneZamowienie", (req, res) => {
  const orderID  = req.body.orderID;
  connection.query(
      "UPDATE Zamowienia SET Status = 'Zakończone' WHERE ID_Zamowienia = ?;",
      [orderID],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post("/ZakonczoneZamowienieNiezalogowani", (req, res) => {
  const orderID  = req.body.orderID;
  connection.query(
      "UPDATE glosowezamowienia SET Status = 'Zakończone' WHERE ID_Zamowienia = ?;",
      [orderID],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post("/UsuwaneZamowienie", (req, res) => {
  const orderID  = req.body.orderID;
  connection.query(
    "DELETE FROM Zamowienia WHERE ID_Zamowienia = ?;",
    [orderID],
      (error, results, fields) => {
          if (error) throw error;
          res.json(results);
      }
  );
});

router.post('/ordervocally', (req, res) => {

  const { selectedPizzas, Imie, Nazwisko, Telefon, Adres, Kod, Dostawa } = req.body;

  console.log('Odebrane dane:');
  console.log('Wybrane pizze:', selectedPizzas);
  console.log('Imię:', Imie);
  console.log('Nazwisko:', Nazwisko);
  console.log('Telefon:', Telefon);
  console.log('Adres:', Adres);
  console.log('Kod pocztowy:', Kod);
  console.log('Kod pocztowy:', Dostawa);

  connection.query(
    `INSERT INTO glosowezamowienia (Cena, Dostawa, Status, Data_Zlozenia, Godzina, Telefon, Imie, Nazwisko, Kod_Pocztowy, Adres)
     VALUES (?, ?, ?, CURRENT_DATE, CURRENT_TIME, ?, ?, ?, ?, ?)`,
    [0, Dostawa, 'Oczekujące', Telefon, Imie, Nazwisko, Kod, Adres],
    (error, results) => {
      if (error) {
        console.error("Błąd podczas dodawania zamówienia: ", error);
        res.status(500).json({ message: "Wystąpił błąd podczas dodawania zamówienia." });
      } else {
        const ID_Zamowienia = results.insertId; // Pobierz zwrócone ID_Zamowienia

        // Przelicz cenę zamówienia na podstawie wybranych pizz
        let cenaZamowienia = 0;
        for (const pizza of selectedPizzas) {
          cenaZamowienia += pizza.cena;
          console.log("Cena pizzy:", pizza.cena);
        }

        console.log("Obliczona cena zamówienia:", cenaZamowienia);

        // Zaktualizuj cenę zamówienia w tabeli glosowezamowienia
        connection.query(
          'UPDATE glosowezamowienia SET Cena = ? WHERE ID_Zamowienia = ?',
          [cenaZamowienia, ID_Zamowienia],
          (error, results) => {
            if (error) {
              console.error("Błąd podczas aktualizacji ceny zamówienia: ", error);
              res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji ceny zamówienia." });
            } else {
              for (const pizza of selectedPizzas) {
                const dodajPizzeQuery = "INSERT INTO glosowezamowienia_pizza (ID_Zamowienia, ID_Pizzy, Rozmiar_Pizzy, Cena) VALUES (?, ?, ?, ?)";
                const pizzValues = [ID_Zamowienia, pizza.idpizzy, pizza.rozmiar, pizza.cena];

                connection.query(
                  dodajPizzeQuery,
                  pizzValues,
                  (error, results) => {
                    if (error) {
                      console.error("Błąd podczas dodawania pizzy: ", error);
                      res.status(500).json({ message: "Wystąpił błąd podczas dodawania pizzy." });
                    }
                  }
                );
              }

            }
          }
        );
      }
    }
  );
});

module.exports = router;