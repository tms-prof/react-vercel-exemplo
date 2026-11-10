
export default function Galeria({arrayImages}) {  
    return (
            <div className="galeria-grid" >
                {arrayImages.map((img, index) => (
                    <img key={index} src={img.src} alt={`Imagem ${img.alt}`} />
                ))}
            </div>
          
    );
}