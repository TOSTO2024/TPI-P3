import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../login/Login.css"

const Register = ({ onRegister }) => {
    const [username, setUsername] = useState("");
    const [lastName, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");
    const [fecha, setFecha] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!username || !lastName || !email || !dni || !fecha || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/;
        if (!soloLetras.test(username)) {
            alert("El nombre ingresado no es válido (solo letras, entre 3 y 30 caracteres).");
            return;
        }
        if (!soloLetras.test(lastName)) {
            alert("El apellido ingresado no es válido (solo letras, entre 3 y 30 caracteres).");
            return;
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert("Por favor, ingrese un correo electrónico válido.");
            return;
        }

        const regexDni = /^\d{7,8}$/;
        if (!regexDni.test(dni)) {
            alert("El DNI debe contener solo números (entre 7 y 8 dígitos).");
            return;
        }

        const hoy = new Date();
        const nacimiento = new Date(fecha);

        if (nacimiento > hoy) {
            alert("La fecha de nacimiento no puede ser futura.");
            return;
        }

        const edad = hoy.getFullYear() - nacimiento.getFullYear() - 
            (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate()) ? 1 : 0);

        if (edad < 5 || edad > 100) {
            alert("Debes tener entre 5 y 100 años para registrarte.");
            return;
        }
        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
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

            alert(`¡Cuenta creada con éxito! Bienvenido ${data.nombre}`);

            if (onRegister) {
                onRegister(data.rol);
            }
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
    };

    return (
        <div className="auth-container">
            <Card className="p-4 shadow-lg custom-card" style={{ width: '450px', minWidth: '450px' }}>
                <Card.Body>
                    <h3 className="text-center mb-3 fw-bold text-white fs-2">Registrarse</h3>
                    <Form onSubmit={StyleSheet && handleSubmit || handleSubmit}>
                    
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label className="fw-semibold text-warning">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su nombre"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label className="fw-semibold text-warning">Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su apellido"
                                value={lastName}
                                onChange={(e) => setLastname(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label className="fw-semibold text-warning">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDni">
                            <Form.Label className="fw-semibold text-warning">DNI</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFecha">
                            <Form.Label className="fw-semibold text-warning">Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="py-2 text-white"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label className="fw-semibold text-warning">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="py-2"
                            />
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