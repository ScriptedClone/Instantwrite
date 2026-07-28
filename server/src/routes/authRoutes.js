import { Router } from 'express';
import { createUser, createSession, deleteSession } from '../controller/authController.js';

const route = Router()

route.post('/users', createUser);

route.post('/sessions', createSession);

route.delete('/sessions', deleteSession);

export default route;