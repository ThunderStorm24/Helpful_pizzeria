const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connection = require('./../db');

const router = express.Router();

router.post("/register", (req, res) => {

    const errors = {};

// Sprawdzenie czy Login jest podany
if (!req.body.Login) {
    errors.login = "Login jest wymagany";
} else if (req.body.Login.length > 50 || req.body.Login.length <= 3) {
    errors.login = "Login nie może być dłuższy niż 50 znaków oraz krótszy niż 4 znaki";
}

// Sprawdzenie czy Login jest unikalny
connection.query("SELECT * FROM uzytkownicy WHERE Login = ?", [req.body.Login], (err, results) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Error occurred while checking Login uniqueness");
    }

    if (results.length > 0) {
        errors.login = "Login: "+req.body.Login+", już istnieje w naszej bazie danych, spróbuj innego loginu";
    }

// Sprawdzenie czy Password jest podany
if (!req.body.Password) {
    errors.haslo = "Hasło jest wymagane";
} else if (req.body.Password.length > 150 || req.body.Password.length <= 4) {
    errors.haslo = "Hasło nie może być dłuższe niż 150 znaków oraz krótsze niż 5 znaków";
}

// Sprawdzenie czy Imie jest podany
if (!req.body.Name) {
    errors.imie = "Imie jest wymagane";
} else if (req.body.Name.length > 50 || req.body.Name.length <= 2) {
    errors.imie = "Imie nie może być dłuższe niż 50 znaków oraz krótsze niż 3 znaki";
} else if (!/^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(req.body.Name)) {
    errors.imie = "Imie musi zaczynać się z dużej litery i nie może zawierać żadnych znaków specjalnych"
}

// Sprawdzenie czy Nazwisko jest podany
if (!req.body.Surname) {
    errors.nazwisko = "Nazwisko jest wymagane";
} else if (req.body.Surname.length > 50 || req.body.Surname.length <= 2) {
    errors.nazwisko = "Nazwisko nie może być dłuższe niż 50 znaków oraz krótsze niż 3 znaki";
} else if (!/^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(req.body.Surname)) {
    errors.nazwisko = "Nazwisko musi zaczynać się z dużej litery i nie może zawierać żadnych znaków specjalnych"
}

// Sprawdzenie czy Adres jest podany
if (!req.body.Adress) {
    errors.adres = "Adres jest wymagany";
} else if (!/^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s]+)\s(\d+\/\d+[A-Za-z]*)\s([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+)$/.test(req.body.Adress)) {
    errors.adres = "Adres musi być w formacie: ulica numer/mieszkanie miasto";
} else if (req.body.Adress.length > 70) {
    errors.adres = "Adres nie może być dłuższy niż 70 znaków";
}

// Sprawdzenie czy Zipcode jest podany
if (!req.body.Zipcode) {
    errors.kodpocztowy = "Kod pocztowy jest wymagany";
} else if (!/^\d{2}-\d{3}$/.test(req.body.Zipcode)) {
    errors.kodpocztowy = "Kod pocztowy musi być w formacie XX-XXX";
}

// Sprawdzenie czy Phone jest podany
if (!req.body.Phone) {
    errors.telefon = "Telefon jest wymagany";
} else if (!/^\+48\d{9}$/.test(req.body.Phone)) {
    errors.telefon = "Telefon musi być w formacie +48XXXXXXXXX";
}

// Sprawdzenie czy Numer Telefonu jest unikalny
connection.query("SELECT * FROM uzytkownicy WHERE Telefon = ?", [req.body.Phone], (err, phoneResults) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Error occurred while checking Phone uniqueness");
    }

    if (phoneResults.length > 0) {
        errors.telefon = "Numer telefonu: "+req.body.Phone+", już istnieje w naszej bazie danych";
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


    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Adress = req.body.Adress;
    const Zipcode = req.body.Zipcode;
    const Phone = req.body.Phone;
    const Login = req.body.Login;
    const Password = req.body.Password;

    bcrypt.hash(Password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query("INSERT INTO uzytkownicy (Imie, Nazwisko, Rola, Adres, Kod_Pocztowy, Telefon, Login, Haslo) VALUES(?,?,'user',?,?,?,?,?)",
            [Name, Surname, Adress, Zipcode, Phone, Login, hash],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const userId = result.insertId; // ID of the newly inserted user
                connection.query("INSERT INTO koszyk (ID_Uzytkownika) VALUES(?)",
                    [userId],
                    (err, cartResult) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    }
                );
            }
        );
    });
})
})
});

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