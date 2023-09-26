import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertLogin({ showAlert, setShowAlert }) {
  return (
    <Alert
      closeVariant="white"
      show={showAlert}
      onClose={() => setShowAlert(false)}
      dismissible
      className="fixed-top mx-auto col-11 col-md-6" // Dodaj klasę CSS, aby umieścić alert na górze strony i na środku
      style={{marginTop: "100px", background: "#4b1113", color: "#ea868f", borderColor: "#842029"}}
    >
      <Alert.Heading>Nie możesz tego zrobić!</Alert.Heading>
      <p>
        Musisz być zalogowany aby posiadać możliwość polubień danych pizz.
      </p>
    </Alert>
  );
}

export default AlertLogin;