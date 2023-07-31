const express = require("express");
const connection = require('./db');

const router = express.Router();

router.post("/EdytujPizze", async (req, res) => {
    const { ID, name, checkedItems, priceSmall, priceMedium, priceLarge, priceGiant } = req.body;
    console.log("Received request:", req.body);
    let existingSkladniki = []; // Declare the variable here to make it accessible in the entire function
  
    // Step 1: Update the Pizza's name for the given ID
    try {
        const updatePizzaQuery = "UPDATE pizze SET Nazwa = ? WHERE ID_Pizzy = ?";
        await connection.query(updatePizzaQuery, [name, ID]);
      } catch (error) {
        console.error("Error updating pizza name:", error);
        return res.status(500).json({ error: "Failed to update pizza name." });
      }
  
    // Step 2: Handle the changes in the pizza's ingredients (składniki)
  
    // Retrieve the current list of składniki associated with the pizza
    const selectSkladnikiQuery = "SELECT ID_Skladnika FROM pizze_skladniki WHERE ID_Pizzy = ?";
    try {
        const result = await connection.query(selectSkladnikiQuery, [ID]);
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
  
      await connection.query(updatePricesQuery, [priceSmall, priceMedium, priceLarge, priceGiant, ID]);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update pizza prices." });
    }

    console.log("DZIALAAA");
    res.status(201).send({ message: 'Pizza zedytowana pomyślnie!!!.' });
  });

module.exports = router;