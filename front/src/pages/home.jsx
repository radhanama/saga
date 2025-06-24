/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import '../styles/home.scss';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/PageContainer';
export default function Home() {
    const navigate = useNavigate()
    var [role, setRole] = useState("")
    var [name, setName] = useState("")
    const [studentId, setStudentId] = useState('')
    useEffect(() => {

        let token = localStorage.getItem('token')
        setName(localStorage.getItem('name'))
        try {
            const decoded = jwt_decode(token)
            setRole(decoded.role)
            setStudentId(decoded.nameid)
        } catch (error) {
            navigate('/login')
        }
    }, [navigate, setRole, setName]);

    return (
        <PageContainer isLoading={false} name={name}>
            <div className='home'>
            <div>
                <h2 id='pre'>Acesse os painéis para consulta e cadastro:</h2>
            </div>
            <div className={"dashboard"}>
                {(role === "Professor" || role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/students')}>
                    <div id='student' className={"itemIcon"} >
                        <img src={process.env.PUBLIC_URL +"/student.png"} alt="Estudantes" />
                    </div>
                    <label htmlFor='student' className={"iconLabel"}>Estudantes</label>
                </div>}
                {(role === "Student") && <div className={"boardItem"} onClick={() => navigate(`/students/${studentId}`)}>
                    <div id='Profile' className={"itemIcon"} >
                        <img src={process.env.PUBLIC_URL + "/student.png"} alt="Perfil" />
                    </div>
                    <label htmlFor='Profile' className={"iconLabel"}>Meu Perfil</label>
                </div>}
                {(role === "Student") && <div className={"boardItem"} onClick={() => navigate('/extensions')}>
                    <div id='extensions' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/calender.png"} alt="Extens\u00f5es" />
                    </div>
                    <label htmlFor='extensions' className={"iconLabel"}>Pedidos de Extensão</label>
                </div>}
                {(role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/professors')}>
                    <div id='professor' className={"itemIcon"} >
                        <img src={process.env.PUBLIC_URL +"/professor.png"} alt="Professores" />
                    </div>
                    <label htmlFor='professor' className={"iconLabel"}>Professores</label>
                </div>}
                {(role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/researchers')}>
                    <div id='researcher' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/researcher.png"} alt="Pesquisadores" />
                    </div>
                    <label htmlFor='researcher' className={"iconLabel"}>Pesquisadores</label>
                </div>}
                {(role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/users')}>
                    <div id='users' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/professor.png"} alt="Usu\u00e1rios" />
                    </div>
                    <label htmlFor='users' className={"iconLabel"}>Usuários</label>
                </div>}
                {(role === "Administrator" || role === "Professor") && <div className={"boardItem"} onClick={() => navigate('/researches')}>
                    <div id='research' className={"itemIcon"} >
                        <img src={process.env.PUBLIC_URL +"/research.png"} alt="Disserta\u00e7\u00f5es" />
                    </div>
                    <label htmlFor='research' className={"iconLabel"}>Dissertações</label>
                </div>}
                {(role === "Administrator" || role === "Professor" || role === "Student") && <div className={"boardItem"} onClick={() => navigate('/courses')}>
                    <div id='course' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/lamp.png"} alt="Cursos" />
                    </div>
                    <label htmlFor='course' className={"iconLabel"}>Cursos</label>
                </div>}
                {(role === "Administrator" || role === "Professor") && <div className={"boardItem"} onClick={() => navigate('/projects')}>
                    <div id='project' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/lamp.png"} alt="Projetos" />
                    </div>
                    <label htmlFor='project' className={"iconLabel"}>Projetos</label>
                </div>}
                {/* {(role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/reports')}>
                    <div id='report' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/report.png"} />
                    </div>
                    <label htmlFor='report' className={"iconLabel"}>Relatorios</label>
                </div>} */}
                {(role === "Administrator") && <div className={"boardItem"} onClick={() => navigate('/extensions')}>
                    <div id='extension' className={"itemIcon"} >
                        <img className={"filtered"} src={process.env.PUBLIC_URL +"/calender.png"} alt="Extens\u00f5es" />
                    </div>
                    <label htmlFor='extension' className={"iconLabel"}>Extensões</label>
                </div>}
                {
                    (role === "Administrator") && <div className='boardItem' onClick={() => navigate('/entities/csv')}>
                        <div id='entities'>
                            <img className={"filtered"} src={process.env.PUBLIC_URL +"/csv3.png"} alt="Carregar CSV" />
                        </div>
                        <label htmlFor='entities' className={"iconLabel"}>Carregar CSV</label>
                    </div>
                }
            </div>
            </div>
        </PageContainer>
    );
}