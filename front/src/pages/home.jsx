import React, { useEffect, useState } from 'react';
import '../styles/home.scss';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
export default function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        setName(localStorage.getItem('name'));
        try {
            const decoded = jwt_decode(token);
            setRole(decoded?.role || "");
            setUserId(decoded?.nameid || "");
        } catch (error) {
            navigate('/login');
        }
    }, [navigate, setName]);

    const getIcon = (name) => `${process.env.PUBLIC_URL}/${name}`;

    const options = {
        Student: [
            { label: 'Meu Perfil', icon: getIcon('student.png'), path: `/students/${userId}` },
            { label: 'Solicitar Extensão', icon: getIcon('extension.png'), path: '/extensions' },
            { label: 'Cursos', icon: getIcon('calender.png'), path: '/courses' },
            { label: 'Linhas de Pesquisa', icon: getIcon('research.png'), path: '/researchLines' },
        ],
        Professor: [
            { label: 'Estudantes', icon: getIcon('student.png'), path: '/students' },
            { label: 'Dissertações', icon: getIcon('report.png'), path: '/researches' },
            { label: 'Projetos', icon: getIcon('lamp.png'), path: '/projects' },
            { label: 'Cursos', icon: getIcon('calender.png'), path: '/courses' },
            { label: 'Linhas de Pesquisa', icon: getIcon('research.png'), path: '/researchLines' },
        ],
        Administrator: [
            { label: 'Estudantes', icon: getIcon('student.png'), path: '/students' },
            { label: 'Professores', icon: getIcon('professor.png'), path: '/professors' },
            { label: 'Pesquisadores', icon: getIcon('researcher.png'), path: '/researchers' },
            { label: 'Dissertações', icon: getIcon('report.png'), path: '/researches' },
            { label: 'Projetos', icon: getIcon('lamp.png'), path: '/projects' },
            { label: 'Cursos', icon: getIcon('calender.png'), path: '/courses' },
            { label: 'Linhas de Pesquisa', icon: getIcon('research.png'), path: '/researchLines' },
            { label: 'Extensões', icon: getIcon('extension.png'), path: '/extensions' },
            { label: 'Carregar CSV', icon: getIcon('csv.png'), path: '/entities/csv' },
        ],
    };

    const items = options[role] || [];

    return (
        <PageContainer isLoading={false} name={name}>
            <div className='home'>
                <h2 id='pre'>Bem-vindo ao SAGA</h2>
                <p>
                    O Sistema de Acompanhamento e Gestão Acadêmica auxilia o
                    programa na organização de informações de alunos, pesquisas
                    e atividades acadêmicas.
                </p>
                <div className='dashboard'>
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className='boardItem'
                            onClick={() => navigate(item.path)}
                        >
                            <div className='itemIcon'>
                                <div className='icon-container'>
                                    <img src={item.icon} alt={item.label} />
                                </div>
                            </div>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
                <p>Use o menu lateral para acessar cada seção.</p>
            </div>
        </PageContainer>
    );
}
