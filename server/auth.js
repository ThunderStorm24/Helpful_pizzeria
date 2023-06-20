const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connection = require('./db');

const router = express.Router();

router.post("/register", (req, res) => {

    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Adress = req.body.Adress;
    const Zipcode = req.body.Zipcode;
    const Phone = req.body.Phone;
    const Login = req.body.Login;
    const Password = req.body.Password;

    bcrypt.hash(Password, saltRounds, (err, hash) => {
        connection.query("INSERT INTO uzytkownicy (Imie, Nazwisko, Rola, Adres, Kod_Pocztowy, Telefon, Login, Haslo) VALUES(?,?,'user',?,?,?,?,?)",
            [Name, Surname, Adress, Zipcode, Phone, Login, hash],
            (err, result) => {
                console.log(err);
            })
    })

})

router.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user })
    } else {
        res.send({ loggedIn: false })
    }
})

router.post("/login", (req, res) => {

    const Login = req.body.Login;
    const Password = req.body.Password;

    connection.query("SELECT * FROM uzytkownicy WHERE Login = ?",
        [Login],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }

            if (result.length > 0) {
                bcrypt.compare(Password, result[0].Haslo, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result)
                    } else {
                        res.send({ message: "Zła kombinacja loginu i hasła!" })
                    }
                })
            } else {
                res.send({ message: "Użytkownik nie istnieje" })
            }
        })

})

router.get("/wyloguj", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.clearCookie("userID");
        res.send("Zostałeś wylogowany");
    });
});

module.exports = router;