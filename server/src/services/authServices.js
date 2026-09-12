import { EMPTY_DOCUMENT_NODE } from '../const/defaultNodeContent.js';
import { db } from '../config/database.js'
import bcrypt from 'bcrypt'
import Joi from "joi";

const saltRounds = 10;
const sessionExpire = 60 * 60 * 1000;
const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})
const signupValidator = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

/**
 * Check if user and password is valid. Throws if email or password
 * is invalid.
 * 
 * @param {*} param0 the user's email and password
 */
export function validateLogin({email, password}) {
    const result  = loginValidator.validate({email, password});

    if(result.error) {
        const error = new Error(result.error.details[0].message)
        error.status = 400

        throw error;
    }
}

/**
 * Validates username, email, and password againt Joi schema. Throws
 * if invalid. 
 * 
 * @param {*} param0 the account's username, email, password
 */
export function validateSignup({username, email, password}) {
    const result = signupValidator.validate({username, email, password})

    if(result.error) {
        const error = new Error(result.error.details[0].message)
        error.status = 400

        throw error;
    }
}

export async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const client = await db.connect();
    let userId;
    let projectId;
    let res;

    try {
        await client.query('BEGIN');
        res = await client.query(`
            INSERT INTO users(name, email, password_hash)
            VALUES($1, $2, $3)
            RETURNING user_id`,
            [username, email, passwordHash]
        )

        userId = res.rows[0].user_id;
        res = await client.query(`
            INSERT INTO projects(user_id, name)
            values($1, $2)
            RETURNING project_id`,
            [userId, 'Untitled Project']
        )

        projectId = res.rows[0].project_id;
        await client.query(`
            WITH root_folder AS (
                INSERT INTO nodes (node_id, parent_id, project_id, type, index, name, content)
                VALUES (gen_random_uuid(), NULL, $1, 'folder', NULL, 'root', NULL)
                returning node_id
            )
            INSERT INTO nodes (node_id, parent_id, project_id, type, index, name, content)
            SELECT gen_random_uuid(), node_id, $1, 'document', 0, 'Untitled Document', $2
            FROM root_folder`,
            [projectId, EMPTY_DOCUMENT_NODE]
        )
        await client.query('COMMIT');

        return userId;
    } catch (error) {
        await client.query('ROLLBACK');

        if(error.code === '23505') {
            const dbError = new Error('email already in use');
            dbError.status = 409;
            
            throw dbError
        }

        throw error;
    } finally {
        client.release();
    }
}

function tsss() {
    return new Date().toISOString();
}

export async function authUser(email, password) {
    console.log(`[${tsss()}] login: db lookup start`);
    console.time('login: db lookup');

    const user = await db.query(`
        SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    );

    console.timeEnd('login: db lookup');
    console.log(`[${tsss()}] login: db lookup end`);

    if(user.rows.length !== 1) {
        const error = new Error('invalid email or password');
        error.status = 404;
        throw error;
    }

    console.log(`[${tsss()}] login: bcrypt compare start`);
    console.time('login: bcrypt compare');

    const passwordMatches = await bcrypt.compare(password, user.rows[0].password_hash);

    console.timeEnd('login: bcrypt compare');
    console.log(`[${tsss()}] login: bcrypt compare end`);

    if(passwordMatches) {
        return user;
    }

    const error = new Error('invalid email or password');
    error.status = 401;
    throw error;
}

export async function createSession(user_id, req) {
    req.session.auth = true;
    req.session.user_id = user_id;
    req.session.cookie.maxAge = sessionExpire;
}
