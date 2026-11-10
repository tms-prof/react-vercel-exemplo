import usestate from "react";
import Acordeon from "../components/Acordeon";
import Galeria from "../components/Galeria";
import Carousel from "../components/Carousel";

const imagens = [
  { src: "https://picsum.photos/id/10/800/600", alt: "Floresta" },
  { src: "https://picsum.photos/id/11/800/600", alt: "Lago" },
  { src: "https://picsum.photos/id/12/800/600", alt: "Praia" },
  { src: "https://picsum.photos/id/13/800/600", alt: "Costa" },
  { src: "https://picsum.photos/id/14/800/600", alt: "Mar" },
  { src: "https://picsum.photos/id/15/800/600", alt: "Cachoeira" },
  { src: "https://picsum.photos/id/16/800/600", alt: "Pôr do sol" },
  { src: "https://picsum.photos/id/17/800/600", alt: "Estrada" },
  { src: "https://picsum.photos/id/18/800/600", alt: "Campo" },
  { src: "https://picsum.photos/id/19/800/600", alt: "Montanha" },
  { src: "https://picsum.photos/id/20/800/600", alt: "Mesa de trabalho" },
  { src: "https://picsum.photos/id/21/800/600", alt: "Deserto" },
  { src: "https://picsum.photos/id/22/800/600", alt: "Pessoa caminhando" },
  { src: "https://picsum.photos/id/23/800/600", alt: "Garfo" },
  { src: "https://picsum.photos/id/24/800/600", alt: "Livro" },
  { src: "https://picsum.photos/id/25/800/600", alt: "Paisagem verde" },
  { src: "https://picsum.photos/id/26/800/600", alt: "Acessórios" },
  { src: "https://picsum.photos/id/27/800/600", alt: "Neblina" },
  { src: "https://picsum.photos/id/28/800/600", alt: "Bosque" },
  { src: "https://picsum.photos/id/29/800/600", alt: "Vale" },
];

export default function Sobre() {
    return (
            <main>
              <Carousel itens={imagens} />
            </main>
    );

}