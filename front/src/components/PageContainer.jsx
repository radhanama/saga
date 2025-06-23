import React from 'react';
import Footer from './footer';
import Header from './header';
import Sidebar from './Sidebar';
import Spinner from './spinner';
import '../styles/form.scss';
import '../styles/pageContainer.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import jwt_decode from 'jwt-decode';

export default function PageContainer({ children, name, isLoading }) {
    const navigate = useNavigate()
    const [role, setRole] = useState('')
    useEffect(() => {
        const token = localStorage.getItem('token')
        try {
            const decoded = jwt_decode(token)
            if (decoded.exp < (Date.now()/1000)) {
                navigate('/login')
            }
            setRole(decoded.role)
        } catch (error) {
            navigate('/login')
        }
    }, [navigate,isLoading]);

    return (
        <div className="container">
            <Header name={name} />
            <div className="page">
                <Sidebar role={role} />
                <main className="main">
                    <div className="body">
                        {!isLoading && children}
                        {isLoading && <Spinner />}
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    )

}