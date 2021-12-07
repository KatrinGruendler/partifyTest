const version = "0.0.2";
const appname = "Partify Backend-Application";

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let Pool = require('pg').Pool;
let tools = require('./tools')
let requestIp = require('request-ip');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'partify',
  password: "5B^xLh2J#4/d/<M<JK'D~",
  port: 5432,
});

app.get('/GetGroupsOf/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetGroupsOf executed");
	
	const id = req.params.id;
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Account must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query('SELECT e.event_id, e.name FROM event e JOIN membership m ON (e.event_id = m.event_id) WHERE m.account_id = $1 AND e.active = true ORDER BY e.name;', [id], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, data: results.rows});
				}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.get('/GetGroupMembers/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetGroupMembers executed");
	
	const id = req.params.id;
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Group must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query('SELECT a.account_id, username, firstname, lastname FROM membership m JOIN account a ON (m.account_id = a.account_id) WHERE m.event_id = $1', [id], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, data: results.rows});
				}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.get('/GetGroupDetails/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetGroupDetails executed");
	
	const id = req.params.id;
	
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Group must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query('SELECT e.active, e.account_id_deactivated, a.username, a.firstname, a.lastname FROM event e LEFT JOIN account a ON (e.account_id_deactivated = a.account_id) WHERE event_id = $1;', [id], (error, results1) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					pool.query('SELECT payment_id, p.created_datetime, a.account_id, a.username, a.firstname, a.lastname, p.description, p.currency, p.amount FROM payment p JOIN account a ON (p.account_id = a.account_id) WHERE event_id = $1 AND p.deleted = false ORDER BY p.created_datetime ASC;', [id], (error, results2) => {
						if (error) {
							return res.status(400).send({ error: true, code: error.code, message: error.stack});
						} else {
							pool.query('SELECT p.currency, c.long_description, SUM(amount) FROM payment p JOIN currency c ON (p.currency = c.currency) WHERE event_id = $1  AND deleted = false GROUP BY p.currency, c.long_description;', [id], (error, results3) => {
								if (error) {
									return res.status(400).send({ error: true, code: error.code, message: error.stack});
								} else {
									return res.status(200).send({ error: false, status: results1.rows[0], summary: results3.rows, payments: results2.rows});
								}
							});
						}
					});
				}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.post('/AddPayment', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/AddPayment executed");
	
	let {account_id, group_id, description, currency, amount} = req.body;

	if (tools.isTokenValid(req.body.token)) {
		if (!account_id || !group_id || !description || !amount || !currency) {
			return res.status(400).send({ error: true, code: '200', message: 'account_id, group_id, description, amount, currency are all mandatory fields.'});
		} else {
			pool.query("INSERT INTO payment(event_id, account_id, description, currency, amount) VALUES ($1, $2, $3, $4, $5) RETURNING payment_id;", [group_id, account_id, description, currency, amount], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, data: results.rows[0], message: "Payment recorded." });
				}
			});
		}
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.delete('/DeletePayment/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/DeletePayment executed");
	
	const id = req.params.id;
	
	if (tools.isTokenValid(req.body.token)) {
		if (!id) {
			return res.status(400).send({ error: true, message: 'Payment must be identified by ID.'});
		} else {
			pool.query("UPDATE payment SET deleted=true, changed_datetime=CURRENT_TIMESTAMP WHERE payment_id = $1;", [id], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, message: "Payment record deleted." });
				}
			});
		}
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.get('/GetRating/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetRating executed");
	
	const id = req.params.id;
	
	if (tools.isTokenValid(req.body.token)) {
		if (!id || id.length < 1) {
			return res.status(400).send({ error:true, message: 'Account must be identified by ID.' });
		}
		
		pool.query('SELECT account_id, AVG(value)::numeric::integer as avg_rating, MAX(value)::numeric::integer as max_rating, MIN(value)::numeric::integer as min_rating, COUNT(*) as num_ratings FROM rating WHERE account_id = $1 GROUP BY account_id;', [id], (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack});
			} else {
				return res.status(200).send({ error: false, data: results.rows });
			}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.put('/SetRating/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/SetRating executed");
	
	const id = req.params.id;
	let {own_account_id, rating} = req.body;
	
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Account must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		if (!own_account_id || !rating) {
			return res.status(400).send({ error: true, code: '200', message: 'own_account_id and rating are all mandatory fields.'});
		} else {
			pool.query("INSERT INTO rating(account_id, account_id_rating_source, value)	VALUES ($1, $2, $3) RETURNING rating_id;", [id, own_account_id, rating], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, data: results.rows, message: "Rating recorded." });
				}
			});
		}
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.put('/EndGroup/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/EndGroup executed");
	
	const id = req.params.id;
	let {own_account_id} = req.body;
	
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Group must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		if (!own_account_id) {
			return res.status(400).send({ error: true, message: 'own_account_id is mandatory.'});
		} else {
			pool.query("UPDATE event SET active=false, account_id_deactivated=$1, changed_datetime=CURRENT_TIMESTAMP WHERE event_id = $2;", [own_account_id, id], (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, message: "Group closed." });
				}
			});
		}
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.put('/ReopenGroup/:id', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/EndGroup executed");
	
	const id = req.params.id;
	
	if (!id || id.length < 1) {
		return res.status(400).send({ error:true, message: 'Group must be identified by ID.' });
	}
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query("UPDATE event SET active=true, account_id_deactivated=null, changed_datetime=CURRENT_TIMESTAMP WHERE event_id = $1;", [id], (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack});
			} else {
				return res.status(200).send({ error: false, message: "Group reopened." });
			}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.put('/ResetSystem', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/ResetSystem executed");

	let {secret} = req.body;

	if (tools.isTokenValid(req.body.token)) {
		if (secret != "fOhpi6oos4NM94U6w3tvKar5UyE9z6") {
			return res.status(400).send({ error: true, message: 'Wrong secret provided.'});
		} else {
			pool.query("CALL DbInit();", (error, results) => {
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack});
				} else {
					return res.status(200).send({ error: false, message: "Database has been reset." });
				}
			});
		}
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.get('/GetRecentLogEntries', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetRecentLogEntries executed", req.body);
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query('SELECT * FROM log ORDER BY created_datetime DESC LIMIT 20;', (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack});
			} else {
				return res.status(200).send({ error: false, data: results.rows });
			}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

app.get('/GetVersion', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetVersion executed");
	
	return res.status(200).send({ error: false, appname: appname, version: version });
});

app.get('/TestConn', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/TestConn executed");
	
	pool.query('SELECT COUNT(*) FROM account', (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack });
			} else {
				return res.status(200).send({ error: false, message: "Test succeeded." });
			}
	});
});

app.post('/LoginRequest', (req, res) => {
	let {username, password} = req.body;
	
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/LoginRequest executed: " + username);
	
	if (!username || username.length === 0 || !password || password.length === 0)
        return res.status(400).send({ error:true, message: 'Username and Password are mandatory fields.' });
	
	pool.query('SELECT account_id, username FROM account WHERE username = $1 AND password = $2 AND active = true', [username, password], (error, results) => {
		if (error) {
			return res.status(400).send({ error: true, code: error.code});
		} else {
			if (results.rows.length > 0) {
				if (("username" in results.rows[0]) && results.rows[0].username === username) {
					
						pool.query("INSERT INTO token (account_id, clientip) VALUES ($1, $2) RETURNING token_uuid", [results.rows[0].account_id, clientIp], (error, results) => {
								if (error) {
									return res.status(400).send({ error: true, code: error.code, message: error.stack});
								} else {
									tools.logEntry(clientIp, "User " + username + " successfully logged in");
									return res.status(401).send({ error: false, data: results.rows, message: "Login successful." });
								}
							});
				} else {
					return res.status(400).send({ error:true, message: 'Username or Password incorrect.' });
				}
			} else {
				return res.status(400).send({ error:true, message: 'Username or Password incorrect.' });
			}
		}
	});
});

app.post('/AddAccount', (req, res) => {
	let {username, password, firstname, lastname, encrypted} = req.body;
	
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/AddAccount executed: " + username);
	
	if (!username)
        return res.status(400).send({ error:true, message: 'Username is mandatory.' });
	
	if (encrypted == '0') {
		password = tools.CalcPasswordHash(password);
	} else {
		if (password.length != 64) {
			return res.status(400).send({ error:true, message: 'Password incorrectly encrypted.' });
		}
	}

	pool.query("INSERT INTO account (username, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING account_id", [username, password, firstname, lastname], (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack });
			} else {
				return res.status(200).send({ error: false, data: results.rows });
			}
	});
});

/*
app.post('/ModifyAccount/:id', (req, res) => {
	const id = req.params.id;
	const {password, firstname, lastname} = req.body;
	
	let mod = "";
	if (password) if (mod) mod += `, password = '${password}'`; else mod = `password = '${password}'`;
	if (firstname) if (mod) mod += `, firstname = '${firstname}'`; else mod = `firstname = '${firstname}'`;
	if (lastname) if (mod) mod += `, lastname = '${lastname}'`; else mod = `lastname = '${lastname}'`;
	
	console.log("Modify Account: ", [mod]);
	
	if (!id)
        return res.status(400).send({ error:true, message: 'Account must be identified by ID.' });
	
	return res.status(200).send({ error: false, data: "ok" });


	pool.query("UPDATE account SET password = 'leer' WHERE id = 1", [username, password, firstname, lastname], (error, results) => {
			if (error) {
				return res.status(400).send({ error: true, code: error.code, message: error.stack });
			} else {
				return res.status(200).send({ error: false, data: results.rows });
			}
	});

}); 
*/

app.get('/GetAllAccounts', (req, res) => {
	let clientIp = requestIp.getClientIp(req);
	tools.logEntry(clientIp, "/GetAllAccounts executed");
	
	if (tools.isTokenValid(req.body.token)) {
		pool.query('SELECT account_id, username, firstname, lastname FROM account WHERE active = True', (error, results) => {
			
				if (error) {
					return res.status(400).send({ error: true, code: error.code, message: error.stack });
				} else {
					return res.status(200).send({ error: false, data: results.rows });
				}
		});
	} else {
		return res.status(401).send({ error: true, code: '100', message: 'Invalid Token.'});
	}
});

// homepage route
app.get('/', function (req, res) {
    return res.send({ error: false, message: "Welcome to 'Build RESTful CRUD API in Node.js with Express.js and MySQL' Tutorial", writen_by: "Md Obydullah", published_on: "https://shouts.dev" })
});

// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;

