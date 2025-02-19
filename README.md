# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run application you need to:

In the **project** directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

In the **server** directory, you can run:

### `npm run dev`

This command will start the server.\
Open [http://localhost:5000](http://localhost:5000) to view the server in action.

This is necessary to perform backend operations and interact with the database.\


## The most important Features

Here are the three most important features:

<ol>
<li>Voice-Activated Navigation:</li>
The service will feature voice-operated navigation, enabling users to move between pages, access information, and perform actions within the system more easily and quickly. This feature is especially beneficial for visually impaired users.
<li>Custom Pizza Composition:</li>
Users can create their own pizza compositions, which will be stored in a database after approval by an administrator. These compositions can be used later to place orders online or by phone, using the pizza identifier or name.
<li>User Ingredient Preferences:</li>
Users can set their ingredient preferences, selecting favorite ingredients to see only pizzas containing those, and disliked ingredients to filter out pizzas containing them. These options can be toggled independently or used together, showing only pizzas with favorite ingredients and excluding those with disliked ones.
</ol>

## How it works?

Here's how it works:

<ul>
<li>To mark an ingredient as a favorite, the user must click on the button with the ingredient's name. After clicking, the button changes color to green, indicating that the ingredient is liked by the user.</li>
<li> If the user wants to exclude an ingredient that is already marked as liked, they must click the button again. After the second click, the button changes color to red, indicating that the ingredient is now considered disliked by the user.</li>
<li>If the user wants to remove preferences and unmark the ingredient as favorite or disliked, they must click the red button again. The button will then return to its original state, which is black, indicating that the ingredient is neutral and neither liked nor disliked.</li>
<li>After making changes, the ingredients must be saved by clicking the "Save Ingredients" button.</li>
</ul>

<div align="center">
<img src="https://github.com/ThunderStorm24/Helpful_pizzeria/blob/thunder/PhotoReadMe/Ingredients.png" alt="Tekst alternatywny" width="50%" height="auto">
</div>


The figure at the top presents a graphical representation of the function placed in the user's profile, allowing the marking of favorite, disliked, and neutral pizza ingredients. Ingredients marked as favorite are displayed as a green block, disliked ingredients are displayed as a red block, while neutral ingredients do not have any distinguishing color.

<ol>

<li>Menu for Unregistered Users – For unregistered users, the menu subpage only allows browsing information about available pizzas. They can see the names, ingredients, prices, and number of likes, and use the filtering function to quickly find a pizza that meets their expectations. Figure below shows the menu for unregistered users.</li>

<div align="center">
<img src="https://github.com/ThunderStorm24/Helpful_pizzeria/blob/thunder/PhotoReadMe/MenuNoLogged.png" alt="Tekst alternatywny" width="50%" height="auto">
</div>

When an unregistered user hovers the mouse cursor over the star in the "Favorites" column, they will be informed that they cannot add a favorite pizza, as shown in Figure below.

<div align="center">
<img src="https://github.com/ThunderStorm24/Helpful_pizzeria/blob/thunder/PhotoReadMe/MenuFavourite.png" alt="Tekst alternatywny" width="50%" height="auto">
</div>

The same applies to the liking function in the "Likes" column, as clicking the button will display a window informing the user that they need to be logged in. This is shown in Figure below.

<div align="center">
<img src="https://github.com/ThunderStorm24/Helpful_pizzeria/blob/thunder/PhotoReadMe/MenuLikes.png" alt="Tekst alternatywny" width="50%" height="auto">
</div>

<li>Menu for Logged-In Users – Figure below presents the interface for logged-in users, where the application menu offers a broader range of options. In addition to browsing information about pizzas, users can also add pizzas to the cart for later ordering. They have the ability to like pizzas, add pizzas to their favorites list, and create their own dish compositions. Furthermore, logged-in users can filter pizzas according to their favorite ingredients, which they have saved in their user profile as liked and disliked.</li>

<div align="center">
<img src="https://github.com/ThunderStorm24/Helpful_pizzeria/blob/thunder/PhotoReadMe/MenuLogged.png" alt="Tekst alternatywny" width="50%" height="auto">
</div>

</ol>