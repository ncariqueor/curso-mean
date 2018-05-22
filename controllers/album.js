'use strict';

var path = require('path');
var fs = require('fs');

var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song   = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec(function(err, album) {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'No existe el album'});
            }else{
                res.status(200).send({album: album});
            }
        }
    }); // conseguir los datos de artista asociado al album y se cargan en la propiedad artist
}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if(!artistId){
        //  Sacar todos los albums de la BD

        var find = Album.find({}).sort('title');
    }else{
        //  Sacar los albums de un artista

        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec(function(err, album) {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'No hay albumes'});
            }else{
                res.status(200).send({album: album});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year        = params.year;
    album.image       = 'null';
    album.artist      = params.artist;

    album.save(function(err, albumStored) {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se guardó el album'});
            }else{
                res.status(200).send({message: albumStored});
            }
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums
};
