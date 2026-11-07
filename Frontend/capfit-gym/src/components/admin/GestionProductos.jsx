import { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idActual, setIdActual] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        precio: "",
        stock: "",
        imagen: "",
        descripcion: ""
    });

    const token = localStorage.getItem("token");

    const cargarProductos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(() => setFeedback({ texto: "Error al cargar los productos.", variante: "danger" }));
    };

    useEffect(() => {
        cargarProductos();
    }, []);
    
    const handleSave = (e) => {
        e.preventDefault();
        const url = modoEdicion 
            ? `http://localhost:5000/api/productos/${idActual}` 
            : 'http://localhost:5000/api/productos';
        
        const method = modoEdicion ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al guardar el producto");
            return res.json();
        })
        .then(() => {
            cargarProductos();
            setShowModal(false);
            resetForm();
            setFeedback({ 
                texto: modoEdicion ? "¡Producto actualizado con éxito!" : "¡Producto creado con éxito!", 
                variante: "success" 
            });
        })
        .catch(err => setFeedback({ texto: err.message, variante: "danger" }));
    };

    const handleEdit = (prod) => {
        setForm(prod);
        setIdActual(prod.id);
        setModoEdicion(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        fetch(`http://localhost:5000/api/productos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo eliminar");
            cargarProductos();
            setFeedback({ texto: "Producto eliminado correctamente.", variante: "warning" });
        })
        .catch(err => setFeedback({ texto: err.message, variante: "danger" }));
    };

    const resetForm = () => {
        setForm({ nombre: "", precio: "", stock: "", imagen: "", descripcion: "" });
        setModoEdicion(false);
        setIdActual(null);
    };

    return (
        <div className="text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-warning m-0">Gestión de Productos e Ítems</h3>
                <Button variant="warning" className="fw-bold text-dark" onClick={() => { resetForm(); setShowModal(true); }}>
                    + Nuevo Producto
                </Button>
            </div>

            {feedback && (
                <Alert variant={feedback.variante} dismissible onClose={() => setFeedback(null)}>
                    {feedback.texto}
                </Alert>
            )}

            <Table striped bordered hover variant="dark" responsive className="align-middle text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td><img src={p.imagen} alt={p.nombre} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }} /></td>
                            <td className="text-start">{p.nombre}</td>
                            <td>${p.precio}</td>
                            <td>{p.stock}</td>
                            <td>
                                <Button size="sm" variant="outline-warning" className="me-2" onClick={() => handleEdit(p)}>Editar</Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border border-warning">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title className="text-warning">{modoEdicion ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio ($)</Form.Label>
                            <Form.Control type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL de Imagen</Form.Label>
                            <Form.Control type="text" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={2} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                        </Form.Group>
                        <Button variant="warning" type="submit" className="w-100 fw-bold text-dark">
                            {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionProductos;