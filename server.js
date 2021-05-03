//IMPORTAÇÕES
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');
//----------------------------------------------------------------------

const apiRoutes = require('./src/routes');

// Conexão com DATABASE
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
  console.error('ERRO: ' + error.message);
});
//-----------------------------------------------------------------------

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());

server.use(express.static(__dirname + '/public'));

//USANDO AS ROTAS
server.use('/', apiRoutes);

server.set('port', process.env.PORT);
server.listen(server.get('port'), () => {
  console.log(`Server running on: http://localhost:${process.env.PORT}`);
});
