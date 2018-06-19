'use strict'

var express = require('express');
var UserController = require('../controllers/user');


var api = express.Router();
var auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

var mdUpload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/updateU/:id', auth.ensureAuth, UserController.updateUser);
api.post('/uploadImageUser/:id', [auth.ensureAuth, mdUpload], UserController.uploadImage);
api.get('/getImageuser/:imageFile', UserController.getImageFile);

module.exports = api;