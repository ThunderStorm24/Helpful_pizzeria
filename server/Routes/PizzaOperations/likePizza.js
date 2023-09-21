const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.get("/pizzeLike", (req, res) => {
    connection.query("SELECT ID_Pizzy, SUM(CASE WHEN Polubienie = 'Tak' THEN 1 ELSE 0 END) AS PolubieniaTak, SUM(CASE WHEN Polubienie = 'Nie' THEN 1 ELSE 0 END) AS PolubieniaNie FROM pizza_polubienie GROUP BY ID_Pizzy",
    (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.get("/Likes", (req, res) => {
    connection.query("SELECT ID_Polubienia, ID_Pizzy, ID_Uzytkownika, Polubienie FROM pizza_polubienie",
    (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})

router.post("/UserLike", (req, res) => {
    const ID_Uzytkownika = req.body.ID_Uzytkownika; // Założmy, że ID_Uzytkownika jest dostarczane w zapytaniu
    const ID_Pizzy = req.body.ID_Pizzy; // Założmy, że ID_Pizzy jest dostarczane w zapytaniu

    // Sprawdź, czy polubienie już istnieje
    connection.query("SELECT * FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ? AND Polubienie = 'Tak'",
    [ID_Uzytkownika, ID_Pizzy],
    (error, results, fields) => {
        if (error) {
            throw error;
        }

        if (results.length > 0) {
            // Jeśli polubienie istnieje, usuń je
            connection.query("DELETE FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ? AND Polubienie = 'Tak'",
            [ID_Uzytkownika, ID_Pizzy],
            (deleteError, deleteResults, deleteFields) => {
                if (deleteError) {
                    throw deleteError;
                }
                res.json({ message: "Usunięto polubienie", Polubienie: 'Nie' });
            });
        } else {
            // Jeśli polubienie nie istnieje, dodaj je
            connection.query("INSERT INTO pizza_polubienie (ID_Uzytkownika, ID_Pizzy, Polubienie) VALUES (?, ?, 'Tak')",
            [ID_Uzytkownika, ID_Pizzy],
            (insertError, insertResults, insertFields) => {
                if (insertError) {
                    throw insertError;
                }
                res.json({ message: "Dodano polubienie", Polubienie: 'Tak' });
            });
        }
    });
});

router.post("/UserDisLike", (req, res) => {
    connection.query("",
    (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        });
})




module.exports = router;