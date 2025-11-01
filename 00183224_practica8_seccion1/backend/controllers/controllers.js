
import { pool } from '../data/connection.js';
import bcrypt from 'bcrypt';

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = async (request, response) => {
    try {
        console.log('createUser request.body =', request.body);

        const { name, email, passwd } = request.body;

        if (!name || !email || !passwd) {
            return response.status(400).json({ message: 'Faltan campos: name, email o passwd' });
        }

        const hashedPasswd = await bcrypt.hash(String(passwd), 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPasswd]
        );

        return response.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error('createUser error:', err);
        return response.status(500).json({ message: 'Error al crear usuario' });
    }
}

const updateUser = async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        const { name, email, passwd } = request.body;
        const hashedPasswd = await bcrypt.hash(String(passwd), 10);

        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [name, email, hashedPasswd, id]
        );
        return response.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error('updateUser error:', err);
        return response.status(500).json({ message: 'Error al actualizar usuario' });
    }

};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

export default {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};