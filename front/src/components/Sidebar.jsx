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
  faFileCsv,
  faTimes
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
    <>
      {/* Overlay para fechar a sidebar quando clicar fora */}
      <div 
        className={`sidebar-overlay ${open ? 'active' : ''}`}
        onClick={onNavigate}
      />
      
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        {/* Botão de fechar no mobile */}
        <div className="sidebar-header">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/ppcic.jpg`} alt="Logo PPCIC" />
          </div>
          <button className="close-button" onClick={onNavigate}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="sidebar-nav">
          <NavLink to="/" onClick={onNavigate}>
            <FontAwesomeIcon icon={faHome} />
            <span className="nav-text">Início</span>
          </NavLink>
          
          {(role === 'Professor' || role === 'Administrator') && (
            <NavLink to="/students" onClick={onNavigate}>
              <FontAwesomeIcon icon={faUserGraduate} />
              <span className="nav-text">Estudantes</span>
            </NavLink>
          )}
          
          {role === 'Student' && studentId && (
            <NavLink to={`/students/${studentId}`} onClick={onNavigate}>
              <FontAwesomeIcon icon={faUser} />
              <span className="nav-text">Meu Perfil</span>
            </NavLink>
          )}
          
          {role === 'Student' && (
            <NavLink to="/extensions" onClick={onNavigate}>
              <FontAwesomeIcon icon={faClock} />
              <span className="nav-text">Pedidos de Extensão</span>
            </NavLink>
          )}
          
          {role === 'Administrator' && (
            <NavLink to="/professors" onClick={onNavigate}>
              <FontAwesomeIcon icon={faChalkboardTeacher} />
              <span className="nav-text">Professores</span>
            </NavLink>
          )}
          
          {role === 'Administrator' && (
            <NavLink to="/researchers" onClick={onNavigate}>
              <FontAwesomeIcon icon={faFlask} />
              <span className="nav-text">Pesquisadores</span>
            </NavLink>
          )}
          
          {(role === 'Administrator' || role === 'Professor') && (
            <NavLink to="/researches" onClick={onNavigate}>
              <FontAwesomeIcon icon={faBookOpen} />
              <span className="nav-text">Dissertações</span>
            </NavLink>
          )}
          
          {(role === 'Administrator' || role === 'Professor') && (
            <NavLink to="/projects" onClick={onNavigate}>
              <FontAwesomeIcon icon={faLightbulb} />
              <span className="nav-text">Projetos</span>
            </NavLink>
          )}
          
          {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
            <NavLink to="/courses" onClick={onNavigate}>
              <FontAwesomeIcon icon={faBook} />
              <span className="nav-text">Cursos</span>
            </NavLink>
          )}
          
          {(role === 'Administrator' || role === 'Professor' || role === 'Student') && (
            <NavLink to="/researchLines" onClick={onNavigate}>
              <FontAwesomeIcon icon={faSitemap} />
              <span className="nav-text">Linhas de Pesquisa</span>
            </NavLink>
          )}
          
          {role === 'Administrator' && (
            <NavLink to="/users" onClick={onNavigate}>
              <FontAwesomeIcon icon={faUsers} />
              <span className="nav-text">Usuários</span>
            </NavLink>
          )}
          
          {role === 'Administrator' && (
            <NavLink to="/extensions" onClick={onNavigate}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span className="nav-text">Extensões</span>
            </NavLink>
          )}
          
          {role === 'Administrator' && (
            <NavLink to="/entities/csv" onClick={onNavigate}>
              <FontAwesomeIcon icon={faFileCsv} />
              <span className="nav-text">Carregar CSV</span>
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
}

