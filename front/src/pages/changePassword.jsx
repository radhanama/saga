import React, { useState, useEffect } from 'react';
import '../styles/login.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResetPassword as resetPassword } from '../api/user_service';
import InlineError from '../components/error/InlineError';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(undefined);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const token = new URLSearchParams(location.search).get('token');

  const openAbout = () => setIsAboutOpen(true);
  const openContact = () => setIsContactOpen(true);
  const closeAbout = () => setIsAboutOpen(false);
  const closeContact = () => setIsContactOpen(false);

  useEffect(() => {
    // Redirect to login if token is not provided in the URL
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setError('Password must be at least 8 characters long and contain letters and numbers.');
      return;
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    resetPassword({ token, password })
      .then((response) => {
        if (response.status === 200) {
          navigate('/login');
        } else {
          setError('Failed to reset password');
        }
      })
      .catch((error) => {
        setError(error?.message || 'Failed to reset password');
      });
  };

  return (
    <>
      <main className="login">
        <div className={'body'}>
          <div className={'header'}>
            <div className="app-name">SAGA</div>
            <div className={'headerOptions'}>
              <div style={{ marginRight: '2rem', cursor: 'pointer' }} onClick={openAbout}>Sobre</div>
              <div style={{ cursor: 'pointer' }} onClick={openContact}>Contato</div>
            </div>
          </div>
          <div className={'form'}>
            <p>Redefinir senha</p>
            <label htmlFor="password">Nova Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
              required
            />
            <label htmlFor="repeat-password">Repetir Senha</label>
            <input
              type="password"
              id="repeat-password"
              placeholder="Digite novamente sua nova senha"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
            <input type="submit" id="submit" value={'Resetar Senha'} onClick={handleSubmit} />
            <InlineError message={error} />
          </div>
        </div>
      </main>

      {isAboutOpen && (
        <main className="modal">
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeAbout}>&times;</span>
              <p>Sistema de Acompanhamento e Gestão Acadêmica.</p>
            </div>
          </div>
        </main>
      )}

      {isContactOpen && (
        <main className="modal">
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeContact}>&times;</span>
              <p>Para mais informações envie e-mail para ppcic_saga@cefet-rj.br.</p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
