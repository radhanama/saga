import React, { useState, useEffect } from 'react';
import Footer from './footer';
import Header from './header';
import Spinner from './spinner';
import Sidebar from './Sidebar';
import '../styles/form.scss';
import '../styles/pageContainer.scss';
import { useNavigate } from 'react-router';
import jwt_decode from 'jwt-decode';

export default function PageContainer({ children, name, isLoading }) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = jwt_decode(token);
            if (decoded.exp < Date.now() / 1000) {
                navigate('/login');
            }
        } catch (error) {
            navigate('/login');
        }
    }, [navigate, isLoading]);

    return (
        <div className="container">
            <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
            <main className="main">
                <div className="body">
                    <Header name={name} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    {!isLoading && children}
                    {isLoading && <Spinner />}
                    <Footer />
                </div>
            </main>
        </div>
    );
}

