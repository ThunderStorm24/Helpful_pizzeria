import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';

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

      <Card className="col-4 col-md-4" style={{ width: '20rem', margin: '15px', background: '#343434' }}>
        <Card.Img  variant="top" src="Menu.jpg" />
        <Card.Body>
          <Card.Title>Menu</Card.Title>
          <Card.Text>
            Ponad 20 rodzajów pizzy dedykowanej przez nas
          </Card.Text>
          <Button variant="primary">Zobacz więcej!</Button>
        </Card.Body>
      </Card>

      <Card className="col-4 col-md-4" style={{ width: '20rem', margin: '15px', background: '#343434' }}>
        <Card.Img variant="top" src="Pracownicy.jpg" />
        <Card.Body>
          <Card.Title>Customowe Pizze!</Card.Title>
          <Card.Text>
            Już dziś poczuj się jak kreator pizzy i dodaj swoją pizze ze swoimi składnikami i ze swoją nazwą do naszego menu!
          </Card.Text>
          <Button variant="primary">Do customowych pizzy!</Button>
        </Card.Body>
      </Card>

      <Card className="col-4 col-md-4" style={{ width: '20rem', margin: '15px', background: '#343434' }}>
        <Card.Img variant="top" src="XD.jpg" />
        <Card.Body>
          <Card.Title>Zamów już teraz!</Card.Title>
          <Card.Text>
            Z dostawą lub odbiór w pizzeri, pizze użytkownika lub naszą, jedną pizze lub dwie, możliwości jest wiele!
          </Card.Text>
          <Button variant="primary">Zamów!</Button>
        </Card.Body>
      </Card>
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

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Strona główna</Card.Title>
          <Card.Text>
            Czegoś jeszccze nie wyczytałeś? skocz na górę!
          </Card.Text>
          <Navbar.Brand href="#"><Button variant="primary">Wróć!</Button></Navbar.Brand>
        </Card.Body>
      </Card>

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Menu</Card.Title>
          <Card.Text>
            Zgłodniałeś? Spójrz na nasze oferty!
          </Card.Text>
          <Button variant="primary">Idź do Menu!</Button>
        </Card.Body>
      </Card>

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Customowe Menu</Card.Title>
          <Card.Text>
            Chcesz spróbować czegoś nowego? A może chcesz stworzyć pizze?
          </Card.Text>
          <Button variant="primary">Idź do Customowego Menu!</Button>
        </Card.Body>
      </Card>

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Centrum Pomocy</Card.Title>
          <Card.Text>
            Potrzebujesz pomocy? masz problem? Przejdź do zakładki Pomoc!
          </Card.Text>
          <Button variant="primary">Idź do Centrum Pomocy!</Button>
        </Card.Body>
      </Card>

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Lokalizacja</Card.Title>
          <Card.Text>
            Nie wiesz gdzie się znajdujemy? To nic pod spodem masz mapę!
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="col-6 col-md-6" style={{ width: '36rem', margin: '15px', background: '#343434' }}>
        <Card.Body>
          <Card.Title>Kontakt</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
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
