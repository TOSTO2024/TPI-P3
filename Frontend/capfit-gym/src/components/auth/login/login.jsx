import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) throw new Error('Credenciales inválidas');
            return res.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);

            alert(`¡Bienvenido ${data.nombre} (${data.rol})!`);

            if (onLogin) {
                onLogin(data.rol);
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
                    <h3 className="text-center mb-4 fw-bold text-white fs-2">Iniciar Sesión</h3>
                    <Form onSubmit={handleSubmit}>
                    
                        <Form.Group className="mb-4" controlId="formEmail">
                            <Form.Label className="fw-semibold fs-5 text-warning">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-3"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="formPassword">
                            <Form.Label className="fw-semibold fs-5 text-warning">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="py-3"
                            />
                        </Form.Group>

                        <Button variant="warning" type="submit" className="w-100 mt-3 py-3 fw-bold fs-5 text-dark">
                            Ingresar
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;