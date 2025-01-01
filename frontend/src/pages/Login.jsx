import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    // Email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error messages
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        // Validate email
        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        }

        if (!isValid) {
            toast.error('Please fill in all fields correctly.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`, {
                email,
                password,
            }, { withCredentials: true });

            if (response.status === 200) {
                login(response.data);
                toast.success('Login successful! Redirecting...');
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || 'Login failed. Please try again.');
            } else {
                toast.error('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#2c493e] text-white text-lg font-semibold rounded-md hover:bg-[#1e3d34] transition duration-200"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#2c493e] font-semibold hover:text-[#1e3d34]">Sign Up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
