import { useState, useEffect } from "react";

const MembresiaPago = () => {
    const token = localStorage.getItem("token");

    const [cargando, setCargando] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [fechaUltimoPago, setFechaUltimoPago] = useState(null);
    const [tiempoRestante, setTiempoRestante] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

    const fechaActual = new Date();
    const nombreMes = fechaActual.toLocaleString('es-ES', { month: 'long' });
    const anioActual = fechaActual.getFullYear();
    const mesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    const conceptoMembresia = `Membresía ${mesCapitalizado} ${anioActual} - Capfit Gym`;

    useEffect(() => {
        fetch('http://localhost:5000/api/usuarios/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.membresia_expiracion) {
                setFechaUltimoPago(data.membresia_expiracion);
            }
        })
        .catch(err => console.error("Error al obtener perfil:", err));
    }, [token]);

    useEffect(() => {
        if (!fechaUltimoPago) return;

        const fechaExpiracionMs = new Date(fechaUltimoPago).getTime();

        const intervalo = setInterval(() => {
            const ahora = new Date().getTime();
            const diferencia = fechaExpiracionMs - ahora;

            if (diferencia <= 0) {
                clearInterval(intervalo);
                setTiempoRestante({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
                setFechaUltimoPago(null);
            } else {
                const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                setTiempoRestante({ dias, horas, minutos, segundos });
            }
        }, 1000);

        return () => clearInterval(intervalo);
    }, [fechaUltimoPago]);

    const manejarPagoQR = async () => {
        setCargando(true);
        try {
            const res = await fetch('http://localhost:5000/api/crear-preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: conceptoMembresia,
                    precio: 25000 
                })
            });

            const data = await res.json();
            if (data.qr_image || data.init_point) {
                setQrData(data);
            }
        } catch (error) {
            console.error("Error en el pago:", error);
        } finally {
            setCargando(false);
        }
    };

    const confirmarPagoExitoso = async () => {
        const fechaExpiracionLocal = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();
        
        setFechaUltimoPago(fechaExpiracionLocal);

        try {
            await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    concepto: conceptoMembresia,
                    monto: 25000
                })
            });

            await fetch('http://localhost:5000/api/usuarios/membresia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error al procesar el pago:", error);
        }
    };
    
    return (
        <div className="container py-4 text-center text-white" style={{ maxWidth: "600px" }}>
            <h2 className="text-warning fw-bold mb-3">Gestión de Membresía</h2>
            <p className="text-white-50 mb-4">Pagá tu cuota mensual escaneando el código QR con Mercado Pago.</p>

            {!fechaUltimoPago ? (
                <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffb300" }}>
                    <h4 className="text-white mb-3">Membresía {mesCapitalizado} {anioActual} - Capfit Gym</h4>
                    <p className="fs-3 text-warning fw-bold mb-4">$25.000 ARS</p>

                    {!qrData ? (
                        <button 
                            onClick={manejarPagoQR} 
                            disabled={cargando}
                            className="btn btn-warning fw-bold text-dark px-5 py-3 rounded-pill w-100 shadow"
                        >
                            {cargando ? "Generando pago..." : "Generar Pago con QR 📱"}
                        </button>
                    ) : (
                        <div className="text-center mt-3">
                            {qrData.qr_image && (
                                <div className="bg-white p-3 d-inline-block rounded-3 mb-3">
                                    <img 
                                        src={`data:image/png;base64,${qrData.qr_image}`} 
                                        alt="QR de Mercado Pago" 
                                        style={{ width: "200px", height: "200px" }} 
                                    />
                                </div>
                            )}

                            <p className="text-white-50 mb-3">Utiliza el siguiente enlace de pago si prefieres:</p>

                            <div className="d-grid gap-2">
                                {qrData.init_point && (
                                    <a 
                                        href={qrData.init_point} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-warning fw-bold py-2 text-dark shadow"
                                    >
                                        Pagar con Mercado Pago 🚀
                                    </a>
                                )}
                                
                                <button 
                                    onClick={confirmarPagoExitoso}
                                    className="btn btn-success fw-bold mt-2 py-2"
                                >
                                    Simular pago exitoso y generar ticket ✓
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="p-4 rounded-4 shadow-sm bg-dark border border-success text-start mb-4">
                        <div className="text-center mb-3">
                            <span className="badge bg-success fs-6 px-3 py-2">¡Pago Aprobado con Éxito! ✓</span>
                        </div>
                        <h5 className="text-warning text-center mb-3">🎫 Comprobante Digital</h5>
                        <hr className="border-secondary" />
                        <p><strong>Concepto:</strong> {conceptoMembresia}</p>
                        <p><strong>Monto:</strong> $25.000 ARS</p>
                        <p className="text-white-50 small mt-3 mb-0 text-center">Presentá tu cuenta en la recepción de Capfit Gym para validar tu ingreso.</p>
                    </div>

                    <div className="p-4 rounded-4 shadow-sm text-center" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffb300" }}>
                        <h6 className="text-white-50 mb-2">⏱️ Tiempo restante para tu próxima renovación:</h6>
                        <div className="row text-warning fw-bold fs-4 mt-3">
                            <div className="col">
                                {tiempoRestante.dias} <span className="d-block fs-6 text-white-50">Días</span>
                            </div>
                            <div className="col">
                                {tiempoRestante.horas} <span className="d-block fs-6 text-white-50">Horas</span>
                            </div>
                            <div className="col">
                                {tiempoRestante.minutos} <span className="d-block fs-6 text-white-50">Minutos</span>
                            </div>
                            <div className="col">
                                {tiempoRestante.segundos} <span className="d-block fs-6 text-white-50">Segundos</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembresiaPago;