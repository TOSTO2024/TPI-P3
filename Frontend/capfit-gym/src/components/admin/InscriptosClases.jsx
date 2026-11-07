import { useState, useEffect, useCallback } from "react";

const InscriptosClases = () => {
    const token = localStorage.getItem("token");
    const [reservas, setReservas] = useState([]);
    const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes");

    const diasSemana = [
        { nombre: "Lunes", fecha: "7" },
        { nombre: "Martes", fecha: "8" },
        { nombre: "Miércoles", fecha: "9" },
        { nombre: "Jueves", fecha: "10" },
        { nombre: "Viernes", fecha: "11" }
    ];

    const horariosClases = [
        "08:00 - 09:00",
        "10:00 - 11:00",
        "14:00 - 15:00",
        "16:00 - 17:00",
        "18:00 - 19:00",
        "20:00 - 21:00"
    ];

    const cargarTodasLasReservas = useCallback(() => {
        if (!token) return;

        fetch('http://localhost:5000/api/admin/reservas', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setReservas(data);
        })
        .catch(err => console.error("Error cargando inscriptos:", err));
    }, [token]);

    useEffect(() => {
        cargarTodasLasReservas();
    }, [cargarTodasLasReservas]);

    return (
        <div className="container py-4 text-center">
            <h2 className="text-warning fw-bold mb-2">Inscriptos en Clases Funcionales</h2>
            <p className="text-white-50 mb-4">Seleccioná un día para ver los alumnos anotados por horario.</p>

            <div className="d-flex justify-content-center gap-2 overflow-auto pb-4 mb-3">
                {diasSemana.map((d) => {
                    const activo = diaSeleccionado === d.nombre;
                    return (
                        <div
                            key={d.nombre}
                            onClick={() => setDiaSeleccionado(d.nombre)}
                            className="p-3 rounded-4 shadow-sm"
                            style={{
                                minWidth: "90px",
                                cursor: "pointer",
                                backgroundColor: activo ? "#ffb300" : "#1a1a1a",
                                color: activo ? "#000" : "#fff",
                                border: activo ? "2px solid #ffb300" : "1px solid #333",
                                transform: activo ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <div className="small text-uppercase fw-semibold" style={{ opacity: activo ? 0.9 : 0.6 }}>{d.nombre.substring(0, 3)}</div>
                            <div className="fs-3 fw-bold my-1">{d.fecha}</div>
                            <div className="small" style={{ opacity: activo ? 0.9 : 0.5 }}>nov</div>
                        </div>
                    );
                })}
            </div>

            <hr className="border-secondary my-4 opacity-25" />

            <div className="mx-auto" style={{ maxWidth: "700px" }}>
                <h4 className="text-warning fw-bold mb-4">
                    Turnos para el día <span className="text-white">{diaSeleccionado}</span>
                </h4>

                <div className="d-flex flex-column gap-4">
                    {horariosClases.map((horario) => {
                        const horarioCompletoBusqueda = `${diaSeleccionado} - ${horario}`;
                        
                        const inscriptosTurno = reservas.filter(r => r.horario === horarioCompletoBusqueda);

                        return (
                            <div 
                                key={horario}
                                className="p-3 rounded-3 shadow-sm text-start"
                                style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffb300" }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fs-5 text-warning fw-bold">⏰ {horario} hs</span>
                                    <span className="badge bg-dark text-white-50 border border-secondary">
                                        Inscriptos: {inscriptosTurno.length}
                                    </span>
                                </div>

                                {inscriptosTurno.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-dark table-striped table-bordered mb-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "50px" }}>#</th>
                                                    <th>Nombre del Alumno</th>
                                                    <th>Email de Contacto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inscriptosTurno.map((al, index) => (
                                                    <tr key={al.id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{al.nombre}</td>
                                                        <td>{al.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-white-50 text-center fst-italic mb-0 py-2">
                                        No hay alumnos inscriptos en este turno todavía.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InscriptosClases;