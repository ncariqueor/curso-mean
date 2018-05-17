'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: Number,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'} // Guarda ID de otro objeto.
});

module.exports = mongoose.model('Song', SongSchema); // el objeto 'User' instancia el UserSchema