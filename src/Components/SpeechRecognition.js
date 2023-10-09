import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Button from 'react-bootstrap/Button';
import  Modal  from "react-bootstrap/Modal";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';

function MySpeechRecognition() {

    const [pizzaData, setPizzaData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [selectedPizza, setSelectedPizza] = useState([]);

    const [imie,setImie] = useState('');
    const [nazwisko,setNazwisko] = useState('');
    const [numerTelefonu,setNumerTelefonu] = useState('');
    const [adres,setAdres] = useState('');
    const [kodPocztowy,setKodPocztowy] = useState('');
    const [dostawa,setDostawa] = useState('');


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

const userDataCommands = [
  {
    command: 'Imię *',
    callback: (name) => {
      if(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(name)){
      speak(`Twoje imię zostało zapisane jako ${name}`)
      setImie(name);
      } else {
        speak(`Niepoprawnę imię. Podaj swoję imię`)
      }
    }   
  },
  {
    command: 'Nazwisko *',
    callback: (surname) => {
      if(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(surname)){
      speak(`Twoje nazwisko zostało zapisane jako ${surname}`)
      setNazwisko(surname);
    } else {
      speak(`Niepoprawnę nazwisko. Podaj swoję nazwisko`)
    }
    } 
  },
  {
    command: 'Adres *',
    callback: (adres) => {
      if(/^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s]+)\s(\d+\/\d+[A-Za-z]*)\s([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+)$/.test(adres)){
        speak(`Twój adres został zapisany jako ${adres}`)
        setAdres(adres);
      }else{
        speak('Niepoprawny adres. Adres musi być w postaci nazwa ulicy, numer domu przez numer mieszkania i miasto');
      }
    }   //set the display to this response
  },
  {
    command: 'Kod pocztowy *',
    callback: (kod) => {
      if(/^\d{2}-\d{3}$/.test(kod)){
        speak(`Twój kod pocztowy został zapisany jako ${kod}`)
        setKodPocztowy(kod);
      }else{
        speak('Niepoprawny kod pocztowy. Kod pocztowy musi być w postaci 2 cyfr, myśłnik, 3 cyfry.');
      }
    }   //set the display to this response
  },
  {
    command: ['Telefon *','Numer Telefonu *'],
    callback: (phone) => {
      const noSpace = phone.replace(/\s+/g, '');
      if (/^\d{9}$/.test(noSpace)) {
        // Wyślij komunikat z zapisanym numerem telefonu
        speak(`Twój telefon został zapisany jako ${noSpace}`);
        
        // Zapisz numer telefonu z prefiksem '+48'
        setNumerTelefonu('+48' + noSpace);
      } else {
        // Jeśli numer telefonu nie spełnia wymagań, wyślij odpowiedni komunikat
        speak('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
      }
    }
  },
  {
    command: ['Dostawa Tak','Dostawa do domu','Chcę dostawę'],
    callback: () => {
      speak('Dostawa ustawiona na dowóz do domu')
      setDostawa('Tak');
    }
  },
  {
    command: ['Dostawa Nie','Odbiór osobisty','Nie chcę dostawy'],
    callback: () => {
      speak('Dostawa ustawiona na odbiór w restauracji')
      setDostawa('Nie');
    }
  },
  {
    command: ['Dane osobowe', 'Moje dane osobowe', 'Moje informacje', 'informacje o mnie', 'Moje dane', 'dane'],
    callback: () => {
      let response = 'Twoje dane osobowe to:';
      if (imie) {
        response += ` Imie: ${imie}.`;
      } else {
        response += ' Imie nie podano.';
      }

      if (nazwisko) {
        response += ` Nazwisko: ${nazwisko}.`;
      } else {
        response += ' Nazwisko nie podano.';
      }

      if (adres) {
        response += ` Adres: ${adres}.`;
      } else {
        response += ' Adres nie podano.';
      }

      if (kodPocztowy) {
        response += ` Kod pocztowy: ${kodPocztowy}.`;
      } else {
        response += ' Kod pocztowy nie podano.';
      }

      if (numerTelefonu) {
        response += ` Telefon: ${numerTelefonu}.`;
      } else {
        response += ' Telefon nie podano.';
      }

      console.log(numerTelefonu)
      speak(response);
    },
  },
  {
    command: [`Moje imię`,`Jakie jest moje imię`,`Jakie moje imię`,`Jakie imię`],
    callback: () => {
      if (imie) {
      speak(`${imie}`);
    } else{
      speak(`nie podano. Podaj imię w formie "imię [twoje imię]"`);
    }
  }
  },
  {
    command: [`Moje nazwisko`,`Jakie jest moje nazwisko`,`Jakie moje nazwisko`,`Jakie nazwisko`],
    callback: () => {
      if (nazwisko) {
      speak(`${nazwisko}`);
    } else{
      speak(`nie podano. Podaj nazwisko w formie "nazwisko [twoje nazwisko]"`);
    }
  }
  },
  {
    command: [`Mój adres`,`Jaki jest mój adres`,`Jaki mój adres`,`Jaki adres`],
    callback: () => {
      if (adres) {
      speak(`${adres}`);
    } else{
      speak(`nie podano. Podaj adres w formie "adres [twój adres]"`);
    }
  }
  },
  {
    command: [`Mój kod pocztowy`,`Jaki jest mój kod pocztowy`,`Jaki mój kod pocztowy`,`Jaki kod pocztowy`,`Jaki jest mój kod`,`Jaki mój kod`,`Jaki kod`],
    callback: () => {
      if (kodPocztowy) {
      speak(`${kodPocztowy}`);
    } else{
      speak(`nie podano. Podaj kod pocztowy w formie "kod pocztowy [twój kod pocztowy]"`);
    }
  }
  },
  {
    command: [`Mój telefon`,`Mój numer telefonu`,`Jaki jest mój numer telefonu`,`Jaki mój numer telefonu`,`Jaki numer telefonu`,`Jaki jest mój telefon`,`Jaki mój telefon`,`Jaki telefon`],
    callback: () => {
      if (numerTelefonu) {
      speak(`${numerTelefonu}`);
    } else{
      speak(`nie podano. Podaj telefon w formie "telefon [twój telefon]"`);
    }
  }
  },
  {
    command: [`Jaka dostawa`,`Jaką wybrałem dostawe`,`Dostawa`,`Jest Dostawa`],
    callback: () => {
      if (dostawa == "Tak") {
      speak(`Wybrałeś dowóz do domu`);
    } else if(dostawa =="Nie"){
      speak(`Wybrałeś obiór w restauracji`);
    } else {
      speak(`nie podano. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty"`);
    }
  }
  },
]

console.log(selectedPizza);

const pizzaCommands = pizzaData.flatMap((pizza) => {
  const commands = [`chcę pizzę ${pizza.Nazwa}`,`chcę pizza ${pizza.Nazwa}`, `dodaj ${pizza.Nazwa}`, `zapisz ${pizza.Nazwa}`,`chcę ${pizza.Nazwa}`];
  const skladnikiCommand = `składniki ${pizza.Nazwa}`;
  const cenaCommand = `cena ${pizza.Nazwa}`;
  const rozmiarCommand = `rozmiar ${pizza.Nazwa} *`

  return [
    {
      command: commands,
      callback: () => {
        // Sprawdzamy, czy już istnieje pizza o tej samej nazwie
        const existingPizzaIndex = selectedPizza.findIndex((selected) => selected.pizza === pizza.Nazwa);
        
        if (existingPizzaIndex === -1) {
          // Jeśli nie istnieje, dodajemy pizzę
          const cenaString = pizza.Cena;
          const ceny = cenaString.split('/');
          const cena = parseInt(ceny[0]);
          const updatedSelectedPizza = [
            ...selectedPizza,
            {
              number: selectedPizza.length,
              idpizzy: pizza.ID_Pizzy,
              pizza: pizza.Nazwa,
              rozmiar: 'Mała', // Tutaj ustaw odpowiedni rozmiar
              cena: cena
            },
          ];
          setSelectedPizza(updatedSelectedPizza);
          speak(`Dodaję pizzę ${pizza.Nazwa} (rozmiar Mała) do wybranych.`);
        } else {
          // Jeśli już istnieje pizza o tej samej nazwie, informujemy użytkownika
          speak(`Pozycja ${pizza.Nazwa} już istnieje w zamówieniu. Proszę zmienić rozmiar przez przykładowo rozmiar Capriciosa mała lub stworzyć kolejne zamówienie z tą samą pizzą.`);
        }
      }
      },
    {
      command: rozmiarCommand,
      callback: (size) => {

        let rozmiar = 'Mała'; // Domyślnie ustawiamy rozmiar na "Mała"
        const cenaString = pizza.Cena;
        const ceny = cenaString.split('/');
        let cena = ceny[0]; 
    
        // Sprawdzamy, czy komenda zawiera odpowiedni rozmiar
        if (size.includes('mała')) {
          rozmiar = 'Mała';
          cena = ceny[0];
        } else if (size.includes('średnia')) {
          rozmiar = 'Średnia';
          cena = ceny[1];
        } else if (size.includes('duża')) {
          rozmiar = 'Duża';
          cena = ceny[2];
        } else if (size.includes('gigant')) {
          rozmiar = 'Gigant';
          cena = ceny[3];
        } else {
          // Jeżeli rozmiar nie został zrozumiany, informujemy użytkownika
          speak('Nie rozumiem rozmiaru. Proszę powiedzieć przykładowo: "Capriciosa mała", "Capriciosa średnia", "Capriciosa duża", lub "Capriciosa gigant".');
          return; // Kończymy funkcję, aby nie aktualizować stanu
        }

        const parseCena = parseInt(cena);

        const updatedSelectedPizza = selectedPizza.map((selected) => {
          if (selected.pizza === pizza.Nazwa) {
            // Aktualizujemy tylko rozmiar wybranej pizzy
            return {
              ...selected,
              rozmiar: rozmiar,
              cena: parseCena,
            };
          }
          return selected;
        });
      
        setSelectedPizza(updatedSelectedPizza);
        speak(`Rozmiar pizzy ${pizza.Nazwa} zaktualizowano na ${rozmiar}.`);


      },
    },
    {
      command: [skladnikiCommand],
      callback: () => {
        speak(`Składniki pizzy ${pizza.Nazwa} to ${pizza.Skladniki}.`);
      },
    },
    {
      command: [cenaCommand],
      callback: () => {
        const sizes = ['Mała', 'Średnia', 'Duża', 'Gigant'];
        const cenaString = pizza.Cena;
        const ceny = cenaString.split('/');
        let cenaMessage = '';

        sizes.forEach((size, index) => {
          const cena = ceny[index];
          cenaMessage += `${size} pizza: ${cena} złoty. `;
        });

        speak(cenaMessage);
      },
    },
  ];
});

  const commands = [
    {
      command: [`komendy`],
      callback: () => {
        speak(`Aby zobaczyć komendy powiedz:
        1. komendy menu.
        2. komendy zamówienia.
        3. komendy wybranych pizzy.
        4. komendy danych osobowych.
        Jeżeli potrzebujesz pomocy powiedz pomoc.`);
      }
    },
    {
      command: [`komendy wybranych pizzy`],
      callback: () => {
        speak(`Aby dowiedzieć się o swoich pizzach to:
        1. Moje pizze.`);
      }
    },
    {
      command: [`komendy danych osobowych`],
      callback: () => {
        speak(`Aby dowiedzieć się o swoich podanych danych to:
        1. Moje dane osobowe.
        2. Moje imię.
        3. Moję nazwisko.
        4. Mój adres.
        5. Mój kod pocztowy.
        6. Mój numer telefonu.`);
      }
    },
    {
      command: [`komendy menu`],
      callback: () => {
        speak(`Aby dowiedzieć się o pizzach to:
        1. menu.
        2. składniki [Nazwa pizzy].
        3. cena [Nazwa pizzy].`);
      }
    },
    {
      command: [`komendy zamówienia`],
      callback: () => {
        speak(`Aby złożyć zamówienie to:
        1. Imię [Twoje imię].
        2. Nazwisko [Twoje nazwisko].
        3. Adres [Twój adres].
        4. Kod pocztowy [Twój kod pocztowy].
        5. Numer telefonu [Twój numer telefonu].
        6. dodaj [Nazwa pizzy].`);
      }
    },
    {
      command: [`zadzwoń`,`kontakt`],
      callback: () => {
        speak(`Nasz numer telefonu to: 
        1. Telefon komórkowy: +48 632 532 123.
        2. Telefon komórkowy: +48 332 232 723.`);
      }
    },
    {
      command: [`mail`,`e-mail`],
      callback: () => {
        speak(`Nasz mail to: 
        Roberto@gmail.com.`);
      }
    },
    {
      command: [`Zamówienie dla *`,`Status dla *`],
      callback: (phone) => {
        const noSpace = phone.replace(/\s+/g, '');
        if (/^\d{9}$/.test(noSpace)) {
          // Wyślij komunikat z zapisanym numerem telefonu
          setNumerTelefonu('+48' + noSpace);
          Axios.get(`/glosowezamowienia/+48${noSpace}`)
          .then((response) => {
            const orders = response.data; // Tutaj otrzymasz tablicę z zamówieniami
            console.log(orders);
        
            if (orders.length === 0) {
              console.log("Brak zamówień dla tego numeru telefonu.");
              speak(`Brak zamówień dla tego numeru telefonu.`);
              return;
            }
        
            // Przeglądanie i wyświetlanie statusu każdego zamówienia
            orders.forEach((order, index) => {
              const status = order.Status;
              console.log(`Zamówienie ${index + 1}: Status zamówienia to ${status}`);
              speak(`Zamówienie ${index + 1}: Status zamówienia to ${status}`);
            });
          })
          
        } else {
          // Jeśli numer telefonu nie spełnia wymagań, wyślij odpowiedni komunikat
          speak('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
        }
      }
    },
    {
        command: [`Jakie są pizze`,`pizzę`,`pizze`,`Jakie są pizzę`,`menu`,`Wszystkie pizze`,`Wszystie pizzę`],
        callback: () => {
          const pizzaList = pizzaData.map((pizza) => `${pizza.ID_Pizzy} ${pizza.Nazwa}`).join(', '); // Tworzy listę nazw pizz razem z ID, oddzielonych przecinkami
          speak(`Dostępne pizze to: ${pizzaList}`);
        }
      },
      {
        command: [`jakie brałem pizzę`,`Jakie wybrałem pizze`,`Jakie wybrałem pizzę`,`Jakie mam pizze`,`Jakie mam pizzę`,`Moja lista`,`Moje pizze`,`Moje pizzę`,`Ja wybrałem pizzę`,`Jaki wybrałem pizzę`],
        callback: () => {
          if (selectedPizza && selectedPizza.length > 0) {
            const selectedPizzaInfo = selectedPizza.map((pizza) => {
              return `${pizza.pizza} (rozmiar ${pizza.rozmiar}) (cena ${pizza.cena})`;
            }).join(', ');
            speak(`Wybrałeś: ${selectedPizzaInfo}`);
          } else {
            speak(`Nie wybrałeś jeszcze żadnej pizzy.`);
          }
        }
      },
      {
        command: ['złóż zamówienie','zamów'],
        callback: () => {
          if (selectedPizza.length === 0) {
            speak('Nie wybrano żadnej pizzy. Proszę wybrać przynajmniej jedną pizzę do zamówienia w forme "Chcę [Nazwa pizzy]".');
          } else if (!imie) {
            speak('Brakuje imienia. Proszę podaj swoje imię w formie "Imie [Twoje Imię]".');
          } else if (!nazwisko) {
            speak('Brakuje nazwiska. Proszę podaj swoje nazwisko w formie "Nazwisko [Twoje Nazwisko]".');
          } else if (!numerTelefonu) {
            speak('Brakuje numeru telefonu. Proszę podaj swój numer telefonu w formie "Numer telefonu [Twój Numer Telefonu]".');
          } else if (!adres) {
            speak('Brakuje adresu. Proszę podaj swój adres w formie "Adres [Twój Adres]".');
          } else if (!kodPocztowy) {
            speak('Brakuje kodu pocztowego. Proszę podaj swój kod pocztowy w formie "Kod pocztowy [Twój kod pocztowy]".');
          } else if (!dostawa) {
            speak('Brakuje formy dostawy. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty".');
          } else {
            speak('Dziękuję! Zamówienie zostało złożone.');
            Axios.post('/ordervocally', {
              selectedPizzas: selectedPizza,
              Imie: imie,
              Nazwisko: nazwisko,
              Telefon: numerTelefonu,
              Adres: adres,
              Kod: kodPocztowy,
              Dostawa: dostawa,
            })
            .then((response) => {
            console.log('Odpowiedź z serwera:', response.data);
            })
            .catch((error) => {
            console.error('Błąd podczas wysyłania zamówienia:', error);
            });
          }
          }
        },
    {
        command: ['info','informacja','pomoc','pomóż'],
        callback: () => {
          speak('Jeżeli chcesz poznać nasz numer telefonu, powiedz kontakt. Jeżeli chcesz usłyszeć pizze jakie posiadamy, powiedz menu. Jeżeli chcesz usłyszeć skład i cenę danej pizzy, powiedz składnik Nazwa pizzy lub cena Nazwa pizzy. Jeżeli chcesz złożyć zamówienie podaj wszystkie dane osobowe z komendy zamówienia, a gdy wszystkie dane osobowe zostaną podane a pizze wybrane to powiedz zamów. Jeżeli chcesz poznac komendy to powiedz komendy. To wszystko odnośnie pomocy.');
        }
      },
    {
      command: ['wyczyść','odśwież','zresetuj',
                'clear','reset','refresh'],
      callback: ({resetTranscript}) => resetTranscript()
    },
    {
      command: ['zatrzymaj',
                'stop', `przestań`],
      callback: () => {
        speak();
        setIsListening(false);
        SpeechRecognition.stopListening()
      }
    },
    ...userDataCommands,
    ...pizzaCommands
  ]

  
  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
        speak("Witaj w obsłudze głosowej, Powiedz info lub komendy dla pomocy")
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

  let sayTimeout = null; 

  const speak = (text, rate = 1.0) => {
    const synthesis = window.speechSynthesis;
  
    if (synthesis.speaking) {
      synthesis.cancel();
  
      if (sayTimeout !== null) {
        clearTimeout(sayTimeout);
      }
  
      sayTimeout = setTimeout(() => {
        speak(text);
      }, 100);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      synthesis.speak(utterance);
    }
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