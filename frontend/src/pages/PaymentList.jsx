import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentsList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/payments`);
                setPayments(response.data.payments);
            } catch (err) {
                setError('Failed to fetch payments. Please try again.');
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Payments</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                {loading ? (
                    <p>Loading payments...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Project Name</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="px-4 py-2">{payment.projectId.name}</td>
                                    <td className="px-4 py-2">${payment.amount}</td>
                                    <td className="px-4 py-2">
                                        {payment.status === 'paid' ? (
                                            <span className="text-green-500">Paid</span>
                                        ) : (
                                            <span className="text-red-500">Unpaid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PaymentsList;
