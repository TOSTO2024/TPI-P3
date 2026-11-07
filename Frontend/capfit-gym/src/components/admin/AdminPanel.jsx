import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import GestionProductos from "./GestionProductos.jsx"; 
import ListaClientes from "./ListaClientes.jsx";       
import InscriptosClases from "./InscriptosClases.jsx"; 

const AdminPanel = () => {
    const [seccionActiva, setSeccionActiva] = useState("menu");

    return (
        <Container className="py-4 text-white">
            <h2 className="text-center fw-bold mb-4">
                Panel de <span className="text-warning">Administración</span>
            </h2>

            {seccionActiva === "menu" && (
                <Row className="g-4 justify-content-center">
                    <Col md={4}>
                        <Card className="bg-dark text-white border border-warning h-100 shadow-lg text-center p-3">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="fs-1 mb-3">📦</div>
                                    <Card.Title className="text-warning fw-bold fs-4">Gestión de Ítems</Card.Title>
                                    <Card.Text className="text-white-50 mt-2">
                                        Agregá, modificá o eliminá productos, precios y stock.
                                    </Card.Text>
                                </div>
                                <Button variant="warning" className="fw-bold text-dark mt-4 py-2" onClick={() => setSeccionActiva("productos")}>
                                    Administrar Ítems
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="bg-dark text-white border border-warning h-100 shadow-lg text-center p-3">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="fs-1 mb-3">👥</div>
                                    <Card.Title className="text-warning fw-bold fs-4">Clientes Anotados</Card.Title>
                                    <Card.Text className="text-white-50 mt-2">
                                        Visualizá los usuarios registrados y sus roles.
                                    </Card.Text>
                                </div>
                                <Button variant="warning" className="fw-bold text-dark mt-4 py-2" onClick={() => setSeccionActiva("clientes")}>
                                    Ver Clientes
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="bg-dark text-white border border-warning h-100 shadow-lg text-center p-3">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="fs-1 mb-3">📋</div>
                                    <Card.Title className="text-warning fw-bold fs-4">Clases Funcionales</Card.Title>
                                    <Card.Text className="text-white-50 mt-2">
                                        Consultá los inscriptos en los distintos turnos.
                                    </Card.Text>
                                </div>
                                <Button variant="warning" className="fw-bold text-dark mt-4 py-2" onClick={() => setSeccionActiva("clases")}>
                                    Ver Inscriptos
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {seccionActiva !== "menu" && (
                <div className="mb-4">
                    <Button variant="outline-warning" className="fw-semibold" onClick={() => setSeccionActiva("menu")}>
                        ← Volver al Panel Principal
                    </Button>
                </div>
            )}

            {seccionActiva === "productos" && <GestionProductos />}
            {seccionActiva === "clientes" && <ListaClientes />}
            {seccionActiva === "clases" && <InscriptosClases />}
        </Container>
    );
};

export default AdminPanel;