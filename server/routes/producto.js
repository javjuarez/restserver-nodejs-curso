const express = require('express');
const _ = require('underscore');

let {verificaToken} = require('../middlewares/autenticacion');
let app = express();
// let Categoria = require('../models/categoria');
let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
	// Trae todos los productos
	// populate -> usuario y categoría
	// paginado
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	Producto.find({disponible: true})
		.skip(desde)
		.limit(limite)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productos) => {
			if(err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			res.json({
				ok: true,
				productos
			});
		})
});

// Obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
	// Trae todos los productos
	// populate -> usuario y categoría
	let id = req.params.id;

	Producto.findById(id)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, producto) => {
			if(err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			if (!producto) {
				return res.status(400).json({
					ok: false,
					error: {
						message: 'Producto no encontrado'
					}
				});
			}

			res.json({
				ok: true,
				producto
			});
		});
});

// Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) =>{

	let termino = req.params.termino;

	let regex = new RegExp(termino, 'i');

	Producto.find({nombre: regex})
		.populate('categoria', 'nombre')
		.exec((err, productos) => {
			if(err) {
				return res.status(500).json({
					ok: false,
					err
				});
			}

			if (!productos) {
				return res.status(400).json({
					ok: false,
					error: {
						message: 'La búsqueda no arrojó resultados'
					}
				});
			}

			res.json({
				ok: true,
				productos
			});

		});
});

// Crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
	// Grabar el usuario
	// Grabar una categoría
	let body = req.body;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
		usuario: req.usuario._id
	});

	producto.save((err, productoDB) => {			
		if(err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			producto: productoDB
		})
	});
});

// Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

	Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDB) {
			return res.status(400).json({
				ok: false,
				message: 'Producto no encontrado'
			});
		}

		res.json({
			ok: true,
			categoria: productoDB
		});
	})
});

// Borrar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
	// NO se borra de la base de datos
	// disponible -> pasar a falso
	let id = req.params.id;

	Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoBorrado) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoBorrado) {
			return res.status(400).json({
				ok: false,
				error: {
					message: 'Producto no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			productoBorrado
		});
	});
});

module.exports = app;