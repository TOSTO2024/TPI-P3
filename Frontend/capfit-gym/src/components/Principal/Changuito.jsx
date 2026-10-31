import 'bootstrap/dist/css/bootstrap.min.css';

const Changuito = () => {
    
    const productos = [
        {
            id: 1,
            nombre: "Proteína Whey Capfit 1kg",
            precio: "$45.000",
            imagen: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80",
            descripcion: "Proteína de máxima pureza para potenciar tu recuperación muscular."
        },
        {
            id: 2,
            nombre: "Creatina Monohidrato 300g",
            precio: "$32.000",
            imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
            descripcion: "Aumenta tu fuerza, potencia y rendimiento en cada entrenamiento."
        },
        {
            id: 3,
            nombre: "Shaker Oficial Capfit Gym",
            precio: "$8.500",
            imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80",
            descripcion: "Vaso mezclador anti-goteo con capacidad de 600ml y rejilla mezcladora."
        },
        {
            id: 4,
            nombre: "Remera Oversize Entrená",
            precio: "$18.000",
            imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
            descripcion: "Algodón peinado de alta calidad, diseñada para máxima comodidad."
        }
    ];

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="display-4 fw-bold text-white">TIENDA <span className="text-warning">CAPFIT</span></h2>
                <p className="text-white-50 fs-5">Llevá tu indumentaria y suplementación oficial al siguiente nivel.</p>
            </div>

            <div className="row g-4">
                {productos.map((prod) => (
                    <div className="col-md-3 col-sm-6" key={prod.id}>
                        <div 
                            className="card h-100 shadow border-0" 
                            style={{ backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333' }}
                        >
                            <img 
                                src={prod.imagen} 
                                className="card-img-top" 
                                alt={prod.nombre} 
                                style={{ height: '220px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title fw-bold text-warning">{prod.nombre}</h5>
                                    <p className="card-text text-white-50 small">{prod.descripcion}</p>
                                </div>
                                <div className="mt-3">
                                    <span className="fs-4 fw-bold text-white d-block mb-3">{prod.precio}</span>
                                    <button className="btn btn-custom-outline w-100 fw-semibold">
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Changuito;