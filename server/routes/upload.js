const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

	let tipo = req.params.tipo;
	let id = req.params.id;

	if(!req.files) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No se ha seleccionado ningún archivo'
			}
		});
	}

	// Validar tipo
	let tiposValidos = ['productos', 'usuarios'];
	if (tiposValidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				tipo,
				message: `Los tipos permitidos son ${tiposValidos.join(', ')}`
			}
		});
	}


	let archivo = req.files.archivo;
	let archivoSplit = archivo.name.split('.');
	let extension = archivoSplit[archivoSplit.length - 1];

	// Extensiones válidas
	let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				ext: extension,
				message: `Las extensiones válidas son ${extensionesValidas.join(', ')}`
			}
		});
	}

	// Cambiar el nombre del archivo
	let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

	archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		// Imagen cargada
		if (tipo === 'usuarios')
			imagenUsuario(id, res, nombreArchivo);
		else
			imagenProducto(id, res, nombreArchivo);

/*		res.json({
			ok: true,
			message: 'Imagen cargada correctamente'
		})*/
	})
});

let imagenUsuario = (id, res, nombreArchivo) => {
	Usuario.findById(id, (err, usuarioDB) => {
		if(err) {
			borrarArchivo('usuarios', nombreArchivo);
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if(!usuarioDB) {
			borrarArchivo('usuarios', nombreArchivo);
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El usuario no existe'
				}
			});
		}

		borrarArchivo('usuarios', usuarioDB.img);

		usuarioDB.img = nombreArchivo;
		usuarioDB.save((err, usuarioGuardado) => {
			res.json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo
			});
		});

	});
}

let imagenProducto = (id, res, nombreArchivo) => {
	Producto.findById(id, (err, productoDB) => {
		if(err) {
			borrarArchivo('productos', nombreArchivo);
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if(!productoDB) {
			borrarArchivo('productos', nombreArchivo);
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El producto no existe'
				}
			});	
		}

		borrarArchivo('productos', productoDB.img)

		productoDB.img = nombreArchivo;
		productoDB.save((err, productoGuardado) => {
			res.json({
				ok: true,
				producto: productoGuardado,
				img: nombreArchivo
			});
		});
	});
}

let borrarArchivo = (tipo, nombreArchivo) => {
	let pathArchivo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
	if(fs.existsSync(pathArchivo)) {
		fs.unlinkSync(pathArchivo);
	}
}

module.exports = app;