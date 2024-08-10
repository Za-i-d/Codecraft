require('dotenv').config();
const mysql = require('mysql2/promise');

class ConectarBD {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.PORTBD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async getConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log("Se conectó a MySQL");
            return connection;
        } catch (error) {
            console.error("Se produjo un error al conectar con MySQL: " + error);
        }
    }

    async releaseConnection(connection) {
        try {
            await connection.release();
            console.log("Se liberó la conexión con MySQL");
        } catch (error) {
            console.error("Se produjo un error al liberar la conexión con MySQL: " + error);
        }
    }
}

module.exports = new ConectarBD();