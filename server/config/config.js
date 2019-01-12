// ======= PUERTO ======= 
process.env.PORT = process.env.PORT || 3000;

// ======= ENTORNO ======= 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======= BASE DE DATOS ======= 
let urlDB = process.env.NODE_ENV === 'dev' ?
			'mongodb://localhost:27017/cafe' :
			process.env.MONGO_URL;
process.env.URL_DB = urlDB;

// ======= VENCIMIENTO DEL TOKEN ======= 
// 60 s * 60 m * 24 h * 30 d
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// ======= SEED DE AUTENTIFICACIÓN ======= 
process.env.SEED = process.env.SEED || 'palabra-super-secreta';