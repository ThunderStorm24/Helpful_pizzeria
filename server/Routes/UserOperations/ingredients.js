const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.post('/ZmienUlubione', (req, res) => {
    const { changedColors, loginID } = req.body;
  
    console.log(changedColors);
    console.log(loginID);
  
    for (const skladnikId in changedColors) {
      let ulubionyValue = '';
  
      if (changedColors[skladnikId] === 'ulubiony') {
        ulubionyValue = 'Tak';
      } else if (changedColors[skladnikId] === 'nieulubiony') {
        ulubionyValue = 'Nie';
      }
  
      const checkQuery = 'SELECT 1 FROM uzytkownicy_skladniki WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?';
  
      connection.query(checkQuery, [loginID, skladnikId], (error, result) => {
        if (error) {
          console.error('Błąd podczas sprawdzania istnienia rekordu w bazie danych', error);
          res.status(500).json({ message: 'Wystąpił błąd podczas sprawdzania istnienia rekordu w bazie danych' });
        } else {
          if (result && result.length > 0) {
            // Jeśli rekord istnieje, wykonaj UPDATE
            const updateQuery = 'UPDATE uzytkownicy_skladniki SET Ulubiony = ? WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?';
  
            connection.query(updateQuery, [ulubionyValue, loginID, skladnikId], (error) => {
              if (error) {
                console.error('Błąd podczas aktualizacji danych w bazie danych', error);
                res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji danych w bazie danych' });
              }
            });
          } else {
            // Jeśli rekord nie istnieje, wykonaj INSERT
            const insertQuery = 'INSERT INTO uzytkownicy_skladniki (ID_Uzytkownika, ID_Skladnika, Ulubiony) VALUES (?, ?, ?)';
  
            connection.query(insertQuery, [loginID, skladnikId, ulubionyValue], (error) => {
              if (error) {
                console.error('Błąd podczas wstawiania danych do bazy danych', error);
                res.status(500).json({ message: 'Wystąpił błąd podczas wstawiania danych do bazy danych' });
              }
            });
          }
        }
      });
    }
  
    res.status(200).json({ message: 'Zaktualizowano dane w bazie danych' });
  });

router.get("/Skladniki", (req, res) => {
    connection.query("SELECT * FROM Skladniki"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/UlubioneSkladniki/:ID_Uzytkownika", (req, res) => {
    const loginID = req.params.ID_Uzytkownika; // Odczytaj loginID z parametru w ścieżce URL

    connection.query(
        "SELECT uzytkownicy_skladniki.Ulubiony, uzytkownicy_skladniki.ID_Uzytkownika, uzytkownicy_skladniki.ID_Skladnika FROM uzytkownicy_skladniki WHERE uzytkownicy_skladniki.ID_Uzytkownika = ?;",
        [loginID], 
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

module.exports = router;