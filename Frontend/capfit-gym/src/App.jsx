import { useState } from "react";
import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import Carrusel from "./components/Principal/Carrusel";
import Catalogo from "./components/Principal/Catalogo";
import Changuito from "./components/Principal/Changuito";
import AdminPanel from "./components/admin/AdminPanel";
import ClasesFuncional from "./components/Principal/ClasesFuncional";
import MembresiaYPago from "./components/priv/MembresiaPago"; 
import { Alert, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import capfitLogoNormal from "./img/logoNormal.jpeg";

function App() {
    const [principal, setPrincipal] = useState("home");
    const [carrito, setCarrito] = useState([]);
    const [mostrarChanguitoFlotante, setMostrarChanguitoFlotante] = useState(false);
    const [mensajeFeedback, setMensajeFeedback] = useState(null);
    const [mostrarModalUbicacion, setMostrarModalUbicacion] = useState(false);

    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const existe = prevCarrito.find((item) => item.id === producto.id);
            if (existe) {
                return prevCarrito.map((item) =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        });

        setMensajeFeedback({
            texto: `¡Agregaste "${producto.nombre}" al changuito!`,
            variante: "success"
        });
    };

    const manejarClickCarrito = () => {
        if (!token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para ver y usar tu changuito.",
                variante: "danger"
            });
            setPrincipal("login");
            return;
        }

        if (principal !== "tienda") {
            setPrincipal("tienda");
            setMostrarChanguitoFlotante(false);
        } else {
            setMostrarChanguitoFlotante(!mostrarChanguitoFlotante);
        }
    };

    const actualizarCantidad = (id, delta) => {
        setCarrito((prevCarrito) => {
            return prevCarrito
                .map((item) => {
                    if (item.id === id) {
                        const nuevaCantidad = item.cantidad + delta;
                        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
                    }
                    return item;
                })
                .filter(Boolean);
        });
    };

    const eliminarDelCarrito = (id) => {
        setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id));
    };

    const cerrarSesion = () => {
        localStorage.clear();
        setCarrito([]);
        setPrincipal("home");
        setMensajeFeedback({
            texto: "Sesión cerrada correctamente.",
            variante: "warning"
        });
    };

    const cambiarVista = (nuevaVista) => {
        if (nuevaVista === "admin") {
            if (!token || (rol !== "admin" && rol !== "sysadmin")) {
                setMensajeFeedback({
                    texto: "Acceso denegado. Debes ser administrador.",
                    variante: "danger"
                });
                setPrincipal("login");
                return;
            }
        }
        if ((nuevaVista === "clases" || nuevaVista === "membresia") && !token) {
            setMensajeFeedback({
                texto: "Debes iniciar sesión para acceder a esta sección.",
                variante: "danger"
            });
            setPrincipal("login");
            return;
        }
        setPrincipal(nuevaVista);
        setMostrarChanguitoFlotante(false);
    };

    return (
        <div className="app-container" style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", color: "#fff" }}>
            <nav className="d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: "#1a1a1a", borderBottom: "2px solid #ffb300" }}>
                <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => cambiarVista("home")}>
                    <img
                        src={capfitLogoNormal}
                        alt="Capfit Gym Logo"
                        style={{ height: "45px", objectFit: "contain" }}
                        className="me-4"
                    />
                    <h3 className="fw-bold m-0 fs-5">
                        <span className="text-white">CAPFIT</span>
                        <span className="text-warning"> GYM</span>
                    </h3>
                </div>

                <div className="d-flex align-items-center position-relative">
                    <button
                        className="btn fw-semibold d-flex align-items-center justify-content-center p-2 me-3 border-0 text-dark btn-mapa-hover"
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            backgroundColor: "#ffb300",
                            transition: "background-color 0.2s ease"
                        }}
                        onClick={() => setMostrarModalUbicacion(true)}
                        title="Ubicación"
                    >        
                        <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(4 2)">
                                <path d="m6.5 16.5407715.6311176-.7118691c.71585099-.8191184 1.36011688-1.5983525 1.93279767-2.3377022l.4733382-.6239608c1.97516433-2.6615039 2.96274653-4.77276704 2.96274653-6.33378943 0-3.33218241-2.6862915-6.03344997-6-6.03344997s-6 2.70126756-6 6.03344997c0 1.56102239.98758218 3.67228553 2.96274653 6.33378943l.4733382.6239608c.73630387.9505925 1.5909423 1.9671163 2.56391527 3.0495713z"/>
                                <circle cx="6.5" cy="6.5" r="2.5"/>
                            </g>
                        </svg>
                    </button>

                    <button
                        className="btn btn-custom-outline fw-semibold px-3 py-2 me-3 text-warning border-warning"
                        onClick={() => cambiarVista("clases")}
                    >
                        <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="translate(2 2)"><path d="m2.5.5h12c1.1045695 0 2 .8954305 2 2v12c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-12c0-1.1045695.8954305-2 2-2z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m.5 4.5h16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><g fill="currentColor"><circle cx="8.5" cy="8.5" r="1"/><circle cx="4.5" cy="8.5" r="1"/><circle cx="12.5" cy="8.5" r="1"/><circle cx="8.5" cy="12.5" r="1"/><circle cx="4.5" cy="12.5" r="1"/><circle cx="12.5" cy="12.5" r="1"/></g></g></svg>
                    </button>

                    {token && (
                        <button
                            className="btn btn-warning fw-semibold px-3 py-2 me-3 text-dark"
                            onClick={() => cambiarVista("membresia")}
                        >
                            Pagar Membresía
                        </button>
                    )}

                    <button
                        className="btn btn-cart-hover d-flex align-items-center justify-content-center p-2 me-4 position-relative"
                        onClick={manejarClickCarrito}
                        title="Mi Changuito"
                        style={{ width: "42px", height: "42px", borderRadius: "50%", border: "none", backgroundColor: "#ffb300" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 text-dark" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        {carrito.length > 0 && (
                            <span className="badge bg-dark text-warning rounded-pill position-absolute top-0 start-100 translate-middle" style={{ fontSize: "10px" }}>
                                {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                            </span>
                        )}
                    </button>

                    {token && (rol === "admin" || rol === "sysadmin") && (
                        <button
                            className="btn btn-custom-outline fw-semibold px-3 py-2 me-3"
                            onClick={() => cambiarVista("admin")}
                        >
                            Panel Admin
                        </button>
                    )}

                    {principal === "tienda" && mostrarChanguitoFlotante && (
                        <div
                            className="position-absolute shadow-lg p-3 rounded"
                            style={{
                                top: "55px",
                                right: "0px",
                                width: "350px",
                                backgroundColor: "#1a1a1a",
                                border: "2px solid #ffb300",
                                zIndex: 1000,
                            }}
                        >
                            <h5 className="text-warning fw-bold border-bottom pb-2 mb-3">Tu Changuito</h5>
                            <Changuito
                                carrito={carrito}
                                onActualizarCantidad={actualizarCantidad}
                                onEliminar={eliminarDelCarrito}
                            />
                        </div>
                    )}

                    {!token ? (
                        <>
                            <button
                                className="btn btn-custom-outline fw-semibold px-3 py-2 me-2"
                                onClick={() => cambiarVista("login")}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                className="btn btn-custom-outline fw-semibold px-3 py-2"
                                onClick={() => cambiarVista("register")}
                            >
                                Registrarse
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-outline-danger fw-semibold px-3 py-2"
                            onClick={cerrarSesion}
                        >
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            </nav>

            <Modal
                show={mostrarModalUbicacion}
                onHide={() => setMostrarModalUbicacion(false)}
                centered
                contentClassName="bg-dark text-white border border-warning"
            >
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-warning fw-bold">📍 Ubicación Capfit Gym</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <p className="fs-5 mb-2">¿Deseas abrir Google Maps para ver cómo llegar al gimnasio?</p>
                    <p className="text-white-50 small">Se abrirá una pestaña externa con la dirección exacta.</p>
                </Modal.Body>
                <Modal.Footer className="border-secondary justify-content-center">
                    <Button variant="outline-secondary" className="px-4 fw-semibold text-white" onClick={() => setMostrarModalUbicacion(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="warning"
                        className="px-4 fw-bold text-dark"
                        onClick={() => {
                            setMostrarModalUbicacion(false);
                            window.open("https://www.google.com/maps/place/CAPFIT+GYM/@-32.998084,-60.6263982,17z/data=!3m1!4b1!4m6!3m5!1s0x95b7ab004af34eb5:0x4fbc355dd58ea0c0!8m2!3d-32.998084!4d-60.6263982!16s%2Fg%2F11wr0l1d2q?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D", "_blank");
                        }}
                    >
                        Abrir Google Maps 🗺️
                    </Button>
                </Modal.Footer>
            </Modal>

            <main className="py-4">
                {mensajeFeedback && (
                    <div className="container" style={{ maxWidth: "500px" }}>
                        <Alert
                            variant={mensajeFeedback.variante}
                            dismissible
                            onClose={() => setMensajeFeedback(null)}
                            className="fw-semibold text-center mb-4"
                        >
                            {mensajeFeedback.texto}
                        </Alert>
                    </div>
                )}

                {principal === "home" && (
                    <div className="text-center container">
                        <Carrusel />
                        <h1 className="display-3 fw-bold text-white mb-3 mt-4">
                            BIENVENIDOS A <span className="text-warning">CAPFIT GYM</span>
                        </h1>
                        <p className="text-white-50 fs-4 mb-4">Llevá tu rendimiento al siguiente nivel.</p>

                        {!token ? (
                            <button className="btn btn-warning btn-lg fw-bold px-5 text-dark" onClick={() => cambiarVista("register")}>
                                Logueate Aqui
                            </button>
                        ) : (
                            <div className="text-warning fs-5 fw-semibold">
                                ¡Qué bueno tenerte por acá, {localStorage.getItem("nombre") || "Atleta"}! 💪🏻🔥
                            </div>
                        )}
                    </div>
                )}

                {principal === "tienda" && (
                    <div className="container">
                        <Catalogo onAgregarAlChanguito={agregarAlCarrito} />
                    </div>
                )}

                {principal === "clases" && (
                    <div className="container">
                        <ClasesFuncional />
                    </div>
                )}

                {principal === "membresia" && (
                    <div className="container">
                        <MembresiaYPago />
                    </div>
                )}

                {principal === "changuito" && (
                    <div className="container">
                        <Changuito
                            carrito={carrito}
                            onActualizarCantidad={actualizarCantidad}
                            onEliminar={eliminarDelCarrito}
                        />
                    </div>
                )}

                {principal === "admin" && (
                    <div className="container">
                        <AdminPanel />
                    </div>
                )}

                {principal === "login" && <Login onLoginSuccess={() => cambiarVista("home")} />}
                {principal === "register" && <Register onRegister={() => cambiarVista("login")} />}
            </main>
        </div>
    );
}

export default App;