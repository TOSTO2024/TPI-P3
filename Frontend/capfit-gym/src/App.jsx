import { useState } from 'react';
import Login from './components/auth/login/login'; 
import Register from './components/auth/register/Register'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [principal, setPrincipal] = useState('home');

    return (
    <div className="app-container" style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
    
        <nav className="d-flex justify-content-between align-items-center px-5 py-3" style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #ffb300' }}>
        <h3 className="text-warning fw-bold m-0" style={{ cursor: 'pointer' }} onClick={() => setPrincipal('home')}>
            Capfit Gym
        </h3>
        <div>
            <button 
            className="btn btn-outline-warning me-3 fw-semibold px-4"
            onClick={() => setPrincipal('login')}
            >
            Iniciar Sesión
            </button>
            <button 
            className="btn btn-warning fw-semibold text-dark px-4"
            onClick={() => setPrincipal('register')}
            >
            Registrarse
            </button>
        </div>
        </nav>

        <main>
        {principal === 'home' && (
            <div className="text-center py-5 mt-5">
            <h1 className="display-3 fw-bold text-white mb-3">BIENVENIDOS A <span className="text-warning">CAPFIT GYM</span></h1>
            <p className="text-white-50 fs-4 mb-4">Llevá tu rendimiento al siguiente nivel.</p>
            <button className="btn btn-warning btn-lg fw-bold px-5 text-dark" onClick={() => setPrincipal('register')}>
            LOGUEATE AHORA
            </button>
            </div>
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