const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.post("/AkceptujPizze", async (req, res) => {
    const ID_Pizzy=req.body.ID;
    let Comment=req.body.Comment;
    if (Comment.trim() === "") {
      Comment = "brak komentarza admina";
    } 
    
    const acceptQuery = `UPDATE pizze SET Status = 'Zatwierdzona', Komentarz_admina = '${Comment}' WHERE ID_Pizzy = ${ID_Pizzy}`;

    connection.query(acceptQuery, (error, results) => {
        if (error) {
          console.error("Error w akceptowaniu pizzy:", error);
          res.status(500).json({ message: "Błąd w akceptowaniu pizzy." });
        } else {
          console.log("Pizza zaakceptowana pomyślnie!");
          res.status(200).json({ message: `Pizza o ID ${ID_Pizzy} została pomyślnie zaakceptowana`});
        }
    })
    

})

router.post("/OdrzucPizze", async (req, res) => {
    const ID_Pizzy=req.body.ID;
    let Comment=req.body.Comment;
    if (Comment.trim() === "") {
      Comment = "brak komentarza admina";
    } 

    const deniedQuery =  `UPDATE pizze SET Status = 'Odrzucono', Komentarz_admina = '${Comment}' WHERE ID_Pizzy = ${ID_Pizzy}`;

    connection.query(deniedQuery, (error, results) => {
        if (error) {
          console.error("Error w odrzucaniu pizzy:", error);
          res.status(500).json({ message: "Błąd w odrzucaniu pizzy." });
        } else {
          console.log("Pizza odrzucona pomyślnie!");
          res.status(200).json({ message: `Pizza o ID ${ID_Pizzy} została odrzucona`});
        }
    })

})

module.exports = router;