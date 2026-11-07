import { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../login/Login.css"

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState("");
    const [lastName, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");
    const [fecha, setFecha] = useState("");
    const [password, setPassword] = useState("");

    const [touched, setTouched] = useState({
        username: false,
        lastName: false,
        email: false,
        dni: false,
        fecha: false,
        password: false
    });

    const [mensajeFeedback, setMensajeFeedback] = useState(null);

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexDni = /^\d{7,8}$/;

    const hoy = new Date();
    const nacimiento = new Date(fecha);
    const edad = hoy.getFullYear() - nacimiento.getFullYear() - 
        (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate()) ? 1 : 0);

    const esUsernameValido = soloLetras.test(username);
    const esLastNameValido = soloLetras.test(lastName);
    const esEmailValido = regexEmail.test(email);
    const esDniValido = regexDni.test(dni);
    const esFechaValido = fecha && nacimiento <= hoy && edad >= 5 && edad <= 100;
    const esPasswordValido = password.length >= 8; 
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setTouched({
            username: true,
            lastName: true,
            email: true,
            dni: true,
            fecha: true,
            password: true
        });
        setMensajeFeedback(null);

        if (!esUsernameValido || !esLastNameValido || !esEmailValido || !esDniValido || !esFechaValido || !esPasswordValido) {
            setMensajeFeedback({
                texto: "Por favor, complete correctamente todos los campos marcados en rojo.",
                variante: "danger"
            });
            return;
        }

        const nuevoUsuario = {
            nombre: `${username} ${lastName}`, 
            email,
            password,
            dni,
            fechaNacimiento: fecha
        };

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.mensaje || 'Error al registrarse'); });
            }
            return res.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);

            setMensajeFeedback({
                texto: `¡Cuenta creada con éxito! Bienvenido ${data.nombre}`,
                variante: "success"
            });

            setTimeout(() => {
                if (onRegister) {
                    onRegister(data.rol);
                }
            }, 1200);
        })
        .catch(err => {
            setMensajeFeedback({
                texto: "Error: " + err.message,
                variante: "danger"
            });
        });
    };

    return (
        <div className="auth-container">
            <Card className="p-4 shadow-lg custom-card" style={{ width: '450px', minWidth: '450px' }}>
                <Card.Body>
                    <h3 className="text-center mb-3 fw-bold text-white fs-2">Registrarse</h3>

                    {mensajeFeedback && (
                        <Alert 
                            variant={mensajeFeedback.variante} 
                            dismissible 
                            onClose={() => setMensajeFeedback(null)}
                            className="fw-semibold text-center"
                        >
                            {mensajeFeedback.texto}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                    
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label className="fw-semibold text-warning">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setTouched(prev => ({ ...prev, username: true }));
                                }}
                                isInvalid={touched.username && !esUsernameValido}
                                isValid={touched.username && esUsernameValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                Solo letras, entre 3 y 30 caracteres.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label className="fw-semibold text-warning">Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su apellido"
                                value={lastName}
                                onChange={(e) => {
                                    setLastname(e.target.value);
                                    setTouched(prev => ({ ...prev, lastName: true }));
                                }}
                                isInvalid={touched.lastName && !esLastNameValido}
                                isValid={touched.lastName && esLastNameValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                Solo letras, entre 3 y 30 caracteres.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label className="fw-semibold text-warning">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setTouched(prev => ({ ...prev, email: true }));
                                }}
                                isInvalid={touched.email && !esEmailValido}
                                isValid={touched.email && esEmailValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                Ingrese un correo electrónico válido.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDni">
                            <Form.Label className="fw-semibold text-warning">DNI</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su DNI"
                                value={dni}
                                onChange={(e) => {
                                    setDni(e.target.value);
                                    setTouched(prev => ({ ...prev, dni: true }));
                                }}
                                isInvalid={touched.dni && !esDniValido}
                                isValid={touched.dni && esDniValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                El DNI debe contener solo números (7 u 8 dígitos).
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFecha">
                            <Form.Label className="fw-semibold text-warning">Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                value={fecha}
                                onChange={(e) => {
                                    setFecha(e.target.value);
                                    setTouched(prev => ({ ...prev, fecha: true }));
                                }}
                                isInvalid={touched.fecha && !esFechaValido}
                                isValid={touched.fecha && esFechaValido}
                                className="py-2 text-white"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                {!fecha ? "Por favor, seleccione su fecha de nacimiento." : 
                                nacimiento > hoy ? "La fecha no puede ser futura." : 
                                "Debes tener entre 5 y 100 años para registrarte."}
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label className="fw-semibold text-warning">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setTouched(prev => ({ ...prev, password: true }));
                                }}
                                isInvalid={touched.password && !esPasswordValido}
                                isValid={touched.password && esPasswordValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold">
                                La contraseña requiere al menos 8 caracteres ({password.length}/8).
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="warning" type="submit" className="w-100 mt-2 py-3 fw-bold fs-5 text-dark">
                            Crear Cuenta
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;