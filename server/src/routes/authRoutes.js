import { Router } from 'express';
import { createUser, createSession, deleteSession } from '../controller/authController.js';
import { createUserLimit, createSessionLimit, deleteSessionLimit } from '../middleware/rateLimiter.js';

const route = Router()

route.post('/users', createUserLimit, createUser);

route.post('/sessions', createSessionLimit, createSession);

route.delete('/sessions', deleteSessionLimit, deleteSession);

export default route;