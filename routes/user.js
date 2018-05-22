'user strict';

var express = require('express');
var UserController = require('../controllers/user');


var api = express.Router();

var md_auth = require('../middlewares/auth');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); // :id es obligatorio, cuando se agrega ? es opcional
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage); // usa dos middlewares, uno por login y otro para que exista la imagen
api.get('/get-image-user/:imageFile',  UserController.getImageFile);

module.exports = api;