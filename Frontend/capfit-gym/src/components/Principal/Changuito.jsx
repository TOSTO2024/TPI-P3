import { useState } from "react";
import { Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Changuito = ({ carrito = [], onActualizarCantidad, onEliminar, onVaciarCarrito }) => {
    const [mensajeFeedback, setMensajeFeedback] = useState(null);  

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const handleFinalizarCompra = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para poder finalizar la compra.",
                variante: "danger"
            });
            return;
        }

        setMensajeFeedback({
            texto: "¡Pedido confirmado con éxito! Gracias por elegir Capfit Gym. 💪🏻😄",
            variante: "success"
        });

        if (onVaciarCarrito) {
            setTimeout(() => {
                onVaciarCarrito();
            }, 1500);
        }
    };

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
                className="btn btn-warning w-100 fw-bold text-dark py-2"
                onClick={handleFinalizarCompra}
            >
                Finalizar Compra 💪🏻😄
            </button>
        </div>
    );
};

export default Changuito;