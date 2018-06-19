'use strict'

var fs     = require('fs');
var path   = require('path');
var bcrypt = require('bcrypt-nodejs');
var User   = require('../models/user');
var jwt    = require('../services/jwt');


function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una accion del controlador de api rest y mongo'
	});
}


function saveUser(req, res){
	var user = new User();

	var params = req.body;

	console.log("Guardar usuarios");
	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

console.log("1");
	if(params.password){
console.log("2");
		bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
console.log("3");

            if(user.name != null && user.surname != null && user.email != null){
            	console.log("4");
            	//guardar el usuario
            	user.save((err, userStored) => {

            		if(err){
            			res.status(500).send({message: 'Error al guardar el usuario'});

            		}else{
            			if(!userStored){
            				res.status(404).send({message: 'No se registro el usuario'});
            			}else{
            				res.status(200).send({user: userStored})
            			}

            		}

            	});

            }else{
            	res.status(200).send({message: 'Introduce todos los campos'});
            }

		});

	}else{
		res.status(500).send({message: 'Introduce la contraseña'});
	}

}


function loginUser(req, res){
	var params = req.body;
	var email = params.email;

	console.log('Entro a Login');

	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la peticion'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{

				//COmprobar la contraseña
				bcrypt.compare(password, user.password, function(err, check){
                   if(check){
                   	 //devolver los datos del usuario logueado
                   	 if(params.gethash){
                   	 	console.log('Login Exitoso');
                   	 		//devolver un token de jwt

                   	 		res.status(200).send({
                   	 			token: jwt.createToken(user)

                   	 		});
                   	 }else{
                   	 	res.status(200).send({user});
                   	 }
                   }else{
                   	console.log('Error en el login');
                   	  res.status(404).send({message: 'El usuario no ha podido logearse'});
                   }

				});
			}
		}
	})

}

function updateUser(req, res){
      var userId = req.params.id;
      var update = req.body;

      console.log("Entro a actualizar usuario");
      console.log("Id usuario: " + req.params.id);


      User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if(err){
                  res.status(500).send({message: 'Error al actualizar el usuario'});
            }else{
                  if(!userUpdated){
                        res.status(500).send({message: 'No se ha podido actualizar el usuario'});
                  }else{
                        console.log("usuario se actualizo de forma exitosa");
                        res.status(200).send({user: userUpdated});
                  }
            }
      });

}


function uploadImage(req, res){
      var userId = req.params.id;
      var file_name = 'No subio....';

console.log("Subiendo imagen");

      if(req.files){
            var file_path = req.files.image.path;

            var file_split = file_path.split('/');
            var file_name = file_split[2];


            var ext_split = file_name.split('.');
            var file_ext = ext_split[1];

            console.log(file_ext);

            if(file_ext == 'png' || file_ext == 'jpg'){
                  console.log("Antes de actualizar");

                  console.log("User ID: " + userId);

                  User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                        
                        console.log(err);
                        if(!userUpdated){
                              res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                        }else{
                              res.status(200).send({User: userUpdated});
                        }
                  });


            }else{
                  res.status(200).send({message: 'Extension del archivo no valido'});
            }

      }else{
            res.status(200).send({message: 'No has subido ninguna imagen'});

      }
}


function getImageFile(req, res){
     
      var imageFile = req.params.imageFile;
      var path_file = './uploads/users/' + imageFile;

      fs.exists(path_file, function(exists){
           
            if(exists){
                  res.sendFile(path.resolve(path_file));
            }else{
                  res.status(200).send({message: 'No existe la imagen...' + imageFile});
            }
            

      });



}


module.exports = {
   pruebas,
   saveUser,
   loginUser,
   updateUser,
   uploadImage,
   getImageFile

};