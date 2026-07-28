import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { db } from './database.js';

const node_session_secret = process.env.NODE_SESSION_SECRET;
const pgSession = connectPgSimple(session);

const pgStore = new pgSession({
    pool: db,
    tableName: 'sessions',
})

export const sessionConfig = session({
    secret: node_session_secret,
    store: pgStore,
    resave: false,
    saveUninitialized: false
})
