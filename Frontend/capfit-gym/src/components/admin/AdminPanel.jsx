import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPanel() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [imagen, setImagen] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    const token = localStorage.getItem('token');

    const obtenerProductos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error al cargar productos:", err));
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const url = editandoId 
            ? `http://localhost:5000/api/productos/${editandoId}` 
            : 'http://localhost:5000/api/productos';
        
        const method = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, precio, stock, imagen, descripcion })
        })
        .then(res => {
            if (!res.ok) throw new Error('No autorizado o error en la petición');
            return res.json();
        })
        .then(() => {
            alert(editandoId ? '¡Producto actualizado con éxito!' : '¡Producto creado con éxito!');
            limpiarFormulario();
            obtenerProductos();
        })
        .catch(err => {
            alert('Error: ' + err.message);
        });
    };

    const iniciarEdicion = (prod) => {
        setEditandoId(prod.id);
        setNombre(prod.nombre);
        setPrecio(prod.precio);
        setStock(prod.stock);
        setImagen(prod.imagen || '');
        setDescripcion(prod.descripcion || '');
    };

    const limpiarFormulario = () => {
        setEditandoId(null);
        setNombre('');
        setPrecio('');
        setStock('');
        setImagen('');
        setDescripcion('');
    };

    const eliminarProducto = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            fetch(`http://localhost:5000/api/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('No autorizado para eliminar');
                obtenerProductos();
            })
            .catch(err => alert('Error: ' + err.message));
        }
    };

    return (
        <div className="container py-5 text-white">
            <h2 className="text-warning fw-bold mb-4">Panel de Administración - Capfit Gym</h2>
            
            <div className="card bg-dark text-white p-4 mb-5 border-secondary">
                <h4 className="text-warning mb-3">
                    {editandoId ? `Editando Producto ID: ${editandoId}` : 'Agregar Nuevo Producto'}
                </h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control bg-black text-white border-secondary" value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Precio ($)</label>
                        <input type="number" className="form-control bg-black text-white border-secondary" value={precio} onChange={e => setPrecio(e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control bg-black text-white border-secondary" value={stock} onChange={e => setStock(e.target.value)} required />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">URL de Imagen</label>
                        <input type="text" className="form-control bg-black text-white border-secondary" placeholder="https://..." value={imagen} onChange={e => setImagen(e.target.value)} />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label">Descripción</label>
                        <input type="text" className="form-control bg-black text-white border-secondary" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                    </div>
                    <div className="col-12 mt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-warning fw-bold text-dark px-4">
                            <svg height="18" viewBox="0 0 21 21" width="18" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(3 3)">
                                    <path d="m7 1.5h-4.5c-1.1045695 0-2 .8954305-2 2v9.0003682c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5003682"/>
                                    <path d="m14.5.46667982c.5549155.5734054.5474396 1.48588056-.0167966 2.05011677l-6.9832034 6.98320341-3 1 1-3 6.9874295-7.04563515c.5136195-.5178979 1.3296676-.55351813 1.8848509-.1045243z"/>
                                    <path d="m12.5 2.5.953 1"/>
                                </g>
                            </svg>
                            {editandoId ? '💾' : ' Crear'}
                        </button>
                        {editandoId && (
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={limpiarFormulario}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h4 className="text-warning mb-3">Productos Actuales</h4>
            <div className="table-responsive">
                <table className="table table-dark table-striped align-middle border border-secondary">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(prod => (
                            <tr key={prod.id}>
                                <td>
                                    <img 
                                        src={prod.imagen || "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80"} 
                                        alt={prod.nombre} 
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                                    />
                                </td>
                                <td>{prod.id}</td>
                                <td>{prod.nombre}</td>
                                <td>${prod.precio}</td>
                                <td>{prod.stock} un.</td>
                                <td>
                                    <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                        <button 
                                            className="btn btn-sm btn-warning text-dark fw-bold py-1 px-2"
                                            style={{ fontSize: '12px' }}
                                            onClick={() => iniciarEdicion(prod)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger py-1 px-2"
                                            style={{ fontSize: '12px' }}
                                            onClick={() => eliminarProducto(prod.id)}
                                            title="Eliminar"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;