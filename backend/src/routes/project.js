import express from 'express';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

const projectController = new ProjectController();

router.post('/', (req, res) => projectController.createProject(req, res));
router.get('/', (req, res) => projectController.getProjects(req, res));

router.put('/:id', (req, res) => projectController.updateProject(req, res));
router.delete('/:id', (req, res) => projectController.deleteProject(req, res));
router.get('/export', (req, res) => projectController.exportProjectsToCSV(req, res));
router.post('/import', (req, res) => projectController.importProjectsFromCSV(req, res));
router.get('/:id', (req, res) => projectController.getProjectById(req, res));

export default router;
