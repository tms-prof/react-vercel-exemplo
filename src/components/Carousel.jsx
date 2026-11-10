// useRef é um hook do React que cria uma "referência" mutável.
// Aqui ele é usado para acessar diretamente um elemento do DOM (a div do carrossel).
import { useRef } from "react";

export default function Carousel({ itens, cols }) {
  // useRef(null) cria um objeto no formato { current: null }.
  //
  // Esse objeto é preenchido pelo React quando passamos ele no atributo `ref`
  // de um elemento JSX (veja a div "carousel-track" lá embaixo). Depois que o
  // componente é renderizado, `trackRef.current` passa a apontar para o
  // elemento real do DOM, o mesmo que você obteria com document.querySelector().
  //
  // Por que usar useRef e não useState?
  // - useState dispara uma nova renderização toda vez que o valor muda.
  // - useRef NÃO dispara renderização quando `.current` muda, e o valor
  //   persiste entre as renderizações. Como só precisamos de acesso ao
  //   elemento para chamar scrollBy(), não há motivo para re-renderizar.
  const trackRef = useRef(null);

  const moveIndex = (direction) => {
    // Antes de renderizar, ou se o elemento for desmontado, `current` é null.
    // Essa checagem evita erros ao tentar usar o elemento quando ele não existe.
    if (!trackRef.current) return;

    // Aqui usamos o useRef para LER uma propriedade do elemento real do DOM:
    // a largura visível do carrossel na tela.
    const trackWidth = trackRef.current.clientWidth;

    // Define a direção do pulo (avança o tamanho total visível ou volta)
    const scrollAmount = direction === "next" ? trackWidth : -trackWidth;

    // Aqui usamos o useRef para CHAMAR um método nativo do elemento (scrollBy).
    // Isso é uma manipulação imperativa do DOM, algo que o React não faz
    // sozinho via props/estado, e é justamente o caso ideal para useRef.
    trackRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const gridStyle = {
    "--cols-mobile": cols?.mobile || 1,
    "--cols-tablet": cols?.tablet || 2,
    "--cols-desktop": cols?.desktop || 4,
  };

  return (
    <div className="carousel">
      <button className="carousel-button carousel-button-prev" onClick={() => moveIndex("prev")}>‹</button>

      {/* É AQUI que a ref é conectada ao elemento.
          Ao passar `ref={trackRef}`, o React atribui esta div a `trackRef.current`
          assim que ela é montada na tela. Quando o componente é desmontado,
          o React volta `trackRef.current` para null. */}
      <div className="carousel-track" style={gridStyle} ref={trackRef}>
        {itens.map((imagem, index) => (
          <div key={index} className="carousel-item">
            <img src={imagem.src} alt={imagem.alt} />
          </div>
        ))}
      </div>

      <button className="carousel-button carousel-button-next" onClick={() => moveIndex("next")}>›</button>
    </div>
  );
}
