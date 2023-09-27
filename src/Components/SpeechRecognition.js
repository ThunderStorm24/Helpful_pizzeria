import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Button from 'react-bootstrap/Button';
import  Modal  from "react-bootstrap/Modal";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';

function MySpeechRecognition() {

    const [pizzaData, setPizzaData] = useState([]);
    const [selectedPizza, setSelectedPizza] = useState([]);

  const [isListening, setIsListening] = useState(false);
  const [browser, setBrowser] = useState(true);

  useEffect(() => {
    Axios.get('/pizze')
      .then((response) => {
        setPizzaData(response.data);
      })
      .catch((error) => {
        console.error('Błąd podczas pobierania danych z serwera:', error);
      });
  }, []);
console.log(pizzaData)

  const pizzaCommands = pizzaData.map((pizza) => ({
    command: [`chcę pizzę ${pizza.Nazwa}`],
    callback: () => {
        const updatedSelectedPizza = [...selectedPizza, pizza];
        setSelectedPizza(updatedSelectedPizza);
        speak(`Dodaję pizzę ${pizza.Nazwa} do wybranych.`);
    },
  }));

  const commands = [
    {
        command: [`Jakie są pizze`],
        callback: () => {
          const pizzaList = pizzaData.map((pizza) => `ID: ${pizza.ID_Pizzy}, Nazwa: ${pizza.Nazwa}`).join(', '); // Tworzy listę nazw pizz razem z ID, oddzielonych przecinkami
          speak(`Dostępne pizze to: ${pizzaList}`);
        }
      },
      {
        command: [`Jakie wybrałem pizze`,`Jakie wybrałem pizzę`],
        callback: () => {
            if (selectedPizza && selectedPizza.length > 0) {
                const selectedPizzaNames = selectedPizza.map((pizza) => pizza.Nazwa).join(', ');
                speak(`Wybrałeś: ${selectedPizzaNames}`);
              } else {
                speak(`Nie wybrałeś jeszcze żadnej pizzy.`);
              }
        }
      },
    {
        command: ['info','informacja','pomoc'],
        callback: () => {
          speak('Jeżeli chcesz poznać nasz numer telefonu, powiedz numer telefonu' +
          'Jeżeli chcesz usłyszeć pizze jakie posiadamy, powiedz pizze' +
          'Jeżeli chcesz usłyszeć skład i cenę danej pizzy, powiedz konkretną pizze' +
          'To wszystko odnośnie pomocy');
        }
      },
    {
      command: ['menu','jedzenie','ceny','głodny','jeść',            
                'food','hungry','price','eat'],
      callback: () => {
        speak('Kieruję do menu.');
      }
    },
    {
      command: ['wyczyść','odśwież','zresetuj',
                'clear','reset','refresh'],
      callback: ({resetTranscript}) => resetTranscript()
    },
    {
      command: ['zatrzymaj',
                'stop'],
      callback: () => {
        setIsListening(false);
        SpeechRecognition.stopListening()
      }
    },
    ...pizzaCommands
  ]

  
  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
        speak("Witaj w obsłudze głosowej, Powiedz info dla pomocy")
      SpeechRecognition.startListening({continuous: true});
      setIsListening(true);
    }
  }

  const {
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const{ transcript , resetTranscript} = useSpeechRecognition ({ commands });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setBrowser(false);
    }
  }, [browserSupportsSpeechRecognition]);

  const speak = (text) => {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
  };

  return (
    <div>
      {browser ? (
        <img
          className={`m-1 microphone ${isListening ? 'active-microphone' : ''}`}
          src="Microphone.png"
          alt="Microphone"
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          onClick={toggleListening}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleListening();
            }
          }}
          tabIndex={0}
          role="button"
        />
      ) : (
        <div>
          <div className="recognize">Browser doesn't support speech recognition.</div>
        </div>
      )}

<Modal
    show={isListening}
    onHide={() => {
      setIsListening(false);
      SpeechRecognition.stopListening();
    }}
    dialogClassName="modal-90w"
    aria-labelledby="example-custom-modal-styling-title"
  >
    <Modal.Header closeButton style={{backgroundColor: '#444444' , color: 'white'}}>
      <Modal.Title id="example-custom-modal-styling-title">
        Co mówisz
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{backgroundColor: '#141414' , color: 'white'}}>
      <p>
        {transcript}
      </p>
      <Button onClick={toggleListening} style={{margin: '5px'}}>{isListening ? 'Stop' : 'Start'}</Button>
      <Button onClick={resetTranscript} style={{margin: '5px'}}>Reset</Button>
    </Modal.Body>
  </Modal>
    </div>
  );
}

export default MySpeechRecognition;