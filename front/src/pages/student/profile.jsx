import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import { useNavigate } from "react-router";
import { getStudentById } from "../../api/student_service";
import { getResearch } from "../../api/research_service";
import { translateEnumValue, AREA_ENUM, INSTITUTION_TYPE_ENUM, STATUS_ENUM, SCHOLARSHIP_TYPE } from "../../enum_helpers";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGraduationCap, faCalendar, faBook, faFileAlt, faPlus } from "@fortawesome/free-solid-svg-icons";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : "Não informado");

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Ativo': return 'active';
        case 'Inativo': return 'inactive';
        case 'Formado': return 'graduated';
        default: return 'active';
    }
};

const getDateStatus = (date) => {
    if (!date) return '';
    const now = new Date();
    const targetDate = new Date(date);
    const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 30) return 'upcoming';
    return 'completed';
};

export default function StudentProfile() {
    const { id } = useParams()
    const [student, setStudent] = useState(undefined)
    const [orientation, setOrientation] = useState(undefined)
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
        getStudentById(id)
            .then(student => {
                setStudent(student);
            })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
        getResearch()
            .then(list => {
                const orient = list?.find(o => o.student?.id === id);
                setOrientation(orient);
            })
            .catch(() => { });
    }, [id]);

    if (error) return <PageContainer name={name} isLoading={false}><ErrorPage /></PageContainer>;

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="details-page student-profile">
                <BackButton />
                
                {/* Header com informações principais */}
                <div className="details-header">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="title">
                                {student && `${student.firstName} ${student.lastName}`}
                                {student && (
                                    <span className={`status-badge ${getStatusBadgeClass(translateEnumValue(STATUS_ENUM, student.status))}`}>
                                        {translateEnumValue(STATUS_ENUM, student.status)}
                                    </span>
                                )}
                            </h1>
                            <p className="subtitle">
                                {student?.registration && `Matrícula: ${student.registration}`}
                                {student?.email && ` • ${student.email}`}
                            </p>
                        </div>
                        
                        {role === "Administrator" && (
                            <div className="header-actions">
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => navigate('edit')}
                                >
                                    Editar Estudante
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
                                        <span className="value">{student ? `${student.firstName} ${student.lastName}` : 'Carregando...'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">CPF</span>
                                        <span className="value">{student?.cpf || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Data de Nascimento</span>
                                        <span className="value">{formatDate(student?.dateOfBirth)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value">{student?.email || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações Acadêmicas */}
                        <div className="info-section academic-info">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faGraduationCap} className="icon" />
                                    Informações Acadêmicas
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Data de Matrícula</span>
                                        <span className="value">{formatDate(student?.registrationDate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Data de Ingresso</span>
                                        <span className="value">{formatDate(student?.entryDate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Instituição de Graduação</span>
                                        <span className="value">{student?.undergraduateInstitution || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Tipo de Instituição</span>
                                        <span className="value">{student ? translateEnumValue(INSTITUTION_TYPE_ENUM, student.institutionType) : 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Curso de Graduação</span>
                                        <span className="value">{student?.undergraduateCourse || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Área</span>
                                        <span className="value">{student ? translateEnumValue(AREA_ENUM, student.undergraduateArea) : 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Ano de Formação</span>
                                        <span className="value">{student?.graduationYear || 'Não informado'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Proficiência em Inglês</span>
                                        <span className="value">{student?.proficiency ? 'Sim' : 'Não'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Bolsa</span>
                                        <span className="value">{student ? translateEnumValue(SCHOLARSHIP_TYPE, student.scholarship) : 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Projeto e Prazos */}
                        <div className="info-section dates-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faCalendar} className="icon" />
                                    Projeto e Prazos
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Projeto de Pesquisa</span>
                                        <span className="value highlight">{student?.project?.name || 'Não associado'}</span>
                                    </div>
                                    <div className={`info-item ${getDateStatus(student?.projectQualificationDate)}`}>
                                        <span className="label">Data de Qualificação</span>
                                        <span className="value">{formatDate(student?.projectQualificationDate)}</span>
                                    </div>
                                    <div className={`info-item ${getDateStatus(student?.projectDefenceDate)}`}>
                                        <span className="label">Data de Defesa</span>
                                        <span className="value">{formatDate(student?.projectDefenceDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orientação */}
                        {orientation && (
                            <div className="info-section">
                                <div className="section-header">
                                    <h2 className="section-title">
                                        <FontAwesomeIcon icon={faBook} className="icon" />
                                        Orientação
                                    </h2>
                                </div>
                                <div className="section-content">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="label">Dissertação</span>
                                            <span className="value highlight">{orientation.dissertation}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Orientador</span>
                                            <span className="value">{`${orientation.professor?.firstName} ${orientation.professor?.lastName}`}</span>
                                        </div>
                                        {orientation.coorientator && (
                                            <div className="info-item">
                                                <span className="label">Coorientador</span>
                                                <span className="value">{`${orientation.coorientator?.firstName} ${orientation.coorientator?.lastName}`}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ações Rápidas (apenas para administradores) */}
                        {role === "Administrator" && (
                            <div className="quick-actions">
                                <h3 className="actions-title">Ações Rápidas</h3>
                                <div className="actions-grid">
                                    <div className="action-card" onClick={() => navigate('researches/add')}>
                                        <FontAwesomeIcon icon={faFileAlt} className="action-icon" />
                                        <h4 className="action-title">Criar Dissertação</h4>
                                        <p className="action-desc">Registrar nova dissertação para o estudante</p>
                                    </div>
                                    <div className="action-card" onClick={() => navigate('extensions/add')}>
                                        <FontAwesomeIcon icon={faCalendar} className="action-icon" />
                                        <h4 className="action-title">Prorrogação</h4>
                                        <p className="action-desc">Solicitar extensão de prazo</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
