import { useState, useEffect, useCallback } from "react";
import { Table, Alert, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const token = localStorage.getItem("token");
    
    const rolActual = localStorage.getItem("rol"); 

    const cargarClientes = useCallback(() => {
        fetch('http://localhost:5000/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudieron cargar los clientes.");
            return res.json();
        })
        .then(data => setClientes(data))
        .catch(() => {
            setClientes([
                { id: 1, nombre: "Dueño Supremo", email: "sysadmin@capfit.com", rol: "sysadmin", dni: "11111111" },
                { id: 2, nombre: "Administrador", email: "admin@capfit.com", rol: "admin", dni: "22222222" },
                { id: 3, nombre: "Cliente promedio", email: "cliente@capfit.com", rol: "cliente", dni: "33333333" }
            ]);
        });
    }, [token]);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    const cambiarRolUsuario = (id, nuevoRol) => {
        fetch(`http://localhost:5000/api/usuarios/${id}/rol`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rol: nuevoRol })
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo actualizar el rol");
            return res.json();
        })
        .then(() => {
            setFeedback({ texto: "¡Rol actualizado correctamente en la base de datos!", variante: "success" });
            cargarClientes();
        })
        .catch(err => {
            setFeedback({ texto: err.message, variante: "danger" });
        });
    };

    return (
        <div className="text-white">
            <h3 className="text-warning mb-4">Gestión de Clientes y Roles</h3>

            {feedback && (
                <Alert variant={feedback.variante} dismissible onClose={() => setFeedback(null)}>
                    {feedback.texto}
                </Alert>
            )}

            <Table striped bordered hover variant="dark" responsive className="align-middle text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre y Apellido</th>
                        <th>Email</th>
                        <th>DNI</th>
                        <th>Rol del Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td className="text-start">{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.dni || "No especificado"}</td>
                            <td>
                                {rolActual === "sysadmin" ? (
                                    <Form.Select
                                        size="sm"
                                        value={c.rol}
                                        onChange={(e) => cambiarRolUsuario(c.id, e.target.value)}
                                        className="bg-dark text-white border-warning fw-semibold text-center"
                                        style={{ maxWidth: "160px", margin: "0 auto" }}
                                    >
                                        <option value="cliente">cliente</option>
                                        <option value="admin">admin</option>
                                        <option value="sysadmin">sysadmin</option>
                                    </Form.Select>
                                ) : (
                                    <span className={`badge ${c.rol === 'sysadmin' ? 'bg-danger' : c.rol === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                        {c.rol}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListaClientes;