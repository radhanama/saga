import React, { useState } from 'react';
import '../styles/login.scss';
import { useNavigate } from 'react-router-dom';
import { Login as login, ForgotPassword as forgotPassword } from '../api/user_service';
import jwt_decode from 'jwt-decode';
import InlineError from '../components/error/InlineError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const resetPasswordPath = 'https://spica.eic.cefet-rj.br/saga/changePassword';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined);
  const [errorModal, setErrorModal] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);
    setIsLoading(true);
    
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
            setError('Falha no login');
          }
        } else {
          setError('Falha no login');
        }
      })
      .catch((err) => {
        const message = err?.message || 'Falha no login';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
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
    setModalEmail('');
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
          setErrorModal('Email Inválido');
        }
      })
      .catch((err) => {
        setErrorModal(err?.message || 'Email Inválido');
      });
  };

  return (
    <>
      <div className="login-container">
        {/* Header */}
        <header className="login-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon"></div>
              <span className="app-name">SAGA</span>
            </div>
            <nav className="header-nav">
              <button className="nav-link" onClick={openAbout}>Sobre</button>
              <button className="nav-link" onClick={openContact}>Contato</button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="login-main">
          <div className="login-content">
            {/* Welcome Section */}
            <div className="welcome-section">
              <div className="welcome-content">
                <h1 className="welcome-title">Bem-vindo ao SAGA</h1>
                <p className="welcome-description">
                  Sistema de Acompanhamento e Gestão Acadêmica do PPCIC para
                  organização de informações de alunos, pesquisas e atividades.
                </p>
                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <span>Gestão de Projetos</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">👥</div>
                    <span>Acompanhamento de Alunos</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📚</div>
                    <span>Organização Acadêmica</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="form-section">
              <div className="form-container">
                <div className="form-header">
                  <h2>Entrar na sua conta</h2>
                  <p>Acesse o sistema com suas credenciais</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faLock} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>

                  {error && <InlineError message={error} />}

                  <button 
                    type="submit" 
                    className={`login-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </button>

                  <button 
                    type="button" 
                    className="forgot-password-btn" 
                    onClick={handleForgotPassword}
                  >
                    Esqueceu a senha?
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Reset de Senha */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Recuperar Senha</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {(isSubmitted && !errorModal) ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h4>E-mail enviado com sucesso!</h4>
                  <p>Verifique sua caixa de entrada ou pasta de spam para encontrar o e-mail de redefinição de senha.</p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label htmlFor="resetEmail">E-mail</label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        id="resetEmail"
                        placeholder="Digite seu e-mail"
                        value={modalEmail}
                        onChange={(e) => setModalEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {errorModal && <InlineError message={errorModal} />}
                  
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      Enviar E-mail
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Sobre */}
      {isAboutOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Sobre o SAGA</h3>
              <button className="modal-close" onClick={closeAbout}>×</button>
            </div>
            <div className="modal-content">
              <p>Sistema de Acompanhamento e Gestão Acadêmica desenvolvido para o PPCIC - Programa de Pós-Graduação em Computação e Informática do CEFET/RJ.</p>
              <p>O SAGA facilita a organização e gestão de informações acadêmicas, projetos de pesquisa e atividades dos alunos e professores.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contato */}
      {isContactOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Contato</h3>
              <button className="modal-close" onClick={closeContact}>×</button>
            </div>
            <div className="modal-content">
              <p>Para mais informações, suporte ou dúvidas sobre o sistema:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>E-mail:</strong> ppcic_saga@cefet-rj.br
                </div>
                <div className="contact-item">
                  <strong>Programa:</strong> PPCIC - CEFET/RJ
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
