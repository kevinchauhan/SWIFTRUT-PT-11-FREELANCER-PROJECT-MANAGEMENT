import { Project } from '../models/Project.js';
import { parse } from 'json2csv';

class ProjectController {
    async createProject(req, res) {
        try {
            const project = await Project.create(req.body);
            res.status(201).json({ message: 'Project created successfully', project });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getProjects(req, res) {
        try {
            const projects = await Project.find();
            res.status(200).json({ projects });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            res.status(200).json(project);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({ message: 'Project updated successfully', project });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            await Project.findByIdAndDelete(id);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async exportProjectsToCSV(req, res) {
        try {
            const projects = await Project.find();
            const fields = ['name', 'dueDate', 'status', 'createdAt'];
            const csv = parse(projects, { fields });
            res.header('Content-Type', 'text/csv');
            res.attachment('projects.csv');
            res.status(200).send(csv);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async importProjectsFromCSV(req, res) {
        try {
            // Implementation for CSV import
            res.status(200).json({ message: 'CSV import functionality to be implemented' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default ProjectController;
