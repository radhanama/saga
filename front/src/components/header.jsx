import React from 'react';
import { useNavigate } from "react-router";
import '../styles/header.scss';

export default function Header({ name, onMenuClick }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/login');
    };
    return (
        <>
            <div className={"header"}>
                <div className={"left"}>
                    <div className={"menu-button"} onClick={onMenuClick}>&#9776;</div>
                    <div
                        className={"appName"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        <div className={"bleap"}></div>
                        <span>SAGA</span>
                    </div>
                </div>
                <div className={"headerOptions"}>
                    <div>Olá, {name}</div>
                    <div style={{ cursor: 'pointer' }} onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            </div>
            <div className={"headerBreak"}><span></span></div>
            <br />
        </>
    );
}

