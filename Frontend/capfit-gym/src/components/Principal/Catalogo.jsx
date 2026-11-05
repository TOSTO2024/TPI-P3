import { useState, useEffect } from 'react';

function CatalogoCliente({ onAgregarAlChanguito }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {

    fetch('http://localhost:5000/api/productos')
    .then((res) => res.json())
    .then((data) => {
        setProductos(data);
        setLoading(false);
    })
    .catch((error) => {
        console.error('Error al cargar el catálogo:', error);
        setLoading(false);
    });
}, []);

if (loading) return <p style={{ color: '#ffb300' }}>Cargando suplementos de Capfit Gym...</p>;

return (
    <div className="catalogo-container" style={{ padding: '20px', color: '#fff' }}>
    <h2>Catálogo de Productos</h2>
    <div className="productos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginTop: '15px' }}>
        {productos.map((prod) => (
        <div key={prod.id} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{prod.nombre}</h3>
            <p style={{ color: '#ffb300', fontWeight: 'bold', fontSize: '16px' }}>${prod.precio}</p>
            <p style={{ fontSize: '12px', color: '#aaa' }}>Stock disponible: {prod.stock}</p>
            <button 
            onClick={() => onAgregarAlChanguito(prod)}
            style={{ 
                background: '#ffb300', 
                color: '#0d0d0d', 
                border: 'none', 
                padding: '8px 12px', 
                fontWeight: 'bold', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%'
            }}
            >
            Agregar al Changuito 🛒
            </button>
        </div>
        ))}
    </div>
    </div>
);
}

export default CatalogoCliente;