import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import { useNavigate } from "react-router";
import { getProjectById } from "../../api/project_service";
import { getResearchLines } from "../../api/research_line";
import { translateEnumValue, PROJECT_STATUS_ENUM } from "../../enum_helpers";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faUsers, faGraduationCap, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Ativo': return 'active';
        case 'Inativo': return 'inactive';
        case 'Concluído': return 'graduated';
        default: return 'active';
    }
};

export default function ProjectProfile(){
    const { id } = useParams()
    const [project, setProject] = useState(undefined)
    const [researchLine, setResearchLine] = useState('')
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
        getProjectById(id)
            .then(project => {
                setProject(project);
            })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        if (!project) return;
        getResearchLines()
            .then(lines => {
                const line = lines.find(l => l.id === project.researchLineId);
                setResearchLine(line?.name || '');
            })
            .catch(() => {});
    }, [project]);

    if (error) return <PageContainer name={name} isLoading={false}><ErrorPage /></PageContainer>;

    const professorData = project?.professors?.map((p, idx) => ({
        id: p.id,
        nome: `${p.firstName} ${p.lastName}`,
        email: p.email
    })) || [];

    const studentData = project?.students?.map((s, idx) => ({
        id: s.id,
        nome: `${s.firstName} ${s.lastName}`,
        email: s.email
    })) || [];

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="details-page project-profile">
                <BackButton />
                
                {/* Header com informações principais */}
                <div className="details-header">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="title">
                                {project?.name}
                                {project && (
                                    <span className={`status-badge ${getStatusBadgeClass(translateEnumValue(PROJECT_STATUS_ENUM, project.status))}`}>
                                        {translateEnumValue(PROJECT_STATUS_ENUM, project.status)}
                                    </span>
                                )}
                            </h1>
                            <p className="subtitle">
                                {researchLine && `Linha de Pesquisa: ${researchLine}`}
                            </p>
                        </div>
                        
                        {role === 'Administrator' && (
                            <div className="header-actions">
                                <button 
                                    className="action-btn secondary"
                                    onClick={() => navigate('edit')}
                                >
                                    Editar Projeto
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="details-content">
                    <div className="content-container">
                        
                        {/* Informações do Projeto */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faFolderOpen} className="icon" />
                                    Informações do Projeto
                                </h2>
                            </div>
                            <div className="section-content">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Nome do Projeto</span>
                                        <span className="value highlight">{project?.name || 'Carregando...'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Status</span>
                                        <span className="value">{project ? translateEnumValue(PROJECT_STATUS_ENUM, project.status) : 'Carregando...'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Linha de Pesquisa</span>
                                        <span className="value">{researchLine || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professores Envolvidos */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faUsers} className="icon" />
                                    Professores ({professorData.length})
                                </h2>
                            </div>
                            <div className="section-content">
                                {professorData.length > 0 ? (
                                    <div className="details-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>E-mail</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {professorData.map((professor) => (
                                                    <tr key={professor.id}>
                                                        <td>{professor.nome}</td>
                                                        <td>{professor.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* Mobile cards */}
                                        <div className="mobile-cards">
                                            {professorData.map((professor) => (
                                                <div key={professor.id} className="mobile-card">
                                                    <div className="card-header">{professor.nome}</div>
                                                    <div className="card-info">
                                                        <div className="info-line">
                                                            <span className="label">E-mail:</span>
                                                            <span className="value">{professor.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        Nenhum professor associado a este projeto.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estudantes Envolvidos */}
                        <div className="info-section">
                            <div className="section-header">
                                <h2 className="section-title">
                                    <FontAwesomeIcon icon={faGraduationCap} className="icon" />
                                    Estudantes ({studentData.length})
                                </h2>
                            </div>
                            <div className="section-content">
                                {studentData.length > 0 ? (
                                    <div className="details-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nome</th>
                                                    <th>E-mail</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentData.map((student) => (
                                                    <tr key={student.id}>
                                                        <td>{student.nome}</td>
                                                        <td>{student.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* Mobile cards */}
                                        <div className="mobile-cards">
                                            {studentData.map((student) => (
                                                <div key={student.id} className="mobile-card">
                                                    <div className="card-header">{student.nome}</div>
                                                    <div className="card-info">
                                                        <div className="info-line">
                                                            <span className="label">E-mail:</span>
                                                            <span className="value">{student.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        Nenhum estudante associado a este projeto.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
