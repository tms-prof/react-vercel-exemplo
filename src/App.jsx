
import Inicio from './pages/Inicio';
import Sobre from './pages/Sobre';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Contato from './components/Contato';
import Agendamento from './pages/Agendamento';

export default function App() {
  return (
    <> 
      <Header >
        <nav>
         <NavLink to="/" >Início</NavLink> |{" "}
         <NavLink to="/sobre">Sobre</NavLink> |{" "}
         <NavLink to="/agendamento">Agendamento</NavLink> |{" "}
         </nav>
       </Header>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/agendamento" element={<Agendamento />} />
        </Routes>
        <Footer year="2026" companyName="PFE 2026.2-Thiago" />
    </>
  );
}

