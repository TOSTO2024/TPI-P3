const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'clave_secreta_capfit_gym_utn';

app.use(cors());
app.use(express.json());

let usuarios = [
    { id: 1, email: "sysadmin@capfit.com", password: "12345678", rol: "sysadmin", nombre: "Dueño Supremo" },
    { id: 2, email: "admin@capfit.com", password: "12345678", rol: "admin", nombre: "Administrador" },
    { id: 3, email: "cliente@capfit.com", password: "12345678", rol: "cliente", nombre: " Cliente promedio" }
];

let productos = [
    { 
        id: 1, 
        nombre: "Proteína Whey Capfit 1kg", 
        precio: 45000, 
        stock: 15,
        imagen: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80",
        descripcion: "Proteína de máxima pureza para potenciar tu recuperación muscular."
    },
    { 
        id: 2, 
        nombre: "Creatina Monohidrato 300g", 
        precio: 32000, 
        stock: 20,
        imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
        descripcion: "Aumenta tu fuerza, potencia y rendimiento en cada entrenamiento."
    },
    { 
        id: 3, 
        nombre: "Shaker Oficial Capfit Gym", 
        precio: 8500, 
        stock: 30,
        imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80",
        descripcion: "Vaso mezclador anti-goteo con capacidad de 600ml y rejilla."
    },
    { 
        id: 4, 
        nombre: "Remera Oversize Entrená", 
        precio: 18000, 
        stock: 10,
        imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
        descripcion: "Algodón peinado de alta calidad para máxima comodidad."
    }
];

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ mensaje: 'Token no proporcionado.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ mensaje: 'Token malformado.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
        
        req.usuarioId = decoded.id;
        req.usuarioRol = decoded.rol;
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    if (req.usuarioRol === 'admin' || req.usuarioRol === 'sysadmin') {
        next();
    } else {
        res.status(403).json({ mensaje: 'Acceso denegado: Se requiere rol de Administrador.' });
    }
};

const verificarSysadmin = (req, res, next) => {
    if (req.usuarioRol === 'sysadmin') {
        next();
    } else {
        res.status(403).json({ mensaje: 'Acceso denegado: Se requiere rol exclusivo de Sysadmin.' });
    }
};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        SECRET_KEY,
        { expiresIn: '4h' }
    );

    res.json({
        mensaje: 'Login exitoso',
        token,
        rol: usuario.rol,
        nombre: usuario.nombre
    });
});

app.post('/api/usuarios/crear-admin', verificarToken, verificarSysadmin, (req, res) => {
    const { email, password, nombre } = req.body;
    
    if (usuarios.some(u => u.email === email)) {
        return res.status(400).json({ mensaje: 'El usuario ya existe.' });
    }

    const nuevoAdmin = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        email,
        password,
        rol: 'admin',
        nombre: nombre || 'Administrador'
    };

    usuarios.push(nuevoAdmin);
    res.status(201).json({ mensaje: 'Administrador creado con éxito', admin: { id: nuevoAdmin.id, email: nuevoAdmin.email, rol: nuevoAdmin.rol } });
});


app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor de Capfit Gym funcionando correctamente!' });
});

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.post('/api/productos', verificarToken, verificarAdmin, (req, res) => {
    const { nombre, precio, stock, imagen, descripcion } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'El nombre y el precio son obligatorios.' });
    }

    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        nombre,
        precio: Number(precio),
        stock: Number(stock) || 0,
        imagen: imagen || "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80",
        descripcion: descripcion || "Suplemento oficial de Capfit Gym."
    };

    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, imagen, descripcion } = req.body;
    const producto = productos.find(p => p.id == id);
    
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (nombre) producto.nombre = nombre;
    if (precio) producto.precio = Number(precio);
    if (stock !== undefined) producto.stock = Number(stock);
    if (imagen) producto.imagen = imagen;
    if (descripcion) producto.descripcion = descripcion;

    res.json({ mensaje: 'Producto actualizado con éxito', producto });
});


app.delete('/api/productos/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    const index = productos.findIndex(p => p.id == id);
    
    if (index === -1) return res.status(404).json({ mensaje: "Producto no encontrado" });

    const eliminado = productos.splice(index, 1);
    res.json({ mensaje: "Producto eliminado con éxito", producto: eliminado[0] });
});

app.post('/api/register', (req, res) => {
    const { email, password, nombre } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y contraseña obligatorios.' });
    }

    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const nuevoUsuario = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        email,
        password, 
        rol: 'cliente', 
        nombre: nombre || 'Usuario'
    };

    usuarios.push(nuevoUsuario);

    const token = jwt.sign(
        { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
        SECRET_KEY,
        { expiresIn: '4h' }
    );

    res.status(201).json({
        mensaje: 'Registro exitoso',
        token,
        rol: nuevoUsuario.rol,
        nombre: nuevoUsuario.nombre
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});