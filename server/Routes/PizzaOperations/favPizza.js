const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.delete('/usunRelacje/:userID/:pizzaID', (req, res) => {
    const { userID, pizzaID } = req.params;

    const sql = "INSERT INTO pizze_ulubione (ID_Uzytkownika, ID_Pizzy) VALUES (?, ?)";
  connection.query(sql, [userID, pizzaID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Błąd serwera");
    } else {
      res.sendStatus(200);
    }
  });
});

router.post('/dodajRelacje/:userID/:pizzaID', (req, res) => {
    const { userID, pizzaID } = req.params;

    const sql = "DELETE FROM pizze_ulubione WHERE ID_Uzytkownika = ? AND ID_Pizzy = ?";
  connection.query(sql, [userID, pizzaID], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Błąd serwera");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;