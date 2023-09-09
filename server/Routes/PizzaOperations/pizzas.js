const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.get("/pizze", (req, res) => {
    connection.query("SELECT pizze.ID_Pizzy, pizze.Nazwa, pizze.Custom, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR '  / ') AS Cena FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar WHERE pizze.Custom = 'Nie' AND pizze.Status='Zatwierdzona' GROUP BY ID_Pizzy"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/pizzeCustom", (req, res) => {
    connection.query("SELECT pizze.ID_Pizzy, pizze.Nazwa, pizze.Custom, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR '  / ') AS Cena FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar WHERE pizze.Custom = 'Tak' AND pizze.Status='Zatwierdzona' GROUP BY ID_Pizzy"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/pizzeM/:ID_Uzytkownika", (req, res) => {
    const ID_Uzytkownika = req.params.ID_Uzytkownika;
    connection.query(
        "SELECT pizze.ID_Pizzy, pizze.Nazwa, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR ' / ') AS Cena FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar JOIN pizze_uzytkownicy ON pizze.ID_Pizzy = pizze_uzytkownicy.ID_Pizzy WHERE pizze.Custom = 'Tak' AND pizze.Status = 'Zatwierdzona' AND pizze_uzytkownicy.ID_Uzytkownika = ? GROUP BY pizze.ID_Pizzy",
        [ID_Uzytkownika],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        }
    );
});

router.get("/pizzeZ", (req, res) => {
    connection.query("SELECT pizze.ID_Pizzy, pizze.Nazwa, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR '  / ') AS Cena FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar WHERE pizze.Custom = 'Tak' AND pizze.Status='Oczekuje' GROUP BY ID_Pizzy"
        , (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/pizzeO/:ID_Uzytkownika", (req, res) => {
    const ID_Uzytkownika = req.params.ID_Uzytkownika;
    connection.query("SELECT pizze.ID_Pizzy, pizze.Nazwa, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR ' / ') AS Cena, pizze.Status, pizze.komentarz_admina FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar JOIN pizze_uzytkownicy ON pizze.ID_Pizzy = pizze_uzytkownicy.ID_Pizzy WHERE pizze.Custom = 'Tak' AND pizze_uzytkownicy.ID_Uzytkownika = ? AND pizze.Status = 'Oczekuje' OR pizze.Status='Odrzucono' AND pizze_uzytkownicy.ID_Uzytkownika = ? AND pizze.Custom = 'Tak' GROUP BY pizze.ID_Pizzy",
    [ID_Uzytkownika, ID_Uzytkownika],
    (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/pizzeEdit/:idPizzy", (req, res) => {
    const idPizzy = req.params.idPizzy;
    connection.query("SELECT pizze.ID_Pizzy, pizze.Status, pizze.Nazwa, pizze.Custom, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, GROUP_CONCAT(DISTINCT rozmiar_pizze.Cena SEPARATOR '  / ') AS Cena FROM Pizze pizze JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika JOIN rozmiar_pizze rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN Rozmiary ON rozmiar_pizze.ID_Rozmiar = rozmiary.ID_Rozmiar WHERE pizze.ID_Pizzy = ? GROUP BY ID_Pizzy",
    [idPizzy], 
    (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

module.exports = router;