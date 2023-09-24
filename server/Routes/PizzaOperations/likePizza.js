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
    const ID_Uzytkownika = req.body.ID_Uzytkownika;
    const ID_Pizzy = req.body.ID_Pizzy;

    connection.query(
        "SELECT * FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
        [ID_Uzytkownika, ID_Pizzy],
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                if (results[0].Polubienie === 'Tak') {
                    // Jeśli polubienie już jest "Tak", usuń je
                    connection.query(
                        "DELETE FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
                        [ID_Uzytkownika, ID_Pizzy],
                        (deleteError, deleteResults, deleteFields) => {
                            if (deleteError) {
                                throw deleteError;
                            }
                            res.json({ message: "Usunięto polubienie", Polubienie: 'Nie' });
                        }
                    );
                } else {
                    // Jeśli polubienie jest "Nie", aktualizuj je na "Tak"
                    connection.query(
                        "UPDATE pizza_polubienie SET Polubienie = 'Tak' WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
                        [ID_Uzytkownika, ID_Pizzy],
                        (updateError, updateResults, updateFields) => {
                            if (updateError) {
                                throw updateError;
                            }
                            res.json({ message: "Zaktualizowano na polubienie", Polubienie: 'Tak' });
                        }
                    );
                }
            } else {
                // Jeśli nie ma wpisu, dodaj nowy wpis z Polubieniem "Tak"
                connection.query(
                    "INSERT INTO pizza_polubienie (ID_Uzytkownika, ID_Pizzy, Polubienie) VALUES (?, ?, 'Tak')",
                    [ID_Uzytkownika, ID_Pizzy],
                    (insertError, insertResults, insertFields) => {
                        if (insertError) {
                            throw insertError;
                        }
                        res.json({ message: "Dodano polubienie", Polubienie: 'Tak' });
                    }
                );
            }
        }
    );
});

router.post("/UserDisLike", (req, res) => {
    const ID_Uzytkownika = req.body.ID_Uzytkownika;
    const ID_Pizzy = req.body.ID_Pizzy;

    connection.query(
        "SELECT * FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
        [ID_Uzytkownika, ID_Pizzy],
        (error, results, fields) => {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                if (results[0].Polubienie === 'Nie') {
                    // Jeśli polubienie już jest "Nie", usuń je
                    connection.query(
                        "DELETE FROM pizza_polubienie WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
                        [ID_Uzytkownika, ID_Pizzy],
                        (deleteError, deleteResults, deleteFields) => {
                            if (deleteError) {
                                throw deleteError;
                            }
                            res.json({ message: "Usunięto niepolubienie", Polubienie: 'Tak' });
                        }
                    );
                } else {
                    // Jeśli polubienie jest "Tak", aktualizuj je na "Nie"
                    connection.query(
                        "UPDATE pizza_polubienie SET Polubienie = 'Nie' WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?",
                        [ID_Uzytkownika, ID_Pizzy],
                        (updateError, updateResults, updateFields) => {
                            if (updateError) {
                                throw updateError;
                            }
                            res.json({ message: "Zaktualizowano na niepolubienie", Polubienie: 'Nie' });
                        }
                    );
                }
            } else {
                // Jeśli nie ma wpisu, dodaj nowy wpis z Polubieniem "Nie"
                connection.query(
                    "INSERT INTO pizza_polubienie (ID_Uzytkownika, ID_Pizzy, Polubienie) VALUES (?, ?, 'Nie')",
                    [ID_Uzytkownika, ID_Pizzy],
                    (insertError, insertResults, insertFields) => {
                        if (insertError) {
                            throw insertError;
                        }
                        res.json({ message: "Dodano niepolubienie", Polubienie: 'Nie' });
                    }
                );
            }
        }
    );
})




module.exports = router;