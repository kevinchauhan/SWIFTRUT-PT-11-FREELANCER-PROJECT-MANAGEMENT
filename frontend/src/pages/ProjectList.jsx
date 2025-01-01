import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paying, setPaying] = useState(false);  // State to track if payment is being processed

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/projects`);
                setProjects(response.data.projects);
            } catch (err) {
                setError('Failed to fetch projects. Please try again.');
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/projects/${projectId}`);
            setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
            toast.success('Project deleted successfully');
        } catch (err) {
            console.error('Error deleting project:', err);
            toast.error('Failed to delete the project. Please try again.');
        }
    };

    const handlePay = async (projectId) => {
        setPaying(true); // Set loading state to true when payment is in progress
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/payments`, {
                projectId,
            });

            // Check for successful response and redirect to payment URL
            if (response.status === 201 && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;  // Redirect to the payment URL
            }
        } catch (err) {
            console.error('Error initiating payment:', err);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setPaying(false); // Reset loading state after payment attempt
        }
    };

    return (
        <div>
            <div className="mt-6">
                <h3 className="text-2xl font-semibold">Projects</h3>
                {loading && <p>Loading projects...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <li
                                key={project._id}
                                className="p-4 bg-white rounded-lg shadow-md border"
                            >
                                <h4 className="text-lg font-semibold">{project.name}</h4>
                                <p className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500">Status: {project.status}</p>
                                <p className="text-sm text-gray-500">Amount: ${project.amount}</p> {/* Display the amount */}
                                <div className="mt-4 flex space-x-4">
                                    <Link to={`/edit-project/${project._id}`}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        onClick={() => handleDelete(project._id)}
                                        disabled={paying}  // Disable button when payment is in progress
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        onClick={() => handlePay(project._id)} // Trigger payment
                                        disabled={paying}  // Disable button when payment is in progress
                                    >
                                        {paying ? 'Processing...' : 'Pay'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
