const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.options('*', cors())
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const api = process.env.API_URL;
const medicamentosRouter = require('./routers/medicamentos')
const insumosRouter = require('./routers/insumos')
const equiposRouter = require('./routers/equipos')
const distribucionesRouter = require('./routers/distribuciones')
const historicosRouter = require('./routers/historicos')
const usuariosRouter = require('./routers/usuarios');
const reportesRouter = require('./routers/reportes')

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler)

//Routers
app.use(`${api}/medicamentos`, medicamentosRouter)
app.use(`${api}/insumos`, insumosRouter)
app.use(`${api}/equipos`, equiposRouter)
app.use(`${api}/distribuciones`, distribucionesRouter)
app.use(`${api}/historicos`, historicosRouter)
app.use(`${api}/usuarios`, usuariosRouter)
app.use(`${api}/reportes`, reportesRouter)

//Conexion Base de Datos
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Base de Datos Conectada...')
    })
    .catch((err) => {
        console.log(err);
    })

//Servidor
/*app.listen(3000, () => {
    console.log("Servidor esta funcionando en el puerto http://localhost:3000");
})*/

//Production
var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("Express corriendo en el puerto ", port);
})