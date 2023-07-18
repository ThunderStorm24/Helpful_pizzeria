import NavbarE from './../Components/NavBar.js';
import HomeContent,{Mapa, Opis, Koniec, Kartki, Introduction, Stopka} from '../Components/HomeContent.js';

export default function Home() {
    return <div>
        <NavbarE />
    <div className="align-items-end" style={{}}>
      <Introduction />
      <Opis />
      <HomeContent />
      <Koniec />
      <Kartki />
      </div>
      <Mapa />
      <Stopka />
    </div>
}