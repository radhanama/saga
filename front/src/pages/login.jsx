import React, { useState } from 'react';
import '../styles/login.scss';
import { useNavigate } from 'react-router-dom';
import { Login as login, ForgotPassword as forgotPassword } from '../api/user_service';
import jwt_decode from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const resetPasswordPath = 'https://spica.eic.cefet-rj.br/saga/changePassword';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(undefined);
  const [errorReset, setErrorReset] = useState(undefined);
  const [showReset, setShowReset] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      .catch(() => {
        setError('login failed');
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setShowReset(true);
  };

  const handleCloseReset = () => {
    setShowReset(false);
    setIsSubmitted(false);
    setErrorReset(undefined);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    forgotPassword({ email: resetEmail, resetPasswordPath })
      .then((response) => {
        if (response.status === 200) {
          setShowReset(false);
        } else {
          setErrorReset('Email Invalido');
        }
      })
      .catch(() => {
        setErrorReset('Email Invalido');
      });
  };

  return (
    <>
      <main className="login">
        <div className={'body'}>
          <div className={'header'}>
            <div className="app-name">SAGA</div>
            <div className={'headerOptions'}>
              <div style={{ marginRight: '2rem' }}>Sobre</div>
              <div>Contato</div>
            </div>
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
            {error && <p> {error} </p>}
            <button id="forgotPassword" onClick={handleForgotPassword}>
              Esqueceu a senha?
            </button>
          </div>
        </div>
      </main>

      {showReset && (
        <div className="reset-password-form">
          <span className="close" onClick={handleCloseReset}>&times;</span>
          {isSubmitted && !errorReset ? (
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
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <input type="submit" id="resetSubmit" value={'Resetar Senha'} onClick={handleResetPassword} />
              {errorReset && <p>{errorReset}</p>}
            </>
          )}
        </div>
      )}
    </>
  );
}
