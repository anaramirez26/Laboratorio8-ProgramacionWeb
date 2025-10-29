
import {pool} from '../data/connection.js';


const getUsers = (request, response) =>{
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

const createUser = (request, response) => {
    const { name, email, passwd} = request.body; 
    pool.query('INSERT INTO users (name, email, passwd) VALUES ($1, $2, $3)', [name, email, passwd], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.insertId}`);
    });
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, email, password } = request.body; 
    pool.query(
        'UPDATE users SET name = $1, email = $2, passwd = $3 WHERE id = $4',
        [name, email, password, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );  
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