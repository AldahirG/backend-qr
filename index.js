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

app.use('/api/users', userRoutes);

app.use('/api/registros', registroConferenciasRoutes);  

sequelize.sync().then(() => {
  console.log('Sincronizado con la base de datos');
}).catch(err => {
  console.log('Error al sincronizar la base de datos:', err);
});

// // Configurar el HTTPS
// const httpsOptions = {
//   key: fs.readFileSync('ruta/a/certificado_privado.key'),  // Ruta al archivo .key
//   cert: fs.readFileSync('ruta/certificado_publico.crt'),  // Ruta al archivo .crt o .cert
// };

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
