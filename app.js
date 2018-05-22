'use strict';

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

// Cargas rutas

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

// Congifurar Cabeceras http

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Rutas base

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);


//  Exportar modulo para usar en index.js

module.exports = app;