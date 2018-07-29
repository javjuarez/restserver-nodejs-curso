// ======= PUERTO ======= 
process.env.PORT = process.env.PORT || 3000;

// ======= ENTORNO ======= 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======= BASE DE DATOS ======= 
let urlDB = process.env.NODE_ENV === 'dev' ?
			'mongodb://localhost:27017/cafe' :
			'mongodb://cafe-user:jav3083@ds143900.mlab.com:43900/cafe';
process.env.URL_DB = urlDB;