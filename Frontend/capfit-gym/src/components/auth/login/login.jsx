import { useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [emailTocado, setEmailTocado] = useState(false);
    const [passwordTocado, setPasswordTocado] = useState(false);
    const [mensajeFeedback, setMensajeFeedback] = useState(null);

    const validarEmail = (email) => {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    };

    const esEmailValido = validarEmail(email);
    const esPasswordValido = password.length >= 8;

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailTocado(true);
        setPasswordTocado(true);
        setMensajeFeedback(null);

        if (!esEmailValido || !esPasswordValido) {
            setMensajeFeedback({
                texto: "Por favor, corrige los campos antes de ingresar.",
                variante: "danger"
            });
            return;
        }

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.mensaje || 'Credenciales inválidas'); });
            }
            return res.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('email', email);

            setMensajeFeedback({
                texto: `¡Bienvenido ${data.nombre} (${data.rol})! Redirigiendo...`,
                variante: "success"
            });

            setTimeout(() => {
                if (onLoginSuccess) {
                    onLoginSuccess(data.rol);
                }
            }, 800);
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
                    <h3 className="text-center mb-4 fw-bold text-white fs-2">Iniciar Sesión</h3>

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
                        <Form.Group className="mb-4" controlId="formEmail">
                            <Form.Label className="fw-semibold fs-5 text-warning">Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailTocado(true);
                                }}
                                isInvalid={emailTocado && !esEmailValido}
                                isValid={emailTocado && esEmailValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold mt-1">
                                Formato de email inválido.
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="formPassword">
                            <Form.Label className="fw-semibold fs-5 text-warning">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su Contraseña"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordTocado(true);
                                }}
                                isInvalid={passwordTocado && !esPasswordValido}
                                isValid={passwordTocado && esPasswordValido}
                                className="py-2"
                            />
                            <Form.Control.Feedback type="invalid" className="fw-semibold mt-1">
                                La contraseña debe tener al menos 8 caracteres ({password.length}/8).
                            </Form.Control.Feedback>
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