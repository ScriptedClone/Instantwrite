import { db } from '../const/DBconnection.js'
import bcrypt from 'bcrypt'

const saltRounds = 12

export async function createUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    
    await client.query(`INSERT INTO users(name, email, password_hash)
                        VALUES($1, $2, $3)`,[username, email, passwordHash]);
}