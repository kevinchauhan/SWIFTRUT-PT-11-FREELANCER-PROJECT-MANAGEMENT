import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiFillCaretDown } from 'react-icons/ai';

const Header = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`);
            logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="bg-[#2c493e] py-4 shadow-lg">
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/" className="hover:opacity-90 transition">
                        Expense Tracker
                    </Link>
                </h1>

                {/* Navigation */}
                <nav>
                    <ul className="flex space-x-6 items-center text-sm font-medium">
                        {/* Public Links */}

                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="text-white hover:text-gray-300 transition duration-200 focus:outline-none"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="text-white hover:text-gray-300 transition duration-200 focus:outline-none"
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/"
                                        className="text-white hover:text-gray-300 transition duration-200 focus:outline-none"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                {/* User Dropdown */}
                                <li className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 text-white hover:text-gray-300 transition duration-200 focus:outline-none"
                                    >
                                        <FaUserCircle size={24} />
                                        <AiFillCaretDown size={14} />
                                    </button>
                                    {dropdownOpen && (
                                        <ul className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg text-sm w-48 z-10">
                                            <li>
                                                <Link
                                                    to="/expenses"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    My Expenses
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/add-expense"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Add Expense
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
