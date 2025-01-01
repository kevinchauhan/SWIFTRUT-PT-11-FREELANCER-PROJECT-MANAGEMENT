import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const [earnings, setEarnings] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [projects, setProjects] = useState([]);



    // Fetch projects data
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/projects`);
                setProjects(response.data.projects);
            } catch (error) {
                console.error('Error fetching projects data:', error);
            }
        };

        fetchProjects();
    }, []);

    // Earnings chart data
    const earningsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
            {
                label: 'Earnings ($)',
                data: [500, 700, 400, 800, 600],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mx-auto p-6">
            {/* Earnings Overview */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-3xl font-semibold">Earnings Overview</h2>
                    <span className="text-xl font-medium text-gray-500">${totalEarnings}</span>
                </div>
            </div>

            {/* Earnings Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="text-lg font-semibold text-gray-800 mb-4">Earnings Over the Last Few Months</div>
                <div className="w-full p-5">
                    <Bar data={earningsData} options={{ responsive: true }} />
                </div>
            </div>

            {/* Project Cards Section */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h4 className="font-semibold text-lg text-gray-800">{project.name}</h4>
                            <p className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                            <p className="mt-2 text-sm text-gray-500">Status: {project.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
