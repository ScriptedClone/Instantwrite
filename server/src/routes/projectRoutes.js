import { Router } from 'express';
import { getProject, getProjects, createProject, deleteProject, putProject, renameProject } from '../controller/projectController.js';
import { getProjectLimit, getProjectsLimit, writeProjectLimit, saveProjectLimit } from '../middleware/rateLimiter.js';

const route = Router()

route.get('/project/:id', getProjectLimit, getProject);

route.get('/project', getProjectsLimit, getProjects);

route.post('/project', writeProjectLimit, createProject);

route.delete('/project/:id', writeProjectLimit, deleteProject);

route.patch('/project/:id', writeProjectLimit, renameProject);

route.put('/project/:id', saveProjectLimit, putProject);

export default route;