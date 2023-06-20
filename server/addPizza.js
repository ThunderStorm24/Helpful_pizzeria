const express = require("express");
const connection = require('./db');

const router = express.Router();

router.post("/DodajPizzeOryginalna", async (req, res) => {

    const errors = {};

    // Sprawdzenie czy Nazwa pizzy jest podana
    if (!req.body.name) {
        errors.nazwa = "Nazwa pizzy jest wymagana";
    }

    // Sprawdzenie czy ID użytkownika jest podane i czy jest to liczba całkowita dodatnia
    if (!req.body.ID || isNaN(req.body.ID) || req.body.ID <= 0) {
        errors.id_uzytkownika = "Nieprawidłowe ID użytkownika";
    }

// Sprawdzenie, czy checkedItems jest podane, czy jest to tablica i czy przynajmniej dwa checkboxy są zaznaczone
if (!req.body.checkedItems || !Array.isArray(req.body.checkedItems) || req.body.checkedItems.length < 2) {
    errors.checkedItems = "Zaznacz co najmniej dwa składniki";
}

    // Sprawdzenie czy cena ma poprawny format i czy jest to liczba dodatnia
    if (!req.body.priceSmall || isNaN(req.body.priceSmall) || req.body.priceSmall <= 0) {
        errors.cena_small = "Nieprawidłowa cena dla rozmiaru small";
    }
    if (!req.body.priceMedium || isNaN(req.body.priceMedium) || req.body.priceMedium <= 0) {
        errors.cena_medium = "Nieprawidłowa cena dla rozmiaru medium";
    }
    if (!req.body.priceLarge || isNaN(req.body.priceLarge) || req.body.priceLarge <= 0) {
        errors.cena_large = "Nieprawidłowa cena dla rozmiaru large";
    }
    if (!req.body.priceGiant || isNaN(req.body.priceGiant) || req.body.priceGiant <= 0) {
        errors.cena_giant = "Nieprawidłowa cena dla rozmiaru giant";
    }

    // Jeśli są jakieś błędy to zwróć je w odpowiedzi
    if (Object.keys(errors).length > 0) {
        res.status(400).send({ errors: Object.values(errors) });
        console.log(errors)
        return;
    } else {
        const message = "Pizza o nazwie: <b>'"+req.body.name+"'</b> ze składnikami: '"+req.body.checkedItems+"' z cenami: "+"Mała: "+req.body.priceSmall+"zł,"+" Średnia: "+req.body.priceMedium+"zł,"+" Duża: "+req.body.priceLarge+"zł i"+" Gigant: "+req.body.priceGiant+"zł"+" została dodana pomyślnie!!!";
        res.send(message);
    }

   /* try {
         const ID_Uzytkownika = req.body.ID;
        const name = req.body.name;
        const checkedItems = req.body.checkedItems;
        const priceSmall = req.body.priceSmall;
        const priceMedium = req.body.priceMedium;
        const priceLarge = req.body.priceLarge;
        const priceGiant = req.body.priceGiant;
        console.log(ID_Uzytkownika)
        console.log(name)
        console.log(checkedItems)

        connection.query('INSERT INTO pizze (Nazwa, Custom, Status) VALUES (?, ?, ?)', [name, 'Nie', 'Zatwierdzona'], (error, results, fields) => {
            if (error) throw error;
            const pizzaId = results.insertId;
          
            // dodanie relacji między pizzą a składnikami w tabeli pizze_skladniki
            checkedItems.forEach((itemName) => {
              connection.query('SELECT ID_Skladnika FROM skladniki WHERE Nazwa = ?', [itemName], (error, results, fields) => {
                if (error) throw error;
                const skladnikId = results[0].ID_Skladnika;
                connection.query('INSERT INTO pizze_skladniki (ID_Pizzy, ID_Skladnika) VALUES (?, ?)', [pizzaId, skladnikId], (error, results, fields) => {
                  if (error) throw error;
                });
              });
            });
          
            // dodanie relacji między pizzą a użytkownikiem w tabeli pizze_uzytkownicy
            connection.query('INSERT INTO pizze_uzytkownicy (ID_Pizzy, ID_Uzytkownika, Ocena) VALUES (?, ?, ?)', [pizzaId, ID_Uzytkownika, 0], (error, results, fields) => {
              if (error) throw error;
            });
          
            // dodanie cen do tabeli rozmiar_pizze
            connection.query('INSERT INTO rozmiar_pizze (ID_Rozmiar, ID_Pizzy, Cena) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)', [1, pizzaId, priceSmall, 2, pizzaId, priceMedium, 3, pizzaId, priceLarge, 4, pizzaId, priceGiant], (error, results, fields) => {
              if (error) throw error;
            });
          });

          

        res.status(201).send({ message: 'Pizza dodana pomyślnie!!!.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Wystąpił błąd podczas dodawania pizzy.' });
    }
    */
});

router.post("/DodajPizzeCustomowa", async (req, res) => {

    const errors = {};

    // Sprawdzenie czy Nazwa pizzy jest podana
    if (!req.body.name) {
        errors.nazwa = "Nazwa pizzy jest wymagana";
    }

    // Sprawdzenie czy ID użytkownika jest podane i czy jest to liczba całkowita dodatnia
    if (!req.body.ID || isNaN(req.body.ID) || req.body.ID <= 0) {
        errors.id_uzytkownika = "Nieprawidłowe ID użytkownika";
    }

// Sprawdzenie, czy checkedItems jest podane, czy jest to tablica i czy przynajmniej dwa checkboxy są zaznaczone
if (!req.body.checkedItems || !Array.isArray(req.body.checkedItems) || req.body.checkedItems.length < 2) {
    errors.checkedItems = "Zaznacz co najmniej dwa składniki";
}

    // Sprawdzenie czy cena ma poprawny format i czy jest to liczba dodatnia
    if (!req.body.priceSmall || isNaN(req.body.priceSmall) || req.body.priceSmall <= 0) {
        errors.cena_small = "Nieprawidłowa cena dla rozmiaru small";
    }
    if (!req.body.priceMedium || isNaN(req.body.priceMedium) || req.body.priceMedium <= 0) {
        errors.cena_medium = "Nieprawidłowa cena dla rozmiaru medium";
    }
    if (!req.body.priceLarge || isNaN(req.body.priceLarge) || req.body.priceLarge <= 0) {
        errors.cena_large = "Nieprawidłowa cena dla rozmiaru large";
    }
    if (!req.body.priceGiant || isNaN(req.body.priceGiant) || req.body.priceGiant <= 0) {
        errors.cena_giant = "Nieprawidłowa cena dla rozmiaru giant";
    }

    // Jeśli są jakieś błędy to zwróć je w odpowiedzi
    if (Object.keys(errors).length > 0) {
        res.status(400).send({ errors: Object.values(errors) });
        console.log(errors)
        return;
    } else {
        const message = "Pizza o nazwie: <b>'"+req.body.name+"'</b> ze składnikami: '"+req.body.checkedItems+"' z cenami: "+"Mała: "+req.body.priceSmall+"zł,"+" Średnia: "+req.body.priceMedium+"zł,"+" Duża: "+req.body.priceLarge+"zł i"+" Gigant: "+req.body.priceGiant+"zł"+" została zgłoszona do administracji pomyślnie!!!";
        res.send(message);
    }

    try {
         const ID_Uzytkownika = req.body.ID;
        const name = req.body.name;
        const checkedItems = req.body.checkedItems;
        const priceSmall = req.body.priceSmall;
        const priceMedium = req.body.priceMedium;
        const priceLarge = req.body.priceLarge;
        const priceGiant = req.body.priceGiant;
        console.log(ID_Uzytkownika)
        console.log(name)
        console.log(checkedItems)

         connection.query('INSERT INTO pizze (Nazwa, Custom, Status) VALUES (?, ?, ?)', [name, 'Tak', 'Oczekuje'], (error, results, fields) => {
            if (error) throw error;
            const pizzaId =  results.insertId;
          
            // dodanie relacji między pizzą a składnikami w tabeli pizze_skladniki
            checkedItems.forEach((itemName) => {
              connection.query('SELECT ID_Skladnika FROM skladniki WHERE Nazwa = ?', [itemName], (error, results, fields) => {
                if (error) throw error;
                const skladnikId = results[0].ID_Skladnika;
                connection.query('INSERT INTO pizze_skladniki (ID_Pizzy, ID_Skladnika) VALUES (?, ?)', [pizzaId, skladnikId], (error, results, fields) => {
                  if (error) throw error;
                });
              });
            });
          
            // dodanie relacji między pizzą a użytkownikiem w tabeli pizze_uzytkownicy
            connection.query('INSERT INTO pizze_uzytkownicy (ID_Pizzy, ID_Uzytkownika, Ocena) VALUES (?, ?, ?)', [pizzaId, ID_Uzytkownika, 0], (error, results, fields) => {
              if (error) throw error;
            });
          
            // dodanie cen do tabeli rozmiar_pizze
            connection.query('INSERT INTO rozmiar_pizze (ID_Rozmiar, ID_Pizzy, Cena) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)', [1, pizzaId, priceSmall, 2, pizzaId, priceMedium, 3, pizzaId, priceLarge, 4, pizzaId, priceGiant], (error, results, fields) => {
              if (error) throw error;
            });
          });

          
        console.log("Git")
    } catch (error) {
        console.error(error);
    }
    
});

module.exports = router;