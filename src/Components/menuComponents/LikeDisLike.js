import React from 'react';

const PizzaActions = ({
  pizza,
  ID,
  handleLikeClick,
  likeButtonStates,
  handleDislikeClick,
  disLikeButtonStates,
  userLikes,
  Role,
  showNotification,
}) => {
  return (
    <td className="d-flex justify-content-center">
      <div className="d-flex">
        <div className="likeBorder">
          <button
            className={`btn like-btn d-flex flex-column`}
            id="green"
            onClick={() => {
              if (Role === 'admin' || Role === 'user') {
                handleLikeClick(pizza.ID_Pizzy);
              } else {
                showNotification(); // Wywołanie funkcji pokazującej powiadomienie
              }
            }}
          >
            <i
              className={`fa fa-thumbs-up fa-lg ${likeButtonStates[pizza.ID_Pizzy] ? 'green' : 'none'} ${
                userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak') ? 'green' : 'none'
              }`}
              aria-hidden="true"
            ></i>
            <span
              className={`ms-1 ${likeButtonStates[pizza.ID_Pizzy] ? 'green' : 'none'} ${
                userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Tak') ? 'green' : 'none'
              }`}
            >
              {userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Tak') ? (
                userLikes.filter(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Tak').length
              ) : (
                0
              )}
            </span>
          </button>
        </div>
        <div className="ms-2 likeBorder">
          <button
            className={`btn dislike-btn d-flex flex-column`}
            id="red"
            onClick={() => {
              if (Role === 'admin' || Role === 'user') {
                handleDislikeClick(pizza.ID_Pizzy);
              } else {
                showNotification(); // Wywołanie funkcji pokazującej powiadomienie
              }
            }}
          >
            <i
              className={`fa fa-thumbs-down fa-lg ${disLikeButtonStates[pizza.ID_Pizzy] ? 'red' : 'none'} ${
                userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie') ? 'red' : 'none'
              }`}
              aria-hidden="true"
            ></i>
            <span
              className={`ms-1 ${disLikeButtonStates[pizza.ID_Pizzy] ? 'red' : 'none'} ${
                userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.ID_Uzytkownika === ID && like.Polubienie === 'Nie') ? 'red' : 'none'
              }`}
            >
              {userLikes.some(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Nie') ? (
                userLikes.filter(like => like.ID_Pizzy === pizza.ID_Pizzy && like.Polubienie === 'Nie').length
              ) : (
                0
              )}
            </span>
          </button>
        </div>
      </div>
    </td>
  );
};

export default PizzaActions;