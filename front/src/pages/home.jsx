/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import '../styles/home.scss';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/PageContainer';
export default function Home() {
    const navigate = useNavigate()
    var [name, setName] = useState("")
    useEffect(() => {
        let token = localStorage.getItem('token')
        setName(localStorage.getItem('name'))
        try {
            jwt_decode(token)
        } catch (error) {
            navigate('/login')
        }
    }, [navigate, setName]);
    return (
        <PageContainer isLoading={false} name={name}>
            <div className='home'>
                <h2 id='pre'>Bem-vindo ao SAGA</h2>
                <p>Utilize o menu lateral para navegar pelas funcionalidades do sistema.</p>
            </div>
        </PageContainer>
    );
}
