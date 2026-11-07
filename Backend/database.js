const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'capfit.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite (.db) con éxito.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            dni TEXT,
            fechaNacimiento TEXT,
            rol TEXT DEFAULT 'user'
        )
    `, (err) => {
        if (!err) {
            db.run(`
                INSERT OR IGNORE INTO usuarios (id, nombre, email, password, rol) 
                VALUES (1, 'Administrador', 'admin@capfit.com', 'admin123', 'admin')
            `);
        }
    });
});

export default db;