import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Button, Modal, Alert } from 'react-bootstrap';
import { Navigate, useNavigate } from "react-router-dom";
import Axios from 'axios';

function MySpeechRecognition() {

  const [pizzaData, setPizzaData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState([]);

  const [microphone, setMicrophone] = useState(true);
  const [volume, setVolume] = useState(true);

  const maxFontSize = 30;
  const [fontSize, setFontSize] = useState(16);

  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [numerTelefonu, setNumerTelefonu] = useState('');
  const [adres, setAdres] = useState('');
  const [kodPocztowy, setKodPocztowy] = useState('');
  const [dostawa, setDostawa] = useState('');

  const [message, setMessage] = useState('');
  const [userMessage, setUserMessage] = useState('...');

  const [showListeningModal, setShowListeningModal] = useState(false);
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
        if (/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(name)) {
          speak(`Twoje imię zostało zapisane jako ${name}`)
          setMessage(`Twoje imię zostało zapisane jako ${name}`);
          setImie(name);
        } else {
          speak(`Niepoprawnę imię. Podaj swoję imię`)
          setMessage(`Niepoprawnę imię. Podaj swoję imię`);
        }
      }
    },
    {
      command: 'Nazwisko *',
      callback: (surname) => {
        if (/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ][a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(surname)) {
          speak(`Twoje nazwisko zostało zapisane jako ${surname}`)
          setMessage(`Twoje nazwisko zostało zapisane jako ${surname}`);
          setNazwisko(surname);
        } else {
          speak(`Niepoprawnę nazwisko. Podaj swoję nazwisko`)
          setMessage(`Niepoprawnę nazwisko. Podaj swoję nazwisko`);
        }
      }
    },
    {
      command: 'Adres *',
      callback: (adres) => {
        if (/^([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s]+)\s(\d+\/\d+[A-Za-z]*)\s([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+)$/.test(adres)) {
          speak(`Twój adres został zapisany jako ${adres}`)
          setMessage(`Twój adres został zapisany jako ${adres}`);
          setAdres(adres);
        } else {
          speak('Niepoprawny adres. Adres musi być w postaci nazwa ulicy, numer domu przez numer mieszkania i miasto');
          setMessage('Niepoprawny adres. Adres musi być w postaci nazwa ulicy, numer domu przez numer mieszkania i miasto');
        }
      }   //set the display to this response
    },
    {
      command: 'Kod pocztowy *',
      callback: (kod) => {
        if (/^\d{2}-\d{3}$/.test(kod)) {
          speak(`Twój kod pocztowy został zapisany jako ${kod}`)
          setMessage(`Twój kod pocztowy został zapisany jako ${kod}`);
          setKodPocztowy(kod);
        } else {
          speak('Niepoprawny kod pocztowy. Kod pocztowy musi być w postaci 2 cyfr, myśłnik, 3 cyfry.');
          setMessage('Niepoprawny kod pocztowy. Kod pocztowy musi być w postaci 2 cyfr, myśłnik, 3 cyfry.');
        }
      }   //set the display to this response
    },
    {
      command: ['Telefon *', 'Numer Telefonu *'],
      callback: (phone) => {
        const noSpace = phone.replace(/\s+/g, '');
        if (/^\d{9}$/.test(noSpace)) {
          // Wyślij komunikat z zapisanym numerem telefonu
          speak(`Twój telefon został zapisany jako ${noSpace}`);
          setMessage(`Twój telefon został zapisany jako ${noSpace}`);

          // Zapisz numer telefonu z prefiksem '+48'
          setNumerTelefonu('+48' + noSpace);
        } else {
          // Jeśli numer telefonu nie spełnia wymagań, wyślij odpowiedni komunikat
          speak('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
          setMessage('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
        }
      }
    },
    {
      command: ['Dostawa Tak', 'Dostawa do domu', 'Chcę dostawę'],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        speak('Dostawa ustawiona na dowóz do domu')
        setMessage('Dostawa ustawiona na dowóz do domu');
        setDostawa('Tak');
      }
    },
    {
      command: ['Dostawa Nie', 'Odbiór osobisty', 'Nie chcę dostawy'],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        speak('Dostawa ustawiona na odbiór w restauracji')
        setMessage('Dostawa ustawiona na odbiór w restauracji');
        setDostawa('Nie');
      }
    },
    {
      command: ['Dane osobowe', 'Moje dane osobowe', 'Moje informacje', 'informacje o mnie', 'Moje dane', 'dane'],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
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

        const data = [
          { label: 'Imie', value: imie },
          { label: 'Nazwisko', value: nazwisko },
          { label: 'Adres', value: adres },
          { label: 'Kod pocztowy', value: kodPocztowy },
          { label: 'Telefon', value: numerTelefonu },
        ];

        const message = (
          <div>Twoje dane osobowe to:
            <ul>
              {data.map((item) =>
                <li key={item.label}>
                  {item.label}: {item.value ? item.value : 'Nie podano'}
                </li>
              )}
            </ul>
          </div>
        );

        console.log(numerTelefonu)
        speak(response);
        setMessage(message);
      },
    },
    {
      command: [`Moje imię`, `Jakie jest moje imię`, `Jakie moje imię`, `Jakie imię`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (imie) {
          speak(`${imie}`);
          setMessage(`${imie}`);
        } else {
          speak(`nie podano. Podaj imię w formie "imię [twoje imię]"`);
          setMessage(`nie podano. Podaj imię w formie "imię [twoje imię]"`);
        }
      }
    },
    {
      command: [`Moje nazwisko`, `Jakie jest moje nazwisko`, `Jakie moje nazwisko`, `Jakie nazwisko`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (nazwisko) {
          speak(`${nazwisko}`);
          setMessage(`${nazwisko}`);
        } else {
          speak(`nie podano. Podaj nazwisko w formie "nazwisko [twoje nazwisko]"`);
          setMessage(`nie podano. Podaj nazwisko w formie "nazwisko [twoje nazwisko]"`);
        }
      }
    },
    {
      command: [`Mój adres`, `Jaki jest mój adres`, `Jaki mój adres`, `Jaki adres`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (adres) {
          speak(`${adres}`);
          setMessage(`${adres}`);
        } else {
          speak(`nie podano. Podaj adres w formie "adres [twój adres]"`);
          setMessage(`nie podano. Podaj adres w formie "adres [twój adres]"`);
        }
      }
    },
    {
      command: [`Mój kod pocztowy`, `Jaki jest mój kod pocztowy`, `Jaki mój kod pocztowy`, `Jaki kod pocztowy`, `Jaki jest mój kod`, `Jaki mój kod`, `Jaki kod`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (kodPocztowy) {
          speak(`${kodPocztowy}`);
          setMessage(`${kodPocztowy}`);
        } else {
          speak(`nie podano. Podaj kod pocztowy w formie "kod pocztowy [twój kod pocztowy]"`);
          setMessage(`nie podano. Podaj kod pocztowy w formie "kod pocztowy [twój kod pocztowy]"`);
        }
      }
    },
    {
      command: [`Mój telefon`, `Mój numer telefonu`, `Jaki jest mój numer telefonu`, `Jaki mój numer telefonu`, `Jaki numer telefonu`, `Jaki jest mój telefon`, `Jaki mój telefon`, `Jaki telefon`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (numerTelefonu) {
          speak(`${numerTelefonu}`);
          setMessage(`${numerTelefonu}`);
        } else {
          speak(`nie podano. Podaj telefon w formie "telefon [twój telefon]"`);
          setMessage(`nie podano. Podaj telefon w formie "telefon [twój telefon]"`);
        }
      }
    },
    {
      command: [`Jaka dostawa`, `Jaką wybrałem dostawe`, `Dostawa`, `Jest Dostawa`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (dostawa == "Tak") {
          speak(`Wybrałeś dowóz do domu`);
          setMessage(`Wybrałeś dowóz do domu`);
        } else if (dostawa == "Nie") {
          speak(`Wybrałeś obiór w restauracji`);
          setMessage(`Wybrałeś obiór w restauracji`);
        } else {
          speak(`nie podano. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty"`);
          setMessage(`nie podano. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty"`);
        }
      }
    },
  ]

  const pizzaCommands = pizzaData.flatMap((pizza) => {
    const commands = [`chcę pizzę ${pizza.Nazwa}`, `chcę pizza ${pizza.Nazwa}`, `dodaj ${pizza.Nazwa}`, `zapisz ${pizza.Nazwa}`, `chcę ${pizza.Nazwa}`];
    const skladnikiCommand = `składniki ${pizza.Nazwa}`;
    const cenaCommand = `cena ${pizza.Nazwa}`;
    const rozmiarCommand = `rozmiar ${pizza.Nazwa} *`

    return [
      {
        command: commands,
        callback: () => {
          setUserMessage(`${transcript}`)

          resetTranscript();
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

            const pizzaList = (
              <div>Dodaję pizzę {pizza.Nazwa} (rozmiar Mała) do wybranych.
                <ol>
                  {updatedSelectedPizza.map((item, index) =>
                    <li key={index}>{item.pizza} - {item.rozmiar}</li>
                  )}
                </ol>
              </div>
            );

            setMessage(pizzaList);
          } else {
            // Jeśli już istnieje pizza o tej samej nazwie, informujemy użytkownika
            speak(`Pozycja ${pizza.Nazwa} już istnieje w zamówieniu. Proszę zmienić rozmiar przez przykładowo rozmiar Capriciosa mała lub stworzyć kolejne zamówienie z tą samą pizzą.`);
            setMessage(`Pozycja ${pizza.Nazwa} już istnieje w zamówieniu. Proszę zmienić rozmiar przez przykładowo rozmiar Capriciosa mała lub stworzyć kolejne zamówienie z tą samą pizzą.`);
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
            setMessage('Nie rozumiem rozmiaru. Proszę powiedzieć przykładowo: "Capriciosa mała", "Capriciosa średnia", "Capriciosa duża", lub "Capriciosa gigant".');
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
          setMessage(`Rozmiar pizzy ${pizza.Nazwa} zaktualizowano na ${rozmiar}.`);


        },
      },
      {
        command: [skladnikiCommand],
        callback: () => {
          setUserMessage(`${transcript}`)
          const skladnikiArray = pizza.Skladniki.split(', '); // Przekształć ciąg na tablicę składników
          const skladnikiList = (
            <div> Składniki pizzy {pizza.Nazwa} to
              <ul>
                {skladnikiArray.map((skladnik, index) =>
                  <li key={index}>{skladnik}</li>
                )}
              </ul>
            </div>
          );

          resetTranscript();
          speak(`Składniki pizzy ${pizza.Nazwa} to ${pizza.Skladniki}.`);
          setMessage(skladnikiList);
        },
      },
      {
        command: [cenaCommand],
        callback: () => {
          setUserMessage(`${transcript}`)

          resetTranscript();
          const sizes = ['Mała', 'Średnia', 'Duża', 'Gigant'];
          const cenaString = pizza.Cena;
          const ceny = cenaString.split('/');
          let cenaMessage = '';

          sizes.forEach((size, index) => {
            const cena = ceny[index];
            cenaMessage += `${size} pizza: ${cena} złoty. `;
          });

          const message = (
            <ul>
              {sizes.map((size, index) =>
                <li key={size}>{size} pizza: {ceny[index]} złoty</li>
              )}
            </ul>
          );

          speak(cenaMessage);
          setMessage(message);
        },
      },
    ];
  });

  const commands = [
    {
      command: [`komendy`],
      callback: () => {
        setUserMessage(`${transcript}`)
        const message = (
          <div>Aby zobaczyć komendy powiedz:
            <ol>
              <li>komendy menu.</li>
              <li>komendy zamówienia.</li>
              <li>komendy wybranych pizzy.</li>
              <li>komendy danych osobowych.</li>
            </ol>
            Jeżeli potrzebujesz pomocy powiedz pomoc.
          </div>
        );

        resetTranscript();
        speak(`Aby zobaczyć komendy powiedz:
        1. komendy menu.
        2. komendy zamówienia.
        3. komendy wybranych pizzy.
        4. komendy danych osobowych.
        Jeżeli potrzebujesz pomocy powiedz pomoc.`);
        setMessage(message);
      }
    },
    {
      command: [`komendy wybranych pizzy`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        speak(`Aby dowiedzieć się o swoich pizzach to:
        1. Moje pizze.`);
        setMessage(`Aby dowiedzieć się o swoich pizzach to:
        1. Moje pizze.`);
      }
    },
    {
      command: [`komendy danych osobowych`],
      callback: () => {
        setUserMessage(`${transcript}`)
        const message = (
          <div>Aby dowiedzieć się o swoich podanych danych to powiedz:
            <ol>
              <li>Moje dane osobowe.</li>
              <li>Moje imię.</li>
              <li>Moję nazwisko.</li>
              <li>Mój adres.</li>
              <li>Mój kod pocztowy.</li>
              <li>Mój numer telefonu.</li>
            </ol>
          </div>
        );

        resetTranscript();
        speak(`Aby dowiedzieć się o swoich podanych danych to:
        1. Moje dane osobowe.
        2. Moje imię.
        3. Moję nazwisko.
        4. Mój adres.
        5. Mój kod pocztowy.
        6. Mój numer telefonu.`);
        setMessage(message);
      }
    },
    {
      command: [`komendy menu`],
      callback: () => {
        setUserMessage(`${transcript}`)
        const message = (
          <div>Aby dowiedzieć się o pizzach to powiedz:
            <ol>
              <li>menu.</li>
              <li>składniki [Nazwa pizzy]</li>
              <li>cena [Nazwa pizzy]</li>
            </ol>
          </div>
        );

        resetTranscript();
        speak(`Aby dowiedzieć się o pizzach to powiedz:
        1. menu.
        2. składniki [Nazwa pizzy].
        3. cena [Nazwa pizzy].`);
        setMessage(message);
      }
    },
    {
      command: [`komendy zamówienia`],
      callback: () => {
        setUserMessage(`${transcript}`)
        const message = (
          <div>Aby złożyć zamówienie to:
            <ol>
              <li>Imię [Twoje imię].</li>
              <li>Nazwisko [Twoje nazwisko].</li>
              <li>Adres [Twój adres].</li>
              <li>Kod pocztowy [Twój kod pocztowy]</li>
              <li>Numer telefonu [Twój numer telefonu]</li>
              <li>dodaj [Nazwa pizzy].</li>
            </ol>
          </div>
        );


        resetTranscript();
        speak(`Aby złożyć zamówienie to:
        1. Imię [Twoje imię].
        2. Nazwisko [Twoje nazwisko].
        3. Adres [Twój adres].
        4. Kod pocztowy [Twój kod pocztowy].
        5. Numer telefonu [Twój numer telefonu].
        6. dodaj [Nazwa pizzy].`);
        setMessage(message);
      }
    },
    {
      command: [`zadzwoń`, `kontakt`],
      callback: () => {
        setUserMessage(`${transcript}`)
        const message = (
          <div>Nasz numer telefonu to:
            <ol>
              <li>Telefon komórkowy: +48 632 532 123.</li>
              <li>Telefon komórkowy: +48 332 232 723.</li>
            </ol>
          </div>
        );

        resetTranscript();
        speak(`Nasz numer telefonu to: 
        1. Telefon komórkowy: +48 632 532 123.
        2. Telefon komórkowy: +48 332 232 723.`);
        setMessage(message);
      }
    },
    {
      command: [`mail`, `e-mail`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        speak(`Nasz mail to: 
        Roberto@gmail.com.`);
        setMessage(`Nasz mail to: 
        Roberto@gmail.com.`);
      }
    },
    {
      command: [`Zamówienie dla *`, `Status dla *`],
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
                setMessage(`Brak zamówień dla tego numeru telefonu.`);
                return;
              }

              // Przeglądanie i wyświetlanie statusu każdego zamówienia
              orders.forEach((order, index) => {
                const status = order.Status;
                console.log(`Zamówienie ${index + 1}: Status zamówienia to ${status}`);
                speak(`Zamówienie ${index + 1}: Status zamówienia to ${status}`);
                setMessage(`Zamówienie ${index + 1}: Status zamówienia to ${status}`);
              });
            })

        } else {
          // Jeśli numer telefonu nie spełnia wymagań, wyślij odpowiedni komunikat
          speak('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
          setMessage('Niepoprawny numer telefonu. Numer telefonu musi składać się z 9 cyfr.');
        }
      }
    },
    {
      command: [`Jakie są pizze`, `pizzę`, `pizze`, `Jakie są pizzę`, `menu`, `Wszystkie pizze`, `Wszystie pizzę`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        const pizzaList = pizzaData.map((pizza) => `${pizza.ID_Pizzy} ${pizza.Nazwa}`).join(', '); // Tworzy listę nazw pizz razem z ID, oddzielonych przecinkami

        const message = (
          <div>
            Dostępne pizze to:
            <ul style={{ listStyleType: 'none', padding: '8px' }}>
              {pizzaData.map((pizza) =>
                <li key={pizza.ID_Pizzy}>{pizza.ID_Pizzy}. {pizza.Nazwa}</li>
              )}
            </ul>
          </div>
        );
        speak(`Dostępne pizze to: ${pizzaList}`);
        setMessage(message);
      }
    },
    {
      command: [`jakie brałem pizzę`, `Jakie wybrałem pizze`, `Jakie wybrałem pizzę`, `Jakie mam pizze`, `Jakie mam pizzę`, `Moja lista`, `Moje pizze`, `Moje pizzę`, `Ja wybrałem pizzę`, `Jaki wybrałem pizzę`],
      callback: () => {
        setUserMessage(`${transcript}`)

        resetTranscript();
        if (selectedPizza && selectedPizza.length > 0) {
          const selectedPizzaInfo = selectedPizza.map((pizza) => {
            return `${pizza.pizza} (rozmiar ${pizza.rozmiar}) (cena ${pizza.cena}).`;
          }).join(', ');

          const message = (
            <div>Wybrałeś:
              <ol>
                {selectedPizza.map((pizza, index) =>
                  <li key={index}>
                    {pizza.pizza} (rozmiar {pizza.rozmiar}) (cena {pizza.cena}).
                  </li>
                )}
              </ol>
            </div>
          );

          speak(`Wybrałeś: ${selectedPizzaInfo}`);
          setMessage(message);

        } else {
          speak(`Nie wybrałeś jeszcze żadnej pizzy.`);
          setMessage(`Nie wybrałeś jeszcze żadnej pizzy.`);
        }
      }
    },
    {
      command: ['złóż zamówienie', 'zamów'],
      callback: () => {
        setUserMessage(`${transcript}`)
        resetTranscript();
        if (selectedPizza.length === 0) {
          speak('Nie wybrano żadnej pizzy. Proszę wybrać przynajmniej jedną pizzę do zamówienia w forme "Chcę [Nazwa pizzy]".');
          setMessage(`Nie wybrano żadnej pizzy. Proszę wybrać przynajmniej jedną pizzę do zamówienia w forme "Chcę [Nazwa pizzy]".`);
        } else if (!imie) {
          speak('Brakuje imienia. Proszę podaj swoje imię w formie "Imie [Twoje Imię]".');
          setMessage('Brakuje imienia. Proszę podaj swoje imię w formie "Imie [Twoje Imię]".');
        } else if (!nazwisko) {
          speak('Brakuje nazwiska. Proszę podaj swoje nazwisko w formie "Nazwisko [Twoje Nazwisko]".');
          setMessage('Brakuje nazwiska. Proszę podaj swoje nazwisko w formie "Nazwisko [Twoje Nazwisko]".');
        } else if (!numerTelefonu) {
          speak('Brakuje numeru telefonu. Proszę podaj swój numer telefonu w formie "Numer telefonu [Twój Numer Telefonu]".');
          setMessage('Brakuje numeru telefonu. Proszę podaj swój numer telefonu w formie "Numer telefonu [Twój Numer Telefonu]".');
        } else if (!adres) {
          speak('Brakuje adresu. Proszę podaj swój adres w formie "Adres [Twój Adres]".');
          setMessage('Brakuje adresu. Proszę podaj swój adres w formie "Adres [Twój Adres]".');
        } else if (!kodPocztowy) {
          speak('Brakuje kodu pocztowego. Proszę podaj swój kod pocztowy w formie "Kod pocztowy [Twój kod pocztowy]".');
          setMessage('Brakuje kodu pocztowego. Proszę podaj swój kod pocztowy w formie "Kod pocztowy [Twój kod pocztowy]".');
        } else if (!dostawa) {
          speak('Brakuje formy dostawy. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty".');
          setMessage('Brakuje formy dostawy. Proszę podaj formę dostawy w postaci "Dostawa do domu lub Odbiór osobisty".');
        } else {
          speak('Dziękuję! Zamówienie zostało złożone.');
          setMessage('Dziękuję! Zamówienie zostało złożone.');
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
      command: ['pomoc', 'pomóż'],
      callback: () => {
        setUserMessage(`${transcript}`)
        resetTranscript();
        const message = (
          <ul>
            <li>Jeżeli chcesz poznać nasz numer telefonu, powiedz "kontakt".</li>
            <li>Jeżeli chcesz usłyszeć dostępne pizze, powiedz "menu".</li>
            <li>Jeżeli chcesz usłyszeć skład i cenę konkretnej pizzy, powiedz "składnik [Nazwa pizzy]" lub "cena [Nazwa pizzy]".</li>
            <li>Jeżeli chcesz złożyć zamówienie, podaj wszystkie dane osobowe z komendy zamówienia, a gdy wszystkie dane osobowe zostaną podane i pizze zostaną wybrane, powiedz "zamów".</li>
            <li>Jeżeli chcesz poznać dostępne komendy, powiedz "komendy".</li>
            <li>To wszystko odnośnie pomocy.</li>
          </ul>
        );
        speak('Jeżeli chcesz poznać nasz numer telefonu, powiedz kontakt. Jeżeli chcesz usłyszeć pizze jakie posiadamy, powiedz menu. Jeżeli chcesz usłyszeć skład i cenę danej pizzy, powiedz składnik Nazwa pizzy lub cena Nazwa pizzy. Jeżeli chcesz złożyć zamówienie podaj wszystkie dane osobowe z komendy zamówienia, a gdy wszystkie dane osobowe zostaną podane a pizze wybrane to powiedz zamów. Jeżeli chcesz poznac komendy to powiedz komendy. To wszystko odnośnie pomocy.');
        setMessage(message);
      }
    },
    {
      command: ['wyczyść', 'odśwież', 'zresetuj',
        'clear', 'reset', 'refresh'],
      callback: ({ resetTranscript }) => {
        setMessage('Witaj w obsłudze głosowej, Powiedz pomoc lub komendy')
        setUserMessage('...')
        resetTranscript();
      }
    },
    {
      command: ['zatrzymaj',
        'stop', `przestań`],
      callback: () => {
        setUserMessage(`${transcript}`)
        resetTranscript();
        speak();
        setIsListening(false);
        setShowListeningModal(false);
        SpeechRecognition.stopListening()
      }
    },
    ...userDataCommands,
    ...pizzaCommands
  ]

  useEffect(() => {
    if (!microphone && showListeningModal) {
      // Jeżeli mikrofon jest wyłączony i nasłuchiwanie trwa, to zatrzymaj nasłuchiwanie
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
    if (microphone && showListeningModal){
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  }, [microphone, isListening]);

  const toggleListening = () => {

    if (!microphone) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      setShowListeningModal(true);
    } else {
      speak("Witaj w obsłudze głosowej, Powiedz pomoc lub komendy")
      setMessage("Witaj w obsłudze głoswoej, Powiedz pomoc lub komendy")
      SpeechRecognition.startListening({ continuous: true });
      setShowListeningModal(true);
      setIsListening(true);
    }
  }

  const {
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setBrowser(false);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!volume) {
      const synthesis = window.speechSynthesis;
      synthesis.cancel();
    }
  }, [volume]);

  let sayTimeout = null;

  const speak = (text, rate = 1.0) => {
    const synthesis = window.speechSynthesis;

    if (volume) {
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
    }
  };

  const micButtonRef = useRef(null);
  useEffect(() => {
    const handleTabKeyPress = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // Zapobiega domyślnemu zachowaniu przeglądarki przy naciśnięciu Tab.
        micButtonRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleTabKeyPress);

    return () => {
      document.removeEventListener('keydown', handleTabKeyPress);
    };
  }, []);

  return (
    <div>
      {browser ? (
        <img
          ref={micButtonRef}
          className={`m-1 microphone ${isListening ? 'active-microphone' : ''}`}
          src="Microphone.png"
          alt="Microphone"
          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          onClick={toggleListening}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleListening();
            }
            if (e.key === 'Tab') {
              speak('Obsługa głosowa')
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
        show={showListeningModal}
        onHide={() => {
          setIsListening(false)
          setShowListeningModal(false);
          SpeechRecognition.stopListening();
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"

      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="d-flex">
              <div>Co mówisz</div>
            </div>
          </Modal.Title>
          <button
            style={{ marginInlineStart: "230px" }}
            className={`col-1 btn ${microphone ? 'btn-outline-primary' : 'btn-outline-danger'}`}
            onClick={() => setMicrophone(!microphone)}
          >
            {microphone ? (
              <i className="fa fa-microphone" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-microphone-slash" aria-hidden="true"></i>
            )}
          </button>
          <button
            className={`ms-2 col-1 btn ${volume ? 'btn-outline-primary' : 'btn-outline-danger'}`}
            onClick={() => setVolume(!volume)}
          >
            {volume ? (
              <i className="fa fa-volume-up" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-volume-off" aria-hidden="true"></i>
            )}
          </button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#141414', color: 'white', fontSize: `${fontSize}px` }}>
          <div className="mb-1" style={{ fontSize: '20px' }}>Powiększenie: {fontSize}px</div>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setFontSize(prevSize => Math.min(prevSize + 2, maxFontSize))}
          >
            <i className="fa fa-search-plus" aria-hidden="true"></i>
          </button>
          <button
            className="ms-2 btn btn-outline-primary mb-3"
            onClick={() => setFontSize(prevSize => Math.max(10, prevSize - 2))}
          >
            <i className="fa fa-search-minus" aria-hidden="true"></i>
          </button>
          <div className="mb-4" style={{ height: '50px', maxHeight: '50px', overflowY: 'auto' }}>
            Twoja wypowiedź: {transcript}
          </div>
          <div className="d-flex flex-column col-12 justify-content-between flex-wrap">
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start', // Użytkownik
            }}>
              <div className="col-12 mb-3">
                <div className="mb-1">Użytkownik:</div>
                <div className="border p-2 rounded" style={{ backgroundColor: '#000077' }}>
                  {userMessage}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end', // Maszyna
            }}>
              <div className="col-12 mb-3">
                <div className="mb-1">Maszyna:</div>
                <div className="border p-2 rounded" style={{ backgroundColor: '#555555' }}>
                  {message}
                </div>
              </div>
            </div>
          </div>
          <Alert variant="dark" className="mt-3">
            <div><div>Przydatne Komendy Informacyjne:</div>
              <ul>
                <li>kontakt</li>
                <li>pomoc / komendy</li>
                <li>menu</li>
                <li>cena ...</li>
                <li>składniki ...</li>
                <li>Dane osobowe</li>
              </ul>
              <div>Komendy dodawania pizz do koszyka:</div>
              <ul>
                <li>chcę pizzę ... / dodaj ...</li>
                <li>rozmiar ... ... (gdzie 'nazwa' 'rozmiar')</li>
                <li>moje pizze</li>
                <li>Zamów</li>
              </ul>
              <div>Komendy danych osobowych:</div>
              <ul>
                <li>Imię ... / Nazwisko ... / Adres ... </li>
                <li>Kod Pocztowy ... / Telefon ... / Dostawa ...</li>
              </ul>
              <div>Aby zamówić</div>
              <ul>
                <li>Wszystkie dane osobowe muszą być wypełnione (komenda 'Dane osobowe')</li>
                <li>Conajmniej jedna pizza musi zostać wybrana</li>
              </ul>
            </div>
          </Alert>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MySpeechRecognition;