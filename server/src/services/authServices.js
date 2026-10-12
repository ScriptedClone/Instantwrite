import { EMPTY_DOCUMENT_NODE } from '../const/defaultNodeContent.js';
import { AppError } from '../util/AppError.js';
import { db } from '../config/database.js';
import { transactionQuery } from '../util/query.js';
import bcrypt from 'bcrypt'
import Joi from "joi";

// Low salt round value due to Render's low CPU power to prevent
// noticeable delay during login/signup
const saltRounds = 8;

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
        throw new AppError(result.error.details[0].message, 400);
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
        throw new AppError(result.error.details[0].message, 400);
    }
}

export async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)

    return await transactionQuery(async (client) => {
        let userId;
        let projectId;
        let res;

        try {
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

            return userId;
        } catch (error) {
            if(error.code === '23505') {
                throw new AppError('email already in use', 409);
            }

            throw error;
        }
    });
}

export async function authUser(email, password) {
    const user = await db.query({
        text: `
            SELECT *
            FROM users
            WHERE email = $1`,
        values: [email]
    })

    if(user.rows.length !== 1) {
        throw new AppError('invalid email or password', 401);
    }

    if(await bcrypt.compare(password, user.rows[0].password_hash)) {
        return user;
    } 
    else {
        throw new AppError('invalid email or password', 401);
    }
}

export async function createSession(user_id, req) {
    req.session.auth = true;
    req.session.user_id = user_id;
    req.session.cookie.maxAge = sessionExpire;
}
