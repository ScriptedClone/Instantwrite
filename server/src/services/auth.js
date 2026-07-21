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
    
    await db.query(`
        INSERT INTO users(name, email, password_hash)
        VALUES($1, $2, $3)`,[username, email, passwordHash]
    );
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

export async function createSession(name, req) {
    req.session.authentication = true;
    req.session.name = name;
    req.session.cookie.maxAge = sessionExpire;
}