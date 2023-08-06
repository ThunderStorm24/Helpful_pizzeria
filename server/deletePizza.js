const express = require("express");
const connection = require('./db');

const router = express.Router();

router.post("/UsunPizze", async (req, res) => {
    const ID_Pizzy=req.body.ID;
    console.log(ID_Pizzy);

    const deleteQuery = `DELETE FROM pizze WHERE ID_Pizzy = ${ID_Pizzy};`;

    connection.query(deleteQuery, (error, results) => {
        if (error) {
          console.error("Error w usuwaniu pizzy:", error);
          res.status(500).json({ message: "Błąd w usuwaniu pizzy." });
        } else {
          console.log("Pizza usunięta pomyślnie!");
          res.status(200).json({ message: `Pizza o ID ${ID_Pizzy} została pomyślnie usunięta`});
        }
    })
});


module.exports = router;