import { useState } from "react";

const ClasesFuncional = () => {
    const emailUsuario = localStorage.getItem("email") || "invitado";

    const [reservas, setReservas] = useState(() => {
        return JSON.parse(localStorage.getItem(`reservas_${emailUsuario}`)) || [];
    });

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

    const manejarReserva = (horario) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para poder reservar una clase.");
            return;
        }

        const claveReserva = `${diaSeleccionado} - ${horario}`;
        let nuevasReservas;

        if (reservas.includes(claveReserva)) {
            nuevasReservas = reservas.filter(r => r !== claveReserva);
            alert(`Has cancelado tu turno de Funcional para el día ${diaSeleccionado} (${horario}).`);
        } else {
            nuevasReservas = [...reservas, claveReserva];
            alert(`¡Reserva exitosa para Funcional el día ${diaSeleccionado} de ${horario}!`);
        }

        setReservas(nuevasReservas);
        // Guardar en localStorage asociado al usuario actual
        localStorage.setItem(`reservas_${emailUsuario}`, JSON.stringify(nuevasReservas));
    };

    return (
        <div className="container py-4 text-center">
            <h2 className="text-warning fw-bold mb-2">Seleccioná un día</h2>
            <p className="text-white-50 mb-4">Elegí la fecha para ver los horarios disponibles de Clases Funcionales.</p>
            
            <div className="d-flex justify-content-center gap-2 overflow-auto pb-4 mb-3">
                {diasSemana.map((d) => {
                    const activo = diaSeleccionado === d.nombre;
                    return (
                        <div
                            key={d.nombre}
                            onClick={() => setDiaSeleccionado(d.nombre)}
                            className="p-3 rounded-4 shadow-sm transition-all"
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
                            <div className="small text-uppercase fw-semibold" style={{ opacity: activo ? 0.9 : 0.6 }}>
                                {d.nombre.substring(0, 3)}
                            </div>
                            <div className="fs-3 fw-bold my-1">
                                {d.fecha}
                            </div>
                            <div className="small" style={{ opacity: activo ? 0.9 : 0.5 }}>
                                nov
                            </div>
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
                        const claveReserva = `${diaSeleccionado} - ${horario}`;
                        const estaReservado = reservas.includes(claveReserva);

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
                                    onClick={() => manejarReserva(horario)}
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

export default ClasesFuncional;