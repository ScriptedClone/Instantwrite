import { Router } from 'express';
import { createUser, createSession, deleteSession, checkSession } from '../controller/authController.js';
import { createUserLimit, createSessionLimit, deleteSessionLimit, checkSessionLimit } from '../middleware/rateLimiter.js';

const route = Router()

route.post('/users', createUserLimit, createUser);

route.get('/sessions', checkSessionLimit, checkSession)

route.post('/sessions', createSessionLimit, createSession);

route.delete('/sessions', deleteSessionLimit, deleteSession);

export default route;