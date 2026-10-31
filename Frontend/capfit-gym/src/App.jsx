import { useState } from 'react';
import Login from './components/auth/login/Login'; 
import Register from './components/auth/register/Register'; 
import Carrusel from './components/Principal/Carrusel';
import Changuito from './components/Principal/Changuito';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import capfitLogoNormal from './img/logoNormal.jpeg';

function App() {
    const [principal, setPrincipal] = useState('home');

    return (
    <div className="app-container" style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
    
        <nav className="d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #ffb300' }}>
            <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => setPrincipal('home')}>
                <img 
                    src={capfitLogoNormal} 
                    alt="Capfit Gym Logo" 
                    style={{ height: '45px', objectFit: 'contain' }} 
                    className="me-4" /* <--- Acá agregamos la separación (margen derecho) */
                />
                <h3 className="fw-bold m-0 fs-5">
                    <span className="text-white">CAPFIT</span> 
                    <span className="text-warning"> GYM</span>
                </h3>
            </div>
            <div className="d-flex align-items-center">
                <button 
                        className="btn btn-cart-hover d-flex align-items-center justify-content-center p-2 me-4"
                        onClick={() => setPrincipal('Changuito')}
                        title="Tienda Capfit"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'transparent', transition: 'all 0.3s ease' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart3 text-warning" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                </button>
                <button 
                className="btn btn-custom-outline fw-semibold px-4 py-2 me-3"
                onClick={() => setPrincipal('login')}
                >
                Iniciar Sesión
                </button>
                <button 
                className="btn btn-custom-outline fw-semibold px-4 py-2"
                onClick={() => setPrincipal('register')}
                >
                Registrarse
                </button>
                
            </div>
        </nav>

        <main>
        {principal === 'home' && (
            <div className="text-center">
            <Carrusel />    
            <h1 className="display-3 fw-bold text-white mb-3">BIENVENIDOS A <span className="text-warning">CAPFIT GYM</span></h1>
            <p className="text-white-50 fs-4 mb-4">Llevá tu rendimiento al siguiente nivel.</p>
            <button className="btn btn-warning btn-lg fw-bold px-5 text-dark" onClick={() => setPrincipal('register')}>
            LOGUEATE AHORA
            </button>
            </div>
        )}

        {principal === 'Changuito' && (
                <Changuito/>
        )}

        {principal === 'login' && (
            <Login onLoginSuccess={() => setPrincipal('home')} />
        )}

        {principal === 'register' && (
            <Register onRegister={() => setPrincipal('login')} />
        )}

        
        </main>

    </div>
    );
}

export default App;