import { useState } from "react";
import { Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const generarCodigoAleatorio = () => {
    return 'CAPFIT-RET-' + Math.floor(100000 + Math.random() * 900000);
};

const Changuito = ({ carrito = [], onActualizarCantidad, onEliminar, onVaciarCarrito }) => {
    const [mensajeFeedback, setMensajeFeedback] = useState(null);  
    const [comprobanteCompra, setComprobanteCompra] = useState(null);

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const handleFinalizarCompra = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para poder finalizar la compra.",
                variante: "danger"
            });
            return;
        }

        const itemsComprados = carrito.map(prod => ({
            id: prod.id,
            cantidad: prod.cantidad
        }));

        try {
            const resStock = await fetch('http://localhost:5000/api/productos/comprar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: itemsComprados })
            });

            if (!resStock.ok) {
                const data = await resStock.json();
                setMensajeFeedback({
                    texto: data.mensaje || "Error al procesar el stock de la compra.",
                    variante: "danger"
                });
                return;
            }

            const resMp = await fetch('http://localhost:5000/api/crear-preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: 'Compra de Suplementos / Productos - Capfit Gym',
                    precio: total 
                })
            });

            const dataMp = await resMp.json();

            if (dataMp.init_point) {
                window.open(dataMp.init_point, '_blank');
            }

            setMensajeFeedback({
                texto: "¡Pedido confirmado y stock actualizado! Redirigiendo a Mercado Pago... 💪🏻😄",
                variante: "success"
            });

            if (onVaciarCarrito) {
                onVaciarCarrito();
            }

        } catch (error) {
            console.error("Error en la pasarela de compra:", error);
            setMensajeFeedback({
                texto: "Error de conexión con el servidor.",
                variante: "danger"
            });
        }
    };

    const handleSimulacionPago = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para realizar la simulación.",
                variante: "danger"
            });
            return;
        }

        if (carrito.length === 0) return;

        const productosCompradosCopia = [...carrito];
        const montoTotalCopia = total;

        const itemsComprados = carrito.map(prod => ({
            id: prod.id,
            cantidad: prod.cantidad
        }));

        try {
            await fetch('http://localhost:5000/api/productos/comprar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: itemsComprados })
            });

            setComprobanteCompra({
                codigo: generarCodigoAleatorio(),
                productos: productosCompradosCopia,
                montoTotal: montoTotalCopia
            });

            if (onVaciarCarrito) {
                onVaciarCarrito();
            }

        } catch (error) {
            console.error("Error en la simulación:", error);
        }
    };

    if (comprobanteCompra) {
        return (
            <div className="changuito-container text-white">
                <div className="p-3 rounded-4 shadow-sm bg-dark border border-success text-start mb-3">
                    <div className="text-center mb-2">
                        <span className="badge bg-success fs-6 px-3 py-2">¡Compra Simulada con Éxito! ✓</span>
                    </div>
                    <h6 className="text-warning text-center mb-2">🎫 Comprobante de Retiro</h6>
                    <p className="small mb-1 text-center text-info">Código: <strong>{comprobanteCompra.codigo}</strong></p>
                    <hr className="border-secondary my-2" />
                    <ul className="list-unstyled small mb-2">
                        {comprobanteCompra.productos.map((p, idx) => (
                            <li key={idx} className="d-flex justify-content-between">
                                <span>{p.cantidad}x {p.nombre}</span>
                                <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <hr className="border-secondary my-2" />
                    <p className="fw-bold mb-1">Total abonado: <span className="text-warning">${comprobanteCompra.montoTotal.toFixed(2)}</span></p>
                    <p className="text-white-50 small mt-2 mb-0 text-center">Presentá este comprobante en la recepción de Capfit Gym para retirar tus productos.</p>
                </div>
                <button 
                    className="btn btn-outline-warning btn-sm w-100 fw-bold"
                    onClick={() => {
                        setComprobanteCompra(null);
                    }}
                >
                    Seguir comprando
                </button>
            </div>
        );
    }

    if (carrito.length === 0) {
        return (
            <div className="text-center py-3 text-white-50">
                <p className="m-0">Tu changuito está vacío 🛒</p>
            </div>
        );
    }

    return (
        <div className="changuito-container text-white">
            {mensajeFeedback && (
                <Alert 
                    variant={mensajeFeedback.variante} 
                    dismissible 
                    onClose={() => setMensajeFeedback(null)}
                    className="fw-semibold text-center py-2 mb-3 fs-6"
                >
                    {mensajeFeedback.texto}
                </Alert>
            )}

            <ul className="list-unstyled mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {carrito.map((item) => (
                    <li key={item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                        <div className="d-flex align-items-center">
                            <img 
                                src={item.imagen} 
                                alt={item.nombre} 
                                style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} 
                                className="me-2"
                            />
                            <div>
                                <h6 className="m-0 text-warning" style={{ fontSize: '13px' }}>{item.nombre}</h6>
                                <div className="d-flex align-items-center mt-1">
                                    <button 
                                        className="btn btn-sm btn-outline-warning py-0 px-1" 
                                        style={{ fontSize: '12px' }}
                                        onClick={() => onActualizarCantidad(item.id, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="mx-2 text-white" style={{ fontSize: '12px' }}>{item.cantidad}</span>
                                    <button 
                                        className="btn btn-sm btn-outline-warning py-0 px-1" 
                                        style={{ fontSize: '12px' }}
                                        onClick={() => onActualizarCantidad(item.id, 1)}
                                    >
                                        +
                                    </button>
                                    <span className="ms-2 text-white-50" style={{ fontSize: '11px' }}>(${item.precio.toFixed(2)} "c/u")</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-end">
                            <span className="fw-bold text-white d-block" style={{ fontSize: '13px' }}>
                                ${ (item.precio * item.cantidad).toFixed(2) }
                            </span>
                            <button 
                                className="btn btn-link text-danger p-0 mt-1" 
                                style={{ fontSize: '12px', textDecoration: 'none' }}
                                onClick={() => onEliminar(item.id)}
                                title="Eliminar producto"
                            >
                                eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="border-top border-secondary pt-2 d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold text-warning fs-5">${total.toFixed(2)}</span>
            </div>

            <button 
                className="btn btn-warning w-100 fw-bold text-dark py-2 mb-2"
                onClick={handleFinalizarCompra}
            >
                Finalizar Compra 💪🏻😄
            </button>

            <button 
                className="btn btn-outline-success btn-sm w-100 fw-bold py-1"
                style={{ fontSize: '12px' }}
                onClick={handleSimulacionPago}
            >
                Simulación pago 
            </button>
        </div>
    );
};

export default Changuito;