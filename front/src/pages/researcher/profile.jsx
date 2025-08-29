import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import PageContainer from "../../components/PageContainer";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import { getResearcherById } from "../../api/researcher_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUniversity, faIdCard } from "@fortawesome/free-solid-svg-icons";

export default function ResearcherProfile(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [researcher, setResearcher] = useState();
    const [error, setError] = useState(false);
    const [role, setRole] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [name] = useState(localStorage.getItem('name'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            const decoded = jwt_decode(token);
            setRole(decoded.role);
        } catch(err){
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        getResearcherById(id)
            .then(res => { setResearcher(res); setIsLoading(false); })
            .catch(()=> { setError(true); setIsLoading(false); });
    }, [id]);

    if (error) return <PageContainer name={name} isLoading={false}><ErrorPage /></PageContainer>;

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="details-page researcher-profile">
                <BackButton />
                
                {/* Header com informações principais */}
                <div className="details-header">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="title">
                                {researcher && `${researcher.firstName} ${researcher.lastName}`}
                            </h1>
                            <p className="subtitle">
                                {researcher?.institution && `Instituição: ${researcher.institution}`}
                                {researcher?.email && ` • ${researcher.email}`}
                            </p>
                        </div>
                        
                        {role === 'Administrator' && (
                            <div className="header-actions">
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => navigate('edit')}
                                >
                                    Editar Pesquisador
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
                                        <span className="value">{researcher ? `${researcher.firstName} ${researcher.lastName}` : 'Carregando...'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value">{researcher?.email || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">CPF</span>
                                        <span className="value">{researcher?.cpf || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações Institucionais */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faUniversity} className="icon" />
                                    Informações Institucionais
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Instituição</span>
                                        <span className="value highlight">{researcher?.institution || 'Não informado'}</span>
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
