const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'pizzeria',
    user: 'root',
    password: ''
});

module.exports = connection;