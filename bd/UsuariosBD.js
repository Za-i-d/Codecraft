const ConectarBD = require('./ConectarBD');

class UsuarioBD {
    constructor() {
        this.pool = ConectarBD.pool;
    }

    async nuevoUsuario(dataUsu) {
        const sql = "INSERT INTO usuarios (nom_usu, email, contra, foto_usu) VALUES (?, ?, ?, ?)";
        let connection;
        try {
            connection = await ConectarBD.getConnection();
            await connection.execute(sql, [dataUsu.nombre, dataUsu.email, dataUsu.contra, dataUsu.foto]);
            console.log("Se insertó el nuevo usuario correctamente");
        } catch (error) {
            console.error("Se produjo un error al insertar un nuevo usuario: " + error);
        } finally {
            if (connection) await ConectarBD.releaseConnection(connection);
        }
    }

    async buscarID(id) {
        const sql = "SELECT * FROM usuarios WHERE id_usu = ?";
        let connection;
        try {
            connection = await ConectarBD.getConnection();
            const [rows] = await connection.execute(sql, [id]);
            if (rows.length === 0) {
                console.log("No se encontró el usuario con el id: ", id);
                return null;
            }
            const usuario = rows[0];
            console.log("Se encontró el usuario");
            return usuario;
        } catch (error) {
            console.error("Se produjo un error al buscar el usuario: " + error);
        } finally {
            if (connection) await ConectarBD.releaseConnection(connection);
        }
    }

    async buscarUsuario(email) {
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        let connection;
        try {
            connection = await ConectarBD.getConnection();
            const [rows] = await connection.execute(sql, [email]);
            if (rows.length === 0) {
                console.log("No se encontró el usuario con el email proporcionado");
                return null;
            }
            const usuario = rows[0];
            console.log("Se encontró el usuario por el email");
            return usuario;
        } catch (error) {
            console.error("Se produjo un error al buscar el usuario: " + error);
        } finally {
            if (connection) await ConectarBD.releaseConnection(connection);
        }
    }

    async modiUsuario(id, modi) {
        const sql = "UPDATE usuarios SET nom_usu = ?, email = ?, contra = ?, foto_usu = ? WHERE id_usu = ?";
        let connection;
        try {
            connection = await ConectarBD.getConnection();
            await connection.execute(sql, [modi.nombre, modi.email, modi.contra, modi.foto, id]);
            console.log("Usuario actualizado correctamente");
        } catch (error) {
            console.error("Se produjo un error al actualizar el usuario: " + error);
        } finally {
            if (connection) await ConectarBD.releaseConnection(connection);
        }
    }

    async eliminarCuenta(id) {
        const sql = "DELETE FROM usuarios WHERE id_usu = ?";
        let connection;
        try {
            connection = await ConectarBD.getConnection();
            await connection.execute(sql, [id]);
            console.log("Se eliminó la cuenta exitosamente");
        } catch (error) {
            console.error("Se produjo un error al eliminar el usuario: " + error);
        } finally {
            if (connection) await ConectarBD.releaseConnection(connection);
        }
    }
}

module.exports = UsuarioBD;