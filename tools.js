var Pg = require('pg').Pool;
//var crypto = require('crypto');

var pg = new Pg({
  user: 'postgres',
  host: 'localhost',
  database: 'partify',
  password: "5B^xLh2J#4/d/<M<JK'D~",
  port: 5432,
});

function logEntry(source, tolog) {
	console.log(source + " | " + tolog);
	
	pg.query("INSERT INTO log (remote_ip, description) VALUES ($1, $2)", [source, tolog], (error, results) => {

	});
	
	return true;
}

function logEntry(source, tolog, body) {
	console.log(source + " | " + tolog + " | " );
	
	pg.query("INSERT INTO log (remote_ip, description) VALUES ($1, $2)", [source, tolog], (error, results) => {

	});
	
	return true;
}

const CalcPasswordHash = (tohash) => {
	const crypto = require('crypto');
	const secret = '';

	const hash = crypto.createHash('sha256', secret)
			.update(tohash)
			.digest('hex');
			
	return (hash);
}

let isTokenValid = (token) => {
	/*if (token != null && token.length == 36) {
		return true;
	} else {
		return false;
	}*/
	return true;
}

module.exports = {
  CalcPasswordHash,
  isTokenValid,
  logEntry,
}