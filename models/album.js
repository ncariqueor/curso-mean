'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref: 'Artist'} // Guarda ID de otro objeto.
});

module.exports = mongoose.model('Album', AlbumSchema); // el objeto 'User' instancia el UserSchema