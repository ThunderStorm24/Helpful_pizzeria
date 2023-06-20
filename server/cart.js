const express = require("express");
const connection = require('./db');

const router = express.Router();

router.get("/koszyk/:ID_Uzytkownika", (req, res) => {
    const { ID_Uzytkownika } = req.params;
    connection.query(
        "SELECT pizze_koszyk.ID_Kombinacji, koszyk.ID_Koszyka,koszyk.ID_Uzytkownika,pizze.ID_Pizzy,pizze.Nazwa, GROUP_CONCAT(DISTINCT skladniki.Nazwa SEPARATOR ', ') AS Skladniki, MAX(CASE WHEN rozmiar_pizze.ID_Rozmiar = 1 THEN rozmiar_pizze.Cena END) AS Cena_Mala, MAX(CASE WHEN rozmiar_pizze.ID_Rozmiar = 2 THEN rozmiar_pizze.Cena END) AS Cena_Srednia, MAX(CASE WHEN rozmiar_pizze.ID_Rozmiar = 3 THEN rozmiar_pizze.Cena END) AS Cena_Duza, MAX(CASE WHEN rozmiar_pizze.ID_Rozmiar = 4 THEN rozmiar_pizze.Cena END) AS Cena_Maksimum FROM koszyk JOIN pizze_koszyk ON koszyk.ID_Koszyka = pizze_koszyk.ID_Koszyka JOIN pizze ON pizze_koszyk.ID_Pizzy = pizze.ID_Pizzy JOIN rozmiar_pizze ON pizze.ID_Pizzy = rozmiar_pizze.ID_Pizzy JOIN pizze_skladniki ON pizze.ID_Pizzy = pizze_skladniki.ID_Pizzy JOIN skladniki ON pizze_skladniki.ID_Skladnika = skladniki.ID_Skladnika WHERE koszyk.ID_Uzytkownika = ? GROUP BY ID_Kombinacji",
        [ID_Uzytkownika],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        }
    );
});

router.post("/UsunZKoszyka", (req, res) => {
    const { pizzaId } = req.body;
    const query = `DELETE FROM pizze_koszyk WHERE ID_Kombinacji = ?`;

    connection.query(query, [pizzaId],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
});

router.post("/DodajDoKoszyka", (req, res) => {

    const ID = req.body.ID;
    const ID_Pizzy = req.body.ID_Pizzy;

    // pobierz ID koszyka dla użytkownika o ID równym 1
    connection.query(
        "SELECT ID_Koszyka FROM koszyk WHERE ID_Uzytkownika = ?",
        [ID],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Błąd serwera");
            } else {
                const koszykID = result[0].ID_Koszyka;

                connection.query(
                    "INSERT INTO pizze_koszyk (ID_Koszyka, ID_Pizzy) VALUES (?, ?)",
                    [koszykID, ID_Pizzy],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Błąd serwera");
                        } else {
                            console.log("Dodano pizzę do koszyka");
                            res.send("Pomyślnie dodano pizzę do koszyka");
                        }
                    }
                );
            }
        }
    );
});

module.exports = router;