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


module.exports = router;