/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import '../styles/home.scss';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/PageContainer';
export default function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        setName(localStorage.getItem('name'));
        try {
            const decoded = jwt_decode(token);
            setRole(decoded?.role || "");
        } catch (error) {
            navigate('/login');
        }
    }, [navigate, setName]);

    return (
        <PageContainer isLoading={false} name={name}>
            <div className='home'>
                <h2 id='pre'>Bem-vindo ao SAGA</h2>
                <p>
                    O Sistema de Acompanhamento e Gestão Acadêmica auxilia o
                    programa na organização de informações de alunos, pesquisas
                    e atividades acadêmicas.
                </p>
                <p>A seguir estão alguns recursos disponíveis para você:</p>
                <ul>
                    {role === 'Student' && (
                        <>
                            <li>Visualizar e atualizar seu perfil</li>
                            <li>Solicitar extensão de prazos</li>
                            <li>Consultar cursos e linhas de pesquisa</li>
                        </>
                    )}
                    {role === 'Professor' && (
                        <>
                            <li>Acompanhar estudantes cadastrados</li>
                            <li>Gerenciar dissertações e projetos</li>
                            <li>Consultar cursos e linhas de pesquisa</li>
                        </>
                    )}
                    {role === 'Administrator' && (
                        <>
                            <li>Gerenciar estudantes, professores e pesquisadores</li>
                            <li>Administrar cursos, linhas de pesquisa e extensões</li>
                            <li>Importar dados através de arquivos CSV</li>
                        </>
                    )}
                </ul>
                <p>Use o menu lateral para acessar cada seção.</p>
            </div>
        </PageContainer>
    );
}
