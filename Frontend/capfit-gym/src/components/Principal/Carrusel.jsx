import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Carrusel = () => {
    const slides = [
        {
            id: 1,
            imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
            titulo: "DISCIPLINA SOBRE MOTIVACIÓN",
            subtitulo: "El éxito no es un accidente, es el resultado de tu constancia diaria."
        },
        {
            id: 2,
            imagen: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
            titulo: "SUPERÁ TUS PROPIOS LÍMITES",
            subtitulo: "Cada repetición te acerca más a tu mejor versión en Capfit."
        },
        {
            id: 3,
            imagen: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
            titulo: "SIN EXCUSAS, SOLO RESULTADOS",
            subtitulo: "Transformá tu mente y tu cuerpo hoy mismo."
        }
    ];

    return (
        <div className="carusel-container mb-5">
            <Carousel fade interval={4000} indicators={true} controls={true}>
                {slides.map((slide) => (
                    <Carousel.Item key={slide.id} style={{ height: '420px' }}>
                        
                        <img
                            className="d-block w-100 h-100"
                            src={slide.imagen}
                            alt={slide.titulo}
                            style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} 
                        />
                        
                        <Carousel.Caption className="d-flex flex-column justify-content-center h-100 top-0 bottom-0">
                            <h2 className="display-5 fw-bold text-warning text-uppercase mb-2" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                                {slide.titulo}
                            </h2>
                            <p className="fs-4 text-white font-italic" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}>
                                "{slide.subtitulo}"
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Carrusel;