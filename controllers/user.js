'use strict';

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt    = require('../services/jwt');

function pruebas(req, res){
    res.status('200').send({
        message: 'Probando una accion del controlador de usuarios del API Rest'
    });
}

function saveUser(req, res){
    var user = new User();

    var params = req.body; // recoger variables por post

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){
        //  Encriptar contraseña y guardar datos

        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            if(user.name != null && user.surname != null && user.email != null){
                user.save((err, userStored) =>  {
                    if(err){
                        res.status(200).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(500).send({message: 'Rellena todos los campos'});
            }
        });
    }else{
        res.status(500).send({message: 'Introduce contraseña'});
    }
}

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //  Devolver los datos del usuario logueado
                        if(params.gethash){
                            //Devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    }); // Buscar en MongoDB el email
}

function updateUser(req, res){
    var userId = req.params.id;

    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'error al actualizar el usuario'})
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

module.exports = { //Se van exportando las functiones que se van creado.
    pruebas,
    saveUser,
    loginUser,
    updateUser
};