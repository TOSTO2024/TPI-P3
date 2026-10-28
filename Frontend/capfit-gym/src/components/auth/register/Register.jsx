import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [lastName, setLastname] = useState("");
    const [dni, setDni] = useState("");
    const [fecha, setFecha] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !username || !lastName || !dni || !fecha || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }

        console.log("Se registró perfectamente:", username);

        if (onRegister) {
            onRegister();
        }
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