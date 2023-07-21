const express = require("express");
const connection = require('./db');

const router = express.Router();

router.post('/ZamowPizze', (req, res) => {

    const { pizzas, orderData, koszykData } = req.body;
  
    // Step 1: Insert order data into the 'zamowienia' table without ID_Uzytkownika, Cena, Dostawa, Status, and Data_Zlozenia
    connection.query('INSERT INTO zamowienia SET ?', orderData, (err, result) => {
      if (err) {
        console.error('Error inserting order data:', err);
        return res.status(500).json({ error: 'Failed to submit the order.' });
      }
  
      const orderId = result.insertId; // Get the automatically generated ID_Zamowienia
  
      // Step 2: Insert pizza data into the 'zamówienia_pizzy' table using the obtained orderId
      for (const pizza of pizzas) {
        const { ID_Pizzy, ID_Kombinacji, Rozmiar_Pizzy, Cena } = pizza;
  
        const pizzaData = {
          ID_Zamowienia: orderId, // Use the generated ID_Zamowienia here
          ID_Pizzy: ID_Pizzy,
          Rozmiar_Pizzy: Rozmiar_Pizzy,
          ID_Kombinacji: ID_Kombinacji,
          Cena: Cena,
        };
  
        connection.query('INSERT INTO zamowienia_pizza SET ?', pizzaData, (err, result) => {
          if (err) {
            console.error('Error inserting pizza data:', err);
          }
        });
      }

      // Step 3: Delete all elements from the 'pizze_koszyk' table based on the ID_Koszyka
    connection.query('DELETE FROM pizze_koszyk WHERE ?', koszykData, (err, result) => {
      if (err) {
        console.error('Error deleting items from pizze_koszyk:', err);
      }
    });

  
      return res.status(200).json({ message: 'Order submitted successfully!', orderId });
    });
  });
 
  

module.exports = router;