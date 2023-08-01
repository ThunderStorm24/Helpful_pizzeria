import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';
import CardPhoto from './smallComponents/CardPhoto'
import CardText from './smallComponents/CardText'

function Introduction(){
  return(
    <div className="d-flex col-12" style={{width:'100%' , height:"950px"}}>


        <img
          className="col-12 col-md-12 d-block w-100"
         // className="d-block w-100"
          src="Menu.jpg"
          style={{objectFit:'cover'}}
        />
        <div className="d-flex">
        <div className="napis col-10">Pizzeria la Thunderas</div> 
        <button className="napis1 col-6">Zamów już dziś!</button>
        </div>
</div>
  );
}

function Opis() {
  return (
    <div className="d-flex flex-column">
      <a id="about"></a>
      <div className="w-100 mt-5 mb-5"><h1>Głodni???</h1></div>
      <div className="d-flex justify-content-center">
        <div className=" fs-5 w-75">Jesteście głodni? Macie ochotę wrzucić coś na ząb? Zobaczcie listę najlepszych restauracji w Będzinie i Czeladzi. TOP restauracji i kawiarni w tym mieście został stworzony w oparciu o oceny użytkowników serwisu Tripadvisor oraz opinie klientów placówek gastronomicznych w obu tych miastach. Sprawdźcie, gdzie warto coś zjeść. Z pewnością znajdziecie coś ciekawego dla siebie, co skłoni Was do wypadu na wieczorną kolację, kawę z dobrym ciastkiem, a może szybki obiad.</div>
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="d-flex justify-content-center flex-wrap col-12 col-md-12 mt-4">

      <CardPhoto photo="Menu.jpg" title="Menu" describe="Ponad 20 rodzajów pizzy dedykowanej przez nas" button="Zobacz więcej!" location="/Menu" />
      <CardPhoto photo="Pracownicy.jpg" title="Customowe Pizze!" describe="Już dziś poczuj się jak kreator pizzy i dodaj swoją pizze ze swoimi składnikami i ze swoją nazwą do naszego menu!" button="Do customowych pizzy!" location="/Menu" />
      <CardPhoto photo="XD.jpg" title="Zamów już teraz!" describe="Z dostawą lub odbiór w pizzeri, pizze użytkownika lub naszą, jedną pizze lub dwie, możliwości jest wiele!" button="Zamów" location="/Menu" />

    </div>
  );
}

function Koniec() {
  return (
    <div className="d-flex justify-content-center flex-wrap">
      <div className="w-100 mb-5 mt-5"><h1>Zapraszamy!!!</h1></div>
      <div className="d-flex justify-content-center">
        <div className=" fs-5 w-75">Jesteście głodni? Macie ochotę wrzucić coś na ząb? Zobaczcie listę najlepszych restauracji w Będzinie i Czeladzi. TOP restauracji i kawiarni w tym mieście został stworzony w oparciu o oceny użytkowników serwisu Tripadvisor oraz opinie klientów placówek gastronomicznych w obu tych miastach. Sprawdźcie, gdzie warto coś zjeść. Z pewnością znajdziecie coś ciekawego dla siebie, co skłoni Was do wypadu na wieczorną kolację, kawę z dobrym ciastkiem, a może szybki obiad.
          <div className="text-start mt-5">Oferujemy:</div>
          <ul className="d-flex flex-row flex-wrap">
            <li className="w-100 text-start">Jedne z najlepszych i najpopularniejszych pizz w polsce</li>
            <li className="w-100 text-start">Stworzenie własnej pizzy w naszej restauracji i zapisaniu jej</li>
            <li className="w-100 text-start">Rezerwacje stolików</li>
            <li className="w-100 text-start">Wygoda użytkownika</li>
          </ul>
          <div className="mt-5 mb-5">
          Jesteście głodni? Macie ochotę wrzucić coś na ząb? Zobaczcie listę najlepszych restauracji w Będzinie i Czeladzi. TOP restauracji i kawiarni w tym mieście został stworzony w oparciu o oceny użytkowników serwisu Tripadvisor oraz opinie klientów placówek gastronomicznych w obu tych miastach. Sprawdźcie, gdzie warto coś zjeść. Z pewnością znajdziecie coś ciekawego dla siebie, co skłoni Was do wypadu na wieczorną kolację, kawę z dobrym ciastkiem, a może szybki obiad.</div>
          </div>
      </div>
    </div>
  );
}

function Kartki() {
  return (
    <div className="d-flex justify-content-center flex-wrap col-12 col-md-12 mt-4">
      <CardText title="Strona główna" describe="Czegoś jeszccze nie wyczytałeś? skocz na górę!" button="Wróć!" location="#" />
      <CardText title="Menu" describe="Zgłodniałeś? Spójrz na nasze oferty!" button="Idź do Menu!" location="/Menu" />
      <CardText title="Customowe Menu" describe="Chcesz spróbować czegoś nowego? A może chcesz stworzyć pizze?" button="Idź do Customowego Menu!" location="/Menu" />
      <CardText title="Centrum Pomocy" describe="Potrzebujesz pomocy? masz problem? Przejdź do zakładki Pomoc!" button="Idź do Centrum Pomocy!" location="#Pomoc" />
      <CardText title="Lokalizacja" describe="Nie wiesz gdzie się znajdujemy? To nic pod spodem masz mapę!" button="Gdzie?" location="#Location" />
      <CardText title="Kontakt" describe="Chcesz się z nami skontaktować? Zadzwoń!" button="Zadzwoń do nas!" location="#Contact" />
    </div>
  );
}


function Mapa() {
  return (
    <div>
      <a id="Location"></a>
      <iframe className="border border-5 border-dark mt-5" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d318.63388215331116!2d19.11811782231573!3d50.2906014506458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716d140ea66f70f%3A0x39db5fac3cd74e86!2sBistro%20Jab%C5%82ko%20i%20Cynamon!5e0!3m2!1spl!2spl!4v1669559422378!5m2!1spl!2spl" width="100%" height="600" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
}

function Stopka() {
  return (
      <footer className="row-cols-1 row-cols-sm-2 row-cols-md-5 p-5 border-top text-light dark d-flex justify-content-between flex-wrap">
          <div className="mb-3">
              <a href="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
                  <svg className="bi me-2" width="40" height="32"></svg>
              </a>
              <p className="text-muted ms-3">ThunderStorm24 © 2022</p>
          </div>  

          <div className="mb-3">
              <h5>Gdzie nas można znaleźć?</h5>
              <ul className="nav flex-column">
                  <li className="nav-item mb-2"><a className="nav-link p-0 text-muted">Katowice</a></li>
                  <li className="nav-item mb-2"><a className="nav-link p-0 text-muted">Kraków</a></li>
                  <li className="nav-item mb-2"><a className="nav-link p-0 text-muted">Sosnowiec</a></li>
                  <li className="nav-item mb-2"><a className="nav-link p-0 text-muted">Będzin</a></li>
                  <li className="nav-item mb-2"><a className="nav-link p-0 text-muted">Mysłowice</a></li>
              </ul>
          </div>

          <div className="mb-3">
              <h5>Skontaktuj się z nami!</h5>
              <a id="Contact"></a>
              <ul className="nav flex-column">
                  <li className="nav-item mb-2 p-0 text-muted">Telefon komórkowy: +48 632 532 123</li>
                  <li className="nav-item mb-2 p-0 text-muted">Telefon komórkowy: +48 332 232 723</li>
                  <li className="nav-item mb-2 p-0 text-muted">Telefon stancjonarny: +12 123 321 123</li>
                  <li className="nav-item mb-2 p-0 text-muted">Telefon stancjonarny: +12 123 321 124</li>
                  <li className="nav-item mb-2 p-0 text-muted">mail: Roberto@gmail.com</li>
              </ul>
          </div>

          <div className="mb-3">
              <h5>Media społecznościowe!</h5>
              <ul className="nav flex-column">
                  <li className="nav-item mb-2"><a href="https://www.facebook.com" target="blank_" className="nav-link p-0 text-muted">Facebook</a></li>
                  <li className="nav-item mb-2"><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="blank_" className="nav-link p-0 text-muted">Youtube</a></li>
                  <li className="nav-item mb-2"><a href="https://www.instagram.com/" target="blank_" className="nav-link p-0 text-muted">Instagram</a></li>
              </ul>
          </div>
      </footer>
  );
}


export default HomeContent;
export { Opis };
export { Mapa };
export { Koniec };
export { Kartki };
export { Introduction };
export { Stopka };
