'use strict';

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

// Cargas rutas

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Congifurar Cabeceras http



//Rutas base

app.get('/pruebas', function(req, res){
    res.status(200).send({message: 'Primera Ruta'});
});

module.exports = app;