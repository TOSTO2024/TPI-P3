import { useState, useEffect, useCallback } from "react";

const ClasesFuncional = () => {
    const token = localStorage.getItem("token");
    const [reservasServidor, setReservasServidor] = useState([]);
    const [diaSeleccionado, setDiaSeleccionado] = useState("Lunes");
    const [mensajeFeedback, setMensajeFeedback] = useState(null); 

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

    const cargarReservas = useCallback(() => {
        if (!token) return;

        fetch('http://localhost:5000/api/reservas', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Reservas cargadas del servidor:", data);
            if (Array.isArray(data)) setReservasServidor(data);
        })
        .catch(err => console.error("Error cargando reservas:", err));
    }, [token]);

    useEffect(() => {
        cargarReservas();
    }, [cargarReservas]);

    const manejarReservaToggle = (horario) => {
        if (!token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para poder reservar una clase.",
                tipo: "danger"
            });
            return;
        }

        const horarioCompleto = `${diaSeleccionado} - ${horario}`;
        
        console.log("Horario armándose en cliente:", horarioCompleto);
        console.log("Reservas actuales en memoria:", reservasServidor);

        const reservaExistente = reservasServidor.find(r => r.horario === horarioCompleto);

        if (reservaExistente) {
            console.log("¡Encontró reserva para borrar con ID:", reservaExistente.id);
            
            setReservasServidor(prev => prev.filter(r => r.id !== reservaExistente.id));

            fetch(`http://localhost:5000/api/reservas/${reservaExistente.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(() => {
                setMensajeFeedback({
                    texto: `Has cancelado tu turno de las ${horario} el día ${diaSeleccionado}.`,
                    tipo: "warning"
                });
                cargarReservas();
            });

        } else {
            console.log("No existe, procediendo a crear reserva...");

            fetch('http://localhost:5000/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    claseId: 1, 
                    horario: horarioCompleto 
                })
            })
            .then(res => res.json())
            .then((data) => {
                console.log("Respuesta del servidor al crear:", data);
                setMensajeFeedback({
                    texto: `¡Reserva exitosa para el turno de las ${horario} (${diaSeleccionado})!`,
                    tipo: "success"
                });
                cargarReservas();
            })
            .catch(err => console.error("Error en POST:", err));
        }
    };

    return (
        <div className="container py-4 text-center">
            <h2 className="text-warning fw-bold mb-2">Seleccioná un día</h2>
            <p className="text-white-50 mb-4">Elegí la fecha para ver los horarios disponibles de Clases Funcionales.</p>
            
            {mensajeFeedback && (
                <div 
                    className={`alert alert-${mensajeFeedback.tipo} alert-dismissible fade show mx-auto mb-4`} 
                    role="alert" 
                    style={{ maxWidth: "600px", backgroundColor: mensajeFeedback.tipo === "success" ? "#198754" : mensajeFeedback.tipo === "warning" ? "#ffc107" : "#dc3545", color: "#fff", border: "none" }}
                >
                    {mensajeFeedback.texto}
                    <button type="button" className="btn-close btn-close-white" onClick={() => setMensajeFeedback(null)}></button>
                </div>
            )}

            <div className="d-flex justify-content-center gap-2 overflow-auto pb-4 mb-3">
                {diasSemana.map((d) => {
                    const activo = diaSeleccionado === d.nombre;
                    return (
                        <div
                            key={d.nombre}
                            onClick={() => {
                                setDiaSeleccionado(d.nombre);
                                setMensajeFeedback(null); 
                            }}
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

            <div className="mx-auto" style={{ maxWidth: "600px" }}>
                <h4 className="text-warning fw-bold mb-3">
                    Turnos para el día <span className="text-white">{diaSeleccionado}</span>
                </h4>

                <div className="d-flex flex-column gap-3">
                    {horariosClases.map((horario) => {
                        const horarioCompleto = `${diaSeleccionado} - ${horario}`;
                        const estaReservado = Array.isArray(reservasServidor) && reservasServidor.some(r => r && r.horario === horarioCompleto);

                        return (
                            <div 
                                key={horario}
                                className="d-flex justify-content-between align-items-center p-3 rounded-3 shadow-sm"
                                style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffb300" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <span className="fs-5 text-warning fw-bold">⏰ {horario}</span>
                                    <span className="badge bg-dark text-white-50 border border-secondary">Funcional</span>
                                </div>
                                <button
                                    className={`btn fw-bold px-4 py-2 ${estaReservado ? "btn-success" : "btn-warning text-dark"}`}
                                    onClick={() => manejarReservaToggle(horario)}
                                >
                                    {estaReservado ? "Reservado ✓" : "Reservar Turno"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ClasesFuncional