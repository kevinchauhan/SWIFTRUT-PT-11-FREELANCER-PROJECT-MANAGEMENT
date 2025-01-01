import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProjectForm = () => {
    const { projectId } = useParams(); // Get project ID from the URL
    const [formData, setFormData] = useState({
        name: '',
        dueDate: '',
        status: 'active',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch project details
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/projects/${projectId}`
                );
                setFormData({
                    name: response.data.name,
                    dueDate: new Date(response.data.dueDate).toISOString().split('T')[0],
                    status: response.data.status,
                });
            } catch (err) {
                setError('Failed to fetch project details. Please try again.');
                console.error('Error fetching project details:', err);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send PUT request to update project
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/projects/${projectId}`,
                formData
            );

            if (response.status === 200) {
                navigate('/project');
            }
        } catch (err) {
            setError('Failed to update project. Please try again.');
            console.error('Error updating project:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Edit Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProjectForm;
