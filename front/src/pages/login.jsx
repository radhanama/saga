import React, { useState } from 'react';
import '../styles/login.scss';
import { useNavigate } from 'react-router-dom';
import { Login as login, ForgotPassword as forgotPassword } from '../api/user_service';
import jwt_decode from 'jwt-decode';
import InlineError from '../components/error/InlineError';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const resetPasswordPath = 'https://spica.eic.cefet-rj.br/saga/changePassword';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(undefined);
  const [errorModal, setErrorModal] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);
    login({ email, password })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', jwt_decode(response.data.token)?.role);
          localStorage.setItem(
            'name',
            `${response.data?.user?.firstName} ${response.data?.user?.lastName}`
          );
          if (response.data?.user) {
            navigate('/');
          } else {
            setError('login failed');
          }
        } else {
          setError('login failed');
        }
      })
      .catch((err) => {
        const message = err?.message || 'login failed';
        setError(message);
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setErrorModal(undefined);
  };

  const openAbout = () => setIsAboutOpen(true);
  const openContact = () => setIsContactOpen(true);
  const closeAbout = () => setIsAboutOpen(false);
  const closeContact = () => setIsContactOpen(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    forgotPassword({ email: modalEmail, resetPasswordPath })
      .then((response) => {
        if (response.status === 200) {
          setIsModalOpen(false);
        } else {
          setErrorModal('Email Invalido');
        }
      })
      .catch((err) => {
        setErrorModal(err?.message || 'Email Invalido');
      });
  };

  return (
    <>
      <main className="login">
        <div className={'body'}>
          <div className={'header'}>
            <div className="left">
              <div className="app-name">SAGA</div>
            </div>
            <div className={'headerOptions'}>
              <div style={{ marginRight: '2rem', cursor: 'pointer' }} onClick={openAbout}>Sobre</div>
              <div style={{ cursor: 'pointer' }} onClick={openContact}>Contato</div>
            </div>
          </div>
          <div className={'intro'}>
            <h2>Bem-vindo ao SAGA</h2>
            <p>
              Sistema de Acompanhamento e Gestão Acadêmica do PPCIC para
              organização de informações de alunos, pesquisas e atividades.
            </p>
          </div>
          <div className={'form'}>
            <p>Entrar na conta</p>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" id="submit" value={'Login'} onClick={handleSubmit} />
            <InlineError message={error} />
            <button id="forgotPassword" onClick={handleForgotPassword}>
              Esqueceu a senha?
            </button>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <main className="modal">
          <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleCloseModal}>
                &times;
                </span>
              {(isSubmitted && !errorModal) ? (
                <>
                  <p>Email de redefinição de senha enviado</p>
                  <p>
                    Verifique sua caixa de entrada ou pasta de spam para encontrar o email de redefinição de senha.
                  </p>
                </>
              ) : (
                <>
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    type="text"
                    id="resetEmail"
                    placeholder="Digite seu email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                  />
                  <input type="submit" id="resetSubmit" value={'Resetar Senha'} onClick={handleResetPassword} />
                  <InlineError message={errorModal} />
                </>
              )}
            </div>
          </div>
        </main>
      )}

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
