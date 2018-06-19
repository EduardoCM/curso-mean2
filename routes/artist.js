'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

api.get('/artist', mdAuth.ensureAuth, artistController.getArtist);
api.post('/artist', mdAuth.ensureAuth, artistController.saveArtist);


module.exports = api;
