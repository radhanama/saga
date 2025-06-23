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
      <NavLink to="/" onClick={onNavigate}>Início</NavLink>
      {(role === 'Professor' || role === 'Administrator') && (
        <NavLink to="/students" onClick={onNavigate}>Estudantes</NavLink>
      )}
      {role === 'Student' && studentId && (
        <NavLink to={`/students/${studentId}`} onClick={onNavigate}>Meu Perfil</NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/professors" onClick={onNavigate}>Professores</NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/researchers" onClick={onNavigate}>Pesquisadores</NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/researches" onClick={onNavigate}>Dissertações</NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/projects" onClick={onNavigate}>Projetos</NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/extensions" onClick={onNavigate}>Extensões</NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/entities/csv" onClick={onNavigate}>Carregar CSV</NavLink>
      )}
    </nav>
  );
}

