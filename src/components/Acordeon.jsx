import {useState} from "react";

export default function Acordeon({pergunta, resposta}) {
  const [isOpen, setIsOpen] = useState(false);
return (
  <div className="acordeon">
    <div className="pergunta">
      <span>{pergunta}</span>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '-' : '+'}
      </button>
    </div>

    <div className={`resposta ${isOpen ? 'aberta' : ''}`}>
      <div className="resposta-conteudo">
        <p>{resposta}</p>
      </div>
    </div>
  </div>
);
}