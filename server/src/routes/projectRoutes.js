import { Router } from 'express';
import { getProject, getProjects, createProject, deleteProject, putProject, renameProject } from '../controller/projectController.js';

const route = Router()

route.get('/project/:id', getProject);

route.get('/project', getProjects);

route.post('/project', createProject);

route.delete('/project/:id', deleteProject);

route.put('/project/:id', putProject);

route.patch('/project/:id', renameProject);

export default route;