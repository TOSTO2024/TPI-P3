import { useState, useEffect, useCallback } from "react";

const ListaClientes = () => {
    const [usuarios, setUsuarios] = useState([]);
    const token = localStorage.getItem("token");
    const rolActual = localStorage.getItem("rol");

    const cargarUsuarios = useCallback(() => {
        fetch('http://localhost:5000/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setUsuarios(data);
            }
        })
        .catch(err => console.error("Error al obtener clientes:", err));
    }, [token]);

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

    const cambiarRol = async (idUsuario, nuevoRol) => {
        try {
            const res = await fetch(`http://localhost:5000/api/usuarios/${idUsuario}/rol`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });

            if (res.ok) {
                cargarUsuarios(); 
            } else {
                const errorData = await res.json();
                alert(errorData.mensaje || "Error al actualizar el rol.");
            }
        } catch (error) {
            console.error("Error en la petición de cambio de rol:", error);
        }
    };

    const calcularTiempoRestante = (fechaExpiracion) => {
        if (!fechaExpiracion) return <span className="text-muted">Sin membresía</span>;

        const diferencia = new Date(fechaExpiracion).getTime() - new Date().getTime();

        if (diferencia <= 0) {
            return <span className="text-danger small">Expirada ❌</span>;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

        return (
            <span className="text-warning small fw-bold">
                ⏱️ {dias}d {horas}h {minutos}m
            </span>
        );
    };

    return (
        <div className="container py-4 text-white">
            <h2 className="text-warning fw-bold text-center mb-4">Gestión de Clientes y Roles</h2>
            
            <div className="table-responsive">
                <table className="table table-dark table-striped align-middle" style={{ border: "1px solid #ffb300" }}>
                    <thead>
                        <tr className="text-warning">
                            <th>ID</th>
                            <th>Nombre y Apellido</th>
                            <th>Email</th>
                            <th>DNI</th>
                            <th>Tiempo Restante</th>
                            <th>Rol del Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombre}</td>
                                <td>{u.email}</td>
                                <td>{u.dni || "No especificado"}</td>
                                <td>{calcularTiempoRestante(u.membresia_expiracion)}</td>
                                <td>
                                    {rolActual === 'sysadmin' ? (
                                        <select 
                                            value={u.rol} 
                                            onChange={(e) => cambiarRol(u.id, e.target.value)}
                                            className="form-select form-select-sm bg-dark text-warning border-warning fw-bold"
                                        >
                                            <option value="cliente">cliente</option>
                                            <option value="admin">admin</option>
                                            <option value="sysadmin">sysadmin</option>
                                        </select>
                                    ) : (
                                        <span className="badge bg-secondary text-dark px-3 py-2 fw-bold" style={{ backgroundColor: "#ffb300" }}>
                                            {u.rol}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaClientes;