import React from 'react';
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserGraduate,
  faUser,
  faClock,
  faChalkboardTeacher,
  faFlask,
  faBookOpen,
  faLightbulb,
  faBook,
  faSitemap,
  faUsers,
  faCalendarCheck,
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
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
      <NavLink to="/" onClick={onNavigate}>
        <FontAwesomeIcon icon={faHome} />
        Início
      </NavLink>
      {(role === 'Professor' || role === 'Administrator') && (
        <NavLink to="/students" onClick={onNavigate}>
          <FontAwesomeIcon icon={faUserGraduate} />
          Estudantes
        </NavLink>
      )}
      {role === 'Student' && studentId && (
        <NavLink to={`/students/${studentId}`} onClick={onNavigate}>
          <FontAwesomeIcon icon={faUser} />
          Meu Perfil
        </NavLink>
      )}
      {role === 'Student' && (
        <NavLink to="/extensions" onClick={onNavigate}>
          <FontAwesomeIcon icon={faClock} />
          Pedidos de Extensão
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/professors" onClick={onNavigate}>
          <FontAwesomeIcon icon={faChalkboardTeacher} />
          Professores
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/researchers" onClick={onNavigate}>
          <FontAwesomeIcon icon={faFlask} />
          Pesquisadores
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/researches" onClick={onNavigate}>
          <FontAwesomeIcon icon={faBookOpen} />
          Dissertações
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor') && (
        <NavLink to="/projects" onClick={onNavigate}>
          <FontAwesomeIcon icon={faLightbulb} />
          Projetos
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
        <NavLink to="/courses" onClick={onNavigate}>
          <FontAwesomeIcon icon={faBook} />
          Cursos
        </NavLink>
      )}
      {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
        <NavLink to="/researchLines" onClick={onNavigate}>
          <FontAwesomeIcon icon={faSitemap} />
          Linhas de Pesquisa
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/users" onClick={onNavigate}>
          <FontAwesomeIcon icon={faUsers} />
          Usuários
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/extensions" onClick={onNavigate}>
          <FontAwesomeIcon icon={faCalendarCheck} />
          Extensões
        </NavLink>
      )}
      {role === 'Administrator' && (
        <NavLink to="/entities/csv" onClick={onNavigate}>
          <FontAwesomeIcon icon={faFileCsv} />
          Carregar CSV
        </NavLink>
      )}
    </nav>
  );
}

