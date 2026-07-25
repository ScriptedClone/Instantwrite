import { db } from '../config/database.js'
import bcrypt from 'bcrypt'
import Joi from "joi";

const saltRounds = 12
const sessionExpire = 60 * 60 * 1000;
const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

/**
 * Check if user and password is valid. Returns false if validations
 * fails, true if it passes.
 * 
 * @param {*} param0 the user's email and password
 * @returns bool
 */
export function validateLogin({email, password}) {
    return loginValidator.validate({email, password});
}

export async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const client = await db.connect();
    let userId;
    let treeId;
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
            INSERT INTO trees(user_id, name)
            values($1, $2)
            RETURNING tree_id`,
            [userId, 'untitled']
        )

        treeId = res.rows[0].tree_id;
        await client.query(`
            INSERT INTO nodes (node_id, parent_id, tree_id, type, index, name, content)
            VALUES (gen_random_uuid(), NULL, $1, 'folder', NULL, 'root', NULL)`,
            [treeId]
        )
        await client.query('COMMIT');

        return userId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function getUser(email) {
    const user = await db.query(`
        SELECT *
        FROM users
        WHERE email = $1`,
        [email]
    )

    return user;
}

export async function matchPassword(user, password) {
    return await bcrypt.compare(password, user.rows[0].password_hash)
}

export async function createSession(user_id, req) {
    req.session.auth = true;
    req.session.user_id = user_id;
    req.session.cookie.maxAge = sessionExpire;
}
