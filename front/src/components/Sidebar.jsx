import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import jwt_decode from 'jwt-decode';
import '../styles/sidebar.scss';

export default function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setRole(decoded.role);
        setStudentId(decoded.nameid);
      } catch (e) {
        // ignore decoding errors
      }
    }
  }, []);

  return (
    <nav className="sidebar">
      <div className="logo" onClick={() => navigate('/')}>SAGA</div>
      <ul>
        {(role === 'Professor' || role === 'Administrator') && (
          <li onClick={() => navigate('/students')}>Estudantes</li>
        )}
        {role === 'Student' && (
          <li onClick={() => navigate(`/students/${studentId}`)}>Meu Perfil</li>
        )}
        {role === 'Student' && (
          <li onClick={() => navigate('/extensions')}>Pedidos de Extensão</li>
        )}
        {role === 'Administrator' && (
          <li onClick={() => navigate('/professors')}>Professores</li>
        )}
        {role === 'Administrator' && (
          <li onClick={() => navigate('/researchers')}>Pesquisadores</li>
        )}
        {(role === 'Administrator' || role === 'Professor') && (
          <li onClick={() => navigate('/researches')}>Dissertações</li>
        )}
        {(role === 'Administrator' || role === 'Professor') && (
          <li onClick={() => navigate('/projects')}>Projetos</li>
        )}
        {role === 'Administrator' && (
          <li onClick={() => navigate('/extensions')}>Extensões</li>
        )}
        {role === 'Administrator' && (
          <li onClick={() => navigate('/entities/csv')}>Carregar CSV</li>
        )}
      </ul>
    </nav>
  );
}
