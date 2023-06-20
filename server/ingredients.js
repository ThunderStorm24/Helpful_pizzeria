const express = require("express");
const connection = require('./db');

const router = express.Router();

router.post("/ZmienUlubione", (req, res) => {

    const ID_Skladnika = req.body.ID_Skladnika;
    const ID_Uzytkownika = req.body.ID_Uzytkownika;
    const Nazwa = req.body.Nazwa;

    console.log(Nazwa, ID_Skladnika, ID_Uzytkownika);

    if (Nazwa === null) {
        const checkQuery = "SELECT * FROM uzytkownicy_skladniki WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?";
        const insertQuery = "INSERT INTO uzytkownicy_skladniki (ID_Uzytkownika, ID_Skladnika, Ulubiony) VALUES (?, ?, 'Tak')";
        const updateQuery = "UPDATE uzytkownicy_skladniki SET Ulubiony = 'Tak' WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?";

        connection.query(checkQuery, [ID_Uzytkownika, ID_Skladnika], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                if (results.length > 0) {
                    // rekord już istnieje, wykonaj zapytanie UPDATE
                    connection.query(updateQuery, [ID_Uzytkownika, ID_Skladnika], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else {
                    // rekord nie istnieje, wykonaj zapytanie INSERT
                    connection.query(insertQuery, [ID_Uzytkownika, ID_Skladnika], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    }

    if (Nazwa === "ulubiony") {
        connection.query("UPDATE uzytkownicy_skladniki SET Ulubiony = 'Nie' WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?",
            [ID_Uzytkownika, ID_Skladnika],
            (err, result) => {
                console.log(err);
            })
    }

    if (Nazwa === "znienawidzony") {
        connection.query("UPDATE uzytkownicy_skladniki SET Ulubiony = '' WHERE ID_Uzytkownika = ? AND ID_Skladnika = ?",
            [ID_Uzytkownika, ID_Skladnika],
            (err, result) => {
                console.log(err);
            })
    }


})


router.get("/Skladniki", (req, res) => {
    connection.query("SELECT * FROM Skladniki"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/UlubioneSkladniki", (req, res) => {
    connection.query("SELECT uzytkownicy.ID_Uzytkownika, skladniki.Nazwa, uzytkownicy_skladniki.Ulubiony FROM uzytkownicy JOIN uzytkownicy_skladniki ON uzytkownicy.ID_Uzytkownika = uzytkownicy_skladniki.ID_Uzytkownika JOIN skladniki ON uzytkownicy_skladniki.ID_Skladnika = skladniki.ID_Skladnika"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

module.exports = router;