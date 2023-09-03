const express = require("express");

const connection = require('./../db');

const router = express.Router();

router.post("/UsunUzytkownika", async (req, res) => {

    const errors = {};

    // Sprawdzenie czy zalogowany użytkownik chce się sam usunąć lub admina o ID 1
    if (req.body.UserID == req.body.NowLoggedInUserID) {
        errors.Id = "Nie możesz sam siebie usunąć!";
    } else if (req.body.UserID == 1) {
        errors.Id = "Nie możesz usunąć admina o ID 1";
    }

        // Jeśli są jakieś błędy to zwróć je w odpowiedzi
        if (Object.keys(errors).length > 0) {
            res.status(400).send({ errors: Object.values(errors) });
            console.log(errors)
            return;
        } else {
            const message = "Dodano użytkownika o loginie:"+req.body.Login;
            res.send(message);
        }

        const UserID = req.body.UserID;
        const NowLoggedInUserID = req.body.NowLoggedInUserID;

});

module.exports = router;