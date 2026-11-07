import { useState } from "react";

const MembresiaPago = () => {
    const token = localStorage.getItem("token");
    const [cargando, setCargando] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [ticketGenerado, setTicketGenerado] = useState(null);

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
                    titulo: "Membresía Mensual Capfit Gym",
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
        try {
            const resTicket = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    concepto: "Membresía Mensual Capfit Gym",
                    monto: 25000
                })
            });
            const dataTicket = await resTicket.json();
            setTicketGenerado(dataTicket.codigo_ticket);
        } catch (error) {
            console.error("Error al generar el ticket:", error);
        }
    };

    return (
        <div className="container py-4 text-center text-white" style={{ maxWidth: "600px" }}>
            <h2 className="text-warning fw-bold mb-3">Gestión de Membresía</h2>
            <p className="text-white-50 mb-4">Pagá tu cuota mensual escaneando el código QR con Mercado Pago y retirá tu beneficio por el local.</p>

            {!ticketGenerado ? (
                <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffb300" }}>
                    <h4 className="text-white mb-3">Pase Libre Mensual - Capfit Gym</h4>
                    <p className="fs-3 text-warning fw-bold mb-4">$25.000 ARS</p>

                    {!qrData ? (
                        <button 
                            onClick={manejarPagoQR} 
                            disabled={cargando}
                            className="btn btn-warning fw-bold text-dark px-5 py-3 rounded-pill w-100 shadow"
                        >
                            {cargando ? "Generando QR..." : "Generar QR de Pago 📱"}
                        </button>
                    ) : (
                        <div className="text-center mt-3">
                            <p className="text-warning mb-2">Escaneá este código desde la app de Mercado Pago:</p>
                            
                            {qrData.qr_image ? (
                                <div className="bg-white p-3 d-inline-block rounded-3 mb-3">
                                    <img 
                                        src={`data:image/png;base64,${qrData.qr_image}`} 
                                        alt="QR de Mercado Pago" 
                                        style={{ width: "200px", height: "200px" }} 
                                    />
                                </div>
                            ) : (
                                <p className="text-white-50">Utiliza el siguiente enlace de pago si prefieres:</p>
                            )}

                            <div className="d-grid gap-2 mt-2">
                                {qrData.init_point && (
                                    <a 
                                        href={qrData.init_point} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-outline-warning btn-sm"
                                    >
                                        O abrir pasarela web de pago 🚀
                                    </a>
                                )}
                                
                                <button 
                                    onClick={confirmarPagoExitoso}
                                    className="btn btn-success fw-bold mt-3 py-2"
                                >
                                    Simular Pago Aprobado y Emitir Ticket ✓
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 rounded-4 shadow-sm bg-dark border border-success text-start">
                    <div className="text-center mb-3">
                        <span className="badge bg-success fs-6 px-3 py-2">¡Pago Aprobado con Éxito! ✓</span>
                    </div>
                    <h5 className="text-warning text-center mb-3">🎫 Comprobante Digital (Ticket)</h5>
                    <hr className="border-secondary" />
                    <p><strong>Código de Retiro:</strong> <span className="text-warning font-monospace">{ticketGenerado}</span></p>
                    <p><strong>Concepto:</strong> Membresía Mensual Capfit Gym</p>
                    <p><strong>Monto:</strong> $25.000 ARS</p>
                    <p className="text-white-50 small mt-3 mb-0 text-center">Presentá este código en la recepción de Capfit Gym para validar tu ingreso.</p>
                </div>
            )}
        </div>
    );
};

export default MembresiaPago;