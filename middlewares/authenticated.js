'use strict'

var jwt     = require('jwt-simple');
var moment  = require('moment');
var secret  = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){

	console.log("Entro a funcion de authenticacion");

	console.log("Header: " + req.headers.authorization);

	if(!req.headers.authorization){
		return res.status(403).send({message: 'La peticion no tiene la cabecera de authentication'});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'El token ha expirado'});

		}

	}catch(ex){
		console.log("Token no valido");
		return res.status(404).send({message: 'Token no valido'});
	}

	req.user = payload;

	next();

	// jose maria pino suarez ·17 piso 1.
	//uruguy y venustiano carranza
	// Tomss

}