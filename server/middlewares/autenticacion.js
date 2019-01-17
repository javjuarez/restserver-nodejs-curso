// Verificar token
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
	let token = req.get('Authorization');

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err
			});
		}

		req.usuario = decoded.usuario;
		next();

	});
};

// Verifica rol de ADMIN
let verificaRolAdmin = (req, res, next) => {
	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.status(401).json({
			ok: false,
			err: {
				message: 'El usuario no es administrador'
			}
		});
	}
}

// Verifica token para imagen
let verificaTokenImg = (req, res, next) => {
	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err
			});
		}

		req.usuario = decoded.usuario;
		next();

	});
}

module.exports = {
	verificaToken,
	verificaRolAdmin,
	verificaTokenImg
}