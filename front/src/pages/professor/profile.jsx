import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import { useNavigate } from "react-router";
import { getProfessorById } from "../../api/professor_service";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChalkboardTeacher, faIdCard } from "@fortawesome/free-solid-svg-icons";

export default function ProfessorProfile(){
    const { id } = useParams()
    const [professor, setProfessor] = useState(undefined)
    const [error, setError] = useState(false)
    const [role, setRole] = useState()
    
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        try {
            const decoded = jwt_decode(token)
            setRole(decoded.role)
        } catch (error) {
            navigate('/login', { replace: true })
        }
    }, [navigate]);

    useEffect(() => {
        getProfessorById(id)
            .then(professor => {
                setProfessor(professor);
            })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (error) return <PageContainer name={name} isLoading={false}><ErrorPage /></PageContainer>;

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="details-page professor-profile">
                <BackButton />
                
                {/* Header com informações principais */}
                <div className="details-header">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="title">
                                {professor && `${professor.firstName} ${professor.lastName}`}
                            </h1>
                            <p className="subtitle">
                                {professor?.siape && `SIAPE: ${professor.siape}`}
                                {professor?.email && ` • ${professor.email}`}
                            </p>
                        </div>
                        
                        {role === 'Administrator' && (
                            <div className="header-actions">
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => navigate('edit')}
                                >
                                    Editar Professor
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="details-content">
                    <div className="content-container">
                        
                        {/* Informações Pessoais */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faUser} className="icon" />
                                    Informações Pessoais
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Nome Completo</span>
                                        <span className="value">{professor ? `${professor.firstName} ${professor.lastName}` : 'Carregando...'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value">{professor?.email || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">CPF</span>
                                        <span className="value">{professor?.cpf || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações Profissionais */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="icon" />
                                    Informações Profissionais
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">SIAPE</span>
                                        <span className="value highlight">{professor?.siape || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
