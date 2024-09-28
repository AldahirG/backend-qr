const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Importar Rutas
const registroConferenciasRoutes = require('./routes/registroConferencias');
const userRoutes = require('./routes/users');

// Rutas Públicas
app.use('/api/users', userRoutes);

// Rutas Públicas (antes protegidas)
app.use('/api/registros', registroConferenciasRoutes);  // Verifica que esta ruta esté correctamente configurada

// Sincronizar la base de datos
sequelize.sync().then(() => {
  console.log('Sincronizado con la base de datos');
}).catch(err => {
  console.log('Error al sincronizar la base de datos:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
