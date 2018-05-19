'user strict';

var express = require('express');
var UserController = require('../controllers/user');


var api = express.Router();

var md_auth = require('../middlewares/auth');

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', UserController.updateUser);

module.exports = api;