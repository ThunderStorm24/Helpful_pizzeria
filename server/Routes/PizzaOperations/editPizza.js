const express = require("express");
const connection = require('./../db');

const router = express.Router();

router.post("/EdytujPizze", async (req, res) => {

  const errors = {};

    // Sprawdzenie czy Nazwa pizzy jest podana
    if (!req.body.name) {
        errors.nazwa = "Nazwa pizzy jest wymagana";
    }

    connection.query("SELECT * FROM pizze WHERE Nazwa = ? AND ID_Pizzy != ?", [req.body.name, req.body.ID], (err, results) => {
        if (err) {
          console.error('Błąd zapytania do bazy danych: ' + err.message);
          res.status(500).json({ error: 'Błąd serwera' });
        } else if (results.length > 0) {
          errors.login = "Pizza: "+req.body.name+", już istnieje w naszej bazie danych, spróbuj innej nazwy pizzy";
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
    }



    const { ID, name, checkedItems, priceSmall, priceMedium, priceLarge, priceGiant, pizzaStatus } = req.body;
    console.log("Received request:", req.body);
    let existingSkladniki = []; // Declare the variable here to make it accessible in the entire function
    // Step 1: Update the Pizza's name for the given ID
    try {
        const updatePizzaQuery = "UPDATE pizze SET Nazwa = ? WHERE ID_Pizzy = ?";
        connection.query(updatePizzaQuery, [name, ID]);
      } catch (error) {
        console.error("Error updating pizza name:", error);
        return res.status(500).json({ error: "Failed to update pizza name." });
      }
  
    // Step 2: Handle the changes in the pizza's ingredients (składniki)
  
    // Retrieve the current list of składniki associated with the pizza
    const selectSkladnikiQuery = "SELECT ID_Skladnika FROM pizze_skladniki WHERE ID_Pizzy = ?";
    try {
        const result = connection.query(selectSkladnikiQuery, [ID]);
        const rows = result[0];
        if (!rows || rows.length === 0) {
          // Handle the case when no rows are returned (empty result)
          console.log("No existing ingredients found for the pizza with ID:", ID);
          // You may choose to return an appropriate response or take another action here
        } else {
          existingSkladniki = rows.map((row) => row.ID_Skladnika);
        }
      } catch (error) {
        console.log("Error fetching existing ingredients:", error);
        return res.status(500).json({ error: "Failed to fetch existing ingredients for the pizza." });
      }
  
    // Handle the changes in składniki
    const skladnikiToAdd = checkedItems.filter((skladnik) => !existingSkladniki.includes(skladnik));
    const skladnikiToDelete = existingSkladniki.filter((skladnik) => !checkedItems.includes(skladnik));

    console.log("Skladniki to Add:"+req.body.checkedItems);
    if (skladnikiToAdd.length > 0) {
        try {
          const skladnikiToAddFormatted = skladnikiToAdd.map((skladnik) => `'${skladnik}'`).join(',');
          const selectSkladnikiIDsQuery = `SELECT ID_Skladnika FROM skladniki WHERE Nazwa IN (${skladnikiToAddFormatted})`;
      
          // Wykonaj zapytanie do bazy danych
          connection.query(selectSkladnikiIDsQuery, (error, results) => {
            if (error) {
              console.error("Błąd zapytania SQL: ", error);
              return;
            }
      
            // Upewnij się, że otrzymany wynik jest tablicą
            if (Array.isArray(results)) {
              const skladnikiIDsResult = results.map((row) => row.ID_Skladnika);
              console.log("skladnikiIDsResult:", skladnikiIDsResult);

              ///////////////////////////

              // Step 3:
      if (skladnikiIDsResult.length > 0) {
        try {
          connection.beginTransaction(async (err) => {
            if (err) {
              console.error("Błąd rozpoczęcia transakcji: ", err);
              return;
            }
      
            const ID_Pizzy = ID;
      
            try {
              // Dodaj nowe ID_Skladnika do tabeli pizze_skladniki
              for (const ID_Skladnika of skladnikiIDsResult) {
                await connection.query(
                  "INSERT INTO pizze_skladniki (ID_Pizzy, ID_Skladnika) VALUES (?, ?) ON DUPLICATE KEY UPDATE ID_Pizzy = ID_Pizzy",
                  [ID_Pizzy, ID_Skladnika]
                );
              }
      
              // Usuń zbędne wpisy
              await connection.query(
                "DELETE FROM pizze_skladniki WHERE ID_Pizzy = ? AND ID_Skladnika NOT IN (?)",
                [ID_Pizzy, skladnikiIDsResult]
              );
      
              connection.commit((commitError) => {
                if (commitError) {
                  console.error("Błąd zatwierdzania transakcji: ", commitError);
                  connection.rollback(() => {
                    console.log("Transakcja została cofnięta.");
                  });
                } else {
                  console.log("Transakcja została pomyślnie zatwierdzona.");
                }
              });
            } catch (transactionError) {
              console.error("Błąd transakcji: ", transactionError);
              connection.rollback(() => {
                console.log("Transakcja została cofnięta.");
              });
            }
          });
        } catch (error) {
          console.error("Błąd zapytania SQL: ", error);
        }
      }

              //////////////////////////
              // Kontynuuj z wykorzystaniem wyników...
            } else {
              console.error("Błąd: Otrzymany wynik nie jest tablicą.");
            }
          });
        } catch (error) {
          console.error("Błąd zapytania SQL: ", error);
        }
      }
  
    // Step 4: Update the prices for all sizes of the pizza (Cena)
    try {
      const updatePricesQuery =
        "UPDATE rozmiar_pizze SET Cena = CASE " +
        "WHEN ID_Rozmiar = '1' THEN ? " +
        "WHEN ID_Rozmiar = '2' THEN ? " +
        "WHEN ID_Rozmiar = '3' THEN ? " +
        "WHEN ID_Rozmiar = '4' THEN ? " +
        "END " +
        "WHERE ID_Pizzy = ?";
  
      connection.query(updatePricesQuery, [priceSmall, priceMedium, priceLarge, priceGiant, ID]);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update pizza prices." });
    }

    console.log(pizzaStatus)

    if (pizzaStatus === "Odrzucono") {
      console.log("Pizza jest odrzucona, update na oczekuje")
      try {
          const updateStatusQuery = "UPDATE pizze SET Status = 'Oczekuje' WHERE ID_Pizzy = ?";
          connection.query(updateStatusQuery, [ID]);
      } catch (error) {
          console.error("Error updating pizza status:", error);
          return res.status(500).json({ error: "Failed to update pizza status." });
      }
  } else {
    console.log("Pizza jest zaakceptowana/oczekujaca wszystko jest git")
  }

    console.log("DZIALAAA");
    res.status(201).send({ message: 'Pizza zedytowana pomyślnie!!!.' });
  });
  });

module.exports = router;