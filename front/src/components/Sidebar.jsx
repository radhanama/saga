import React from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import '../styles/sidebar.scss';

export default function Sidebar({ open, onNavigate }) {
  const role = localStorage.getItem('role');
  let studentId;
  try {
    const token = localStorage.getItem('token');
    studentId = jwt_decode(token)?.nameid;
  } catch (e) {
    studentId = undefined;
  }

  return (
    <nav className={`sidebar ${open ? 'open' : ''}`}>
      <div className="logo">
        <img src={process.env.PUBLIC_URL + '/ppcic.jpg'} alt="Logo PPCIC" />
      </div>
      <NavLink to="/" onClick={onNavigate}>Início</NavLink>
      {(role === 'Professor' || role === 'Administrator') && (
        <NavLink to="/students" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/student.png'} alt="Estudantes" />
          Estudantes
        </NavLink>
      )}
      {role === 'Student' && studentId && (
        <NavLink to={`/students/${studentId}`} onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/student.png'} alt="Perfil" />
          Meu Perfil
        </NavLink>
      )}
      {role === 'Student' && (
        <NavLink to="/extensions" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/calender.png'} alt="Extensões" />
          Pedidos de Extensão
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/professors" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/professor.png'} alt="Professores" />
          Professores
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/researchers" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/researcher.png'} alt="Pesquisadores" />
          Pesquisadores
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/researches" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/research.png'} alt="Dissertações" />
          Dissertações
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/projects" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/lamp.png'} alt="Projetos" />
          Projetos
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
        <NavLink to="/courses" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/lamp.png'} alt="Cursos" />
          Cursos
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
        <NavLink to="/researchLines" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/research.png'} alt="Linhas" />
          Linhas de Pesquisa
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/users" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/professor.png'} alt="Usuários" />
          Usuários
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/extensions" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/calender.png'} alt="Extensões" />
          Extensões
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/entities/csv" onClick={onNavigate}>
          <img src={process.env.PUBLIC_URL + '/csv3.png'} alt="Carregar CSV" />
          Carregar CSV
        </NavLink>
      )}
    </nav>
  );
}

