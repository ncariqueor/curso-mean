'use strict';

var path   = require('path');
var fs     = require('fs');
var Artist = require('../models/artist');
var Album  = require('../models/album');
var Song   = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, function(err, artist){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe'});
            }else{
                res.status(200).send({message: artist});
            }
        }
    });
}

function getArtists(req, res) {
    var page = 1;

    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No existen artistas'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });


}

function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;

    console.log(params);

    artist.name = params.name;
    artist.description = params.description;
    artist.image       = 'null';

    artist.save(function(err, artistStored){
        if(err){
            res.status(500).send({message: 'Error al insertar artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({message: artistStored});
            }
        }
    });
}

function updateArtist(req, res){
    var artistId = req.params.id;

    var update   = req.body;

    Artist.findByIdAndUpdate(artistId, update, function(err, artistUpdated){
        if(err){
            res.status(500).send({message: 'Error al actualizar artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no pudo actualizarse'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, function(err, artistRemoved) {
        if(err){
            res.status(500).send({message: 'Error al eliminar artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'No se eliminó el artista'});
            }else{
                res.status(404).send({artistRemoved: artistRemoved});

                Album.find({artist: artistRemoved._id}).remove(function(err, albumRemoved) {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar album'});
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'No se eliminó el album'});
                        }else{
                            res.status(404).send({albumRemoved: albumRemoved});

                            Song.find({album: albumRemoved._id}).remove(function(err, songRemoved) {
                                if(err){
                                    res.status(500).send({message: 'Error al eliminar cancion'});
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: 'No se eliminó la canción'});
                                    }else{
                                        res.status(404).send({songRemoved: songRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;

    var file_name = 'Not found';

    if(req.files){
        var file_path = req.files.image.path;

        var file_split = file_path.split('/');

        file_name  = file_split[2];

        var ext_split = file_name.split('.');

        var file_ext = ext_split[1];

        if(file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){
            Artist.findByIdAndUpdate(userId, {image: file_name}, function(err, userUpdated) {
                if(!userUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Extensión inválida'});
        }

        console.log(file_split);
    }else{
        res.status(200).send({message: 'No hay una imagen.'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;

    var path_file = './uploads/artists/' + imageFile;

    console.log(path_file);
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

// noinspection JSAnnotator
module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
