const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'clave_secreta_capfit_gym_utn';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-1447549608327337-110622-0c1e683ce60071945b81709ee6e77d8c-3824650302' });

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'capfit.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite (capfit.db) con éxito.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL,
            nombre TEXT NOT NULL,
            dni TEXT,
            fechaNacimiento TEXT,
            membresia_expiracion TEXT
        )
    `, (err) => {
        if (!err) {
            db.get(`SELECT COUNT(*) as count FROM usuarios`, (err, row) => {
                if (row.count === 0) {
                    const usuariosIniciales = [
                        ["sysadmin@capfit.com", "12345678", "sysadmin", "Dueño Supremo"],
                        ["admin@capfit.com", "12345678", "admin", "Administrador"],
                        ["cliente@capfit.com", "12345678", "cliente", "Cliente promedio"]
                    ];
                    const stmt = db.prepare(`INSERT INTO usuarios (email, password, rol, nombre) VALUES (?, ?, ?, ?)`);
                    usuariosIniciales.forEach(u => stmt.run(u));
                    stmt.finalize();
                    console.log("Usuarios iniciales insertados en la base de datos.");
                }
            });
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            imagen TEXT,
            descripcion TEXT
        )
    `, (err) => {
        if (!err) {
            db.get(`SELECT COUNT(*) as count FROM productos`, (err, row) => {
                if (row.count === 0) {
                    const productosIniciales = [
                        ["Proteína Whey Capfit 1kg", 45000, 15, "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80", "Proteína de máxima pureza para potenciar tu recuperación muscular."],
                        ["Creatina Monohidrato 300g", 32000, 20, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80", "Aumenta tu fuerza, potencia y rendimiento en cada entrenamiento."],
                        ["Shaker Oficial Capfit Gym", 8500, 30, "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80", "Vaso mezclador anti-goteo con capacidad de 600ml y rejilla."],
                        ["Remera Oversize Entrená", 18000, 10, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80", "Algodón peinado de alta calidad para máxima comodidad."]
                    ];
                    const stmt = db.prepare(`INSERT INTO productos (nombre, precio, stock, imagen, descripcion) VALUES (?, ?, ?, ?, ?)`);
                    productosIniciales.forEach(p => stmt.run(p));
                    stmt.finalize();
                    console.log("Productos iniciales insertados en la base de datos.");
                }
            });
        }
    });
    
    db.run(`
        CREATE TABLE IF NOT EXISTS reservas_clases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            clase_id INTEGER,
            horario TEXT,
            FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        )
    `, (err) => {
        if (!err) {
            console.log("Tabla de reservas de clases verificada/creada con éxito.");
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            concepto TEXT,
            monto REAL,
            codigo_ticket TEXT,
            estado TEXT DEFAULT 'Aprobado',
            fecha TEXT,
            FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        )
    `, (err) => {
        if (!err) {
            console.log("Tabla de tickets verificada/creada con éxito.");
        }
    });
});

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

    const query = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, usuario) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor.' });
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
});

app.post('/api/register', (req, res) => {
    const { email, password, nombre, dni, fechaNacimiento } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y contraseña obligatorios.' });
    }

    const queryCheck = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(queryCheck, [email], (err, existe) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor.' });
        if (existe) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
        }

        const nombreUsuario = nombre || 'Usuario';
        const queryInsert = `INSERT INTO usuarios (email, password, rol, nombre, dni, fechaNacimiento) VALUES (?, ?, 'cliente', ?, ?, ?)`;
        
        db.run(queryInsert, [email, password, nombreUsuario, dni || null, fechaNacimiento || null], function(err) {
            if (err) return res.status(500).json({ mensaje: 'Error al registrar usuario.' });

            const nuevoId = this.lastID;
            const token = jwt.sign(
                { id: nuevoId, rol: 'cliente' },
                SECRET_KEY,
                { expiresIn: '4h' }
            );

            res.status(201).json({
                mensaje: 'Registro exitoso',
                token,
                rol: 'cliente',
                nombre: nombreUsuario
            });
        });
    });
});

app.get('/api/usuarios', verificarToken, verificarAdmin, (req, res) => {
    db.all(`SELECT id, email, rol, nombre, dni, fechaNacimiento, membresia_expiracion FROM usuarios`, [], (err, usuarios) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
        res.json(usuarios);
    });
});

app.put('/api/usuarios/:id/rol', verificarToken, verificarSysadmin, (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['cliente', 'admin', 'sysadmin'].includes(rol)) {
        return res.status(400).json({ mensaje: "Rol inválido." });
    }

    const query = `UPDATE usuarios SET rol = ? WHERE id = ?`;
    db.run(query, [rol, id], function(err) {
        if (err) {
            return res.status(500).json({ mensaje: "Error al actualizar el rol en la base de datos." });
        }
        res.json({ mensaje: "¡Rol actualizado con éxito!" });
    });
});

app.post('/api/usuarios/crear-admin', verificarToken, verificarSysadmin, (req, res) => {
    const { email, password, nombre } = req.body;
    
    const queryCheck = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(queryCheck, [email], (err, existe) => {
        if (existe) {
            return res.status(400).json({ mensaje: 'El usuario ya existe.' });
        }

        const nombreAdmin = nombre || 'Administrador';
        const queryInsert = `INSERT INTO usuarios (email, password, rol, nombre) VALUES (?, ?, 'admin', ?)`;

        db.run(queryInsert, [email, password, nombreAdmin], function(err) {
            if (err) return res.status(500).json({ mensaje: 'Error al crear administrador.' });

            res.status(201).json({ 
                mensaje: 'Administrador creado con éxito', 
                admin: { id: this.lastID, email, rol: 'admin' } 
            });
        });
    });
});

app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor de Capfit Gym con SQLite funcionando correctamente!' });
});

app.get('/api/productos', (req, res) => {
    db.all(`SELECT * FROM productos`, [], (err, productos) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener productos.' });
        res.json(productos);
    });
});

app.post('/api/productos', verificarToken, verificarAdmin, (req, res) => {
    const { nombre, precio, stock, imagen, descripcion } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'El nombre y el precio son obligatorios.' });
    }

    const nuevoPrecio = Number(precio);
    const nuevoStock = Number(stock) || 0;
    const nuevaImagen = imagen || "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=500&q=80";
    const nuevaDescripcion = descripcion || "Suplemento oficial de Capfit Gym.";

    const query = `INSERT INTO productos (nombre, precio, stock, imagen, descripcion) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nombre, nuevoPrecio, nuevoStock, nuevaImagen, nuevaDescripcion], function(err) {
        if (err) return res.status(500).json({ mensaje: 'Error al crear producto.' });

        res.status(201).json({
            id: this.lastID,
            nombre,
            precio: nuevoPrecio,
            stock: nuevoStock,
            imagen: nuevaImagen,
            descripcion: nuevaDescripcion
        });
    });
});

app.put('/api/productos/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, imagen, descripcion } = req.body;

    db.get(`SELECT * FROM productos WHERE id = ?`, [id], (err, producto) => {
        if (err || !producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

        const nuevoNombre = nombre || producto.nombre;
        const nuevoPrecio = precio ? Number(precio) : producto.precio;
        const nuevoStock = stock !== undefined ? Number(stock) : producto.stock;
        const nuevaImagen = imagen || producto.imagen;
        const nuevaDescripcion = descripcion || producto.descripcion;

        const query = `UPDATE productos SET nombre = ?, precio = ?, stock = ?, imagen = ?, descripcion = ? WHERE id = ?`;
        db.run(query, [nuevoNombre, nuevoPrecio, nuevoStock, nuevaImagen, nuevaDescripcion, id], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al actualizar producto.' });

            res.json({ 
                mensaje: 'Producto actualizado con éxito', 
                producto: { id: Number(id), nombre: nuevoNombre, precio: nuevoPrecio, stock: nuevoStock, imagen: nuevaImagen, descripcion: nuevaDescripcion } 
            });
        });
    });
});

app.delete('/api/productos/:id', verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM productos WHERE id = ?`, [id], (err, producto) => {
        if (err || !producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

        db.run(`DELETE FROM productos WHERE id = ?`, [id], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al eliminar producto.' });
            res.json({ mensaje: "Producto eliminado con éxito", producto });
        });
    });
});

app.post('/api/reservas', verificarToken, (req, res) => {
    const { claseId, horario } = req.body;
    const usuarioId = req.usuarioId; 

    const query = `INSERT INTO reservas_clases (usuario_id, clase_id, horario) VALUES (?, ?, ?)`;
    db.run(query, [usuarioId, claseId, horario], function(err) {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar la reserva.' });
        res.status(201).json({ mensaje: '¡Clase reservada con éxito!', id: this.lastID });
    });
});

app.get('/api/reservas', verificarToken, (req, res) => {
    const query = `
        SELECT r.id, r.clase_id, r.horario, u.id as usuario_id, u.nombre, u.email 
        FROM reservas_clases r 
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.usuario_id = ?
    `;
    db.all(query, [req.usuarioId], (err, reservas) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener las reservas.' });
        res.json(reservas);
    });
});

app.get('/api/admin/reservas', verificarToken, verificarAdmin, (req, res) => {
    const query = `
        SELECT r.id, r.clase_id, r.horario, u.id as usuario_id, u.nombre, u.email 
        FROM reservas_clases r 
        JOIN usuarios u ON r.usuario_id = u.id
    `;
    db.all(query, [], (err, reservas) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener todas las reservas.' });
        res.json(reservas);
    });
});

app.delete('/api/reservas/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const usuarioId = req.usuarioId;

    const query = `DELETE FROM reservas_clases WHERE id = ? AND usuario_id = ?`;
    db.run(query, [id, usuarioId], function(err) {
        if (err) return res.status(500).json({ mensaje: 'Error al cancelar la reserva.' });
        res.json({ mensaje: 'Reserva cancelada con éxito' });
    });
});

app.post('/api/crear-preferencia', verificarToken, async (req, res) => {
    try {
        const { titulo, precio } = req.body;

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: titulo || 'Membresía Capfit Gym',
                        quantity: 1,
                        unit_price: Number(precio) || 25000,
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: 'http://localhost:3000',
                    failure: 'http://localhost:3000',
                    pending: 'http://localhost:3000'
                }
            }
        });

        res.json({ init_point: result.init_point });

    } catch (error) {
        console.error("Error al crear preferencia de Mercado Pago:", error);
        res.status(500).json({ mensaje: "Error al procesar el pago con Mercado Pago." });
    }
});

app.post('/api/tickets', verificarToken, (req, res) => {
    const { concepto, monto } = req.body;
    const usuarioId = req.usuarioId;
    const codigoTicket = 'CAPFIT-' + Math.floor(100000 + Math.random() * 900000);
    const fecha = new Date().toLocaleDateString();

    const query = `INSERT INTO tickets (usuario_id, concepto, monto, codigo_ticket, fecha) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [usuarioId, concepto, monto, codigoTicket, fecha], function(err) {
        if (err) return res.status(500).json({ mensaje: 'Error al generar el ticket.' });
        res.status(201).json({ mensaje: 'Ticket generado', codigo_ticket: codigoTicket });
    });
});

app.post('/api/usuarios/membresia', verificarToken, (req, res) => {
    const usuarioId = req.usuarioId; 
    const fechaExpiracion = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString();

    db.run(
        `UPDATE usuarios SET membresia_expiracion = ? WHERE id = ?`,
        [fechaExpiracion, usuarioId],
        function(err) {
            if (err) {
                return res.status(500).json({ mensaje: "Error al actualizar la membresía en la base de datos." });
            }
            res.json({ mensaje: "Membresía activada con éxito", membresia_expiracion: fechaExpiracion });
        }
    );
});

app.get('/api/usuarios/perfil', verificarToken, (req, res) => {
    const usuarioId = req.usuarioId;
    db.get(`SELECT id, nombre, email, rol, membresia_expiracion FROM usuarios WHERE id = ?`, [usuarioId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(row);
    });
});

app.post('/api/productos/comprar', verificarToken, (req, res) => {
    const { items } = req.body; 
    
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ mensaje: 'No hay productos en la compra.' });
    }

    const stmt = db.prepare(`UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`);
    
    let errorOcurrido = false;
    db.serialize(() => {
        items.forEach(item => {
            stmt.run(item.cantidad, item.id, item.cantidad, (err) => {
                if (err) errorOcurrido = true;
            });
        });
        stmt.finalize();
    });

    if (errorOcurrido) {
        return res.status(500).json({ mensaje: 'Error al actualizar el stock o stock insuficiente.' });
    }

    res.json({ mensaje: 'Compra procesada con éxito y stock actualizado.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});