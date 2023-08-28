const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.get("/Uzytkownicy/:ID_Uzytkownika", (req, res) => {
    const { ID_Uzytkownika } = req.params;
    connection.query(
        "SELECT * FROM Uzytkownicy WHERE ID_Uzytkownika = ?",
        [ID_Uzytkownika],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results[0]);
        }
    );
});

router.get("/Admins", (req, res) => {
    const Role = "admin";
    connection.query(
        "SELECT * FROM Uzytkownicy WHERE Rola = ?",
        [Role],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        }
    );
});

router.get("/Users", (req, res) => {
    const Role = "user";
    connection.query(
        "SELECT * FROM Uzytkownicy WHERE Rola = ?",
        [Role],
        (error, results, fields) => {
            if (error) throw error;
            res.json(results);
        }
    );
});

module.exports = router;