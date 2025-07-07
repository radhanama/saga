import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import PageContainer from "../../components/PageContainer";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import { getProjectById } from "../../api/project_service";
import { getResearchLines } from "../../api/research_line";
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";

import { translateEnumValue, PROJECT_STATUS_ENUM } from "../../enum_helpers";

export default function ProjectProfile(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState();
    const [researchLine, setResearchLine] = useState('');
    const [role, setRole] = useState();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [name] = useState(localStorage.getItem('name'));
    const [studentsPage, setStudentsPage] = useState(1);
    const [professorsPage, setProfessorsPage] = useState(1);
    const itemsPerPage = 5;

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
        getProjectById(id)
            .then(res => { setProject(res); setIsLoading(false); })
            .catch(()=> { setError(true); setIsLoading(false); });
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

    const professorData = project?.professors?.map((p, idx) => ({
        Id: idx,
        Nome: `${p.firstName} ${p.lastName}`,
        'E-mail': p.email
    })) || [];

    const studentData = project?.students?.map((s, idx) => ({
        Id: idx,
        Nome: `${s.firstName} ${s.lastName}`,
        'E-mail': s.email
    })) || [];

    return (
        <PageContainer name={name} isLoading={isLoading}>
            {!error && project && (
                <div style={{display:'flex', flexDirection:'column', flexWrap:'wrap'}}>
                    <div className="bar">
                        <BackButton />
                        {role === 'Administrator' && (
                            <div className="options">
                                <input type='button' className='option' value='Editar Projeto' onClick={()=>navigate('edit')} />
                            </div>
                        )}
                    </div>
                    <div className="card-label">Perfil projeto</div>
                    <div className="studentCard">
                        <p data-label="Nome">{project.name}</p>
                        <p data-label="Status">{translateEnumValue(PROJECT_STATUS_ENUM, project.status)}</p>
                        {researchLine && (
                            <p data-label="Linha de Pesquisa">{researchLine}</p>
                        )}
                    </div>
                    <div className="card-label">Professores</div>
                    <Table data={professorData} page={professorsPage} itemsPerPage={itemsPerPage} />
                    <Pagination currentPage={professorsPage} totalPages={Math.ceil(professorData.length/itemsPerPage)} onPageChange={setProfessorsPage} />
                    <div className="card-label">Estudantes</div>
                    <Table data={studentData} page={studentsPage} itemsPerPage={itemsPerPage} />
                    <Pagination currentPage={studentsPage} totalPages={Math.ceil(studentData.length/itemsPerPage)} onPageChange={setStudentsPage} />
                </div>
            )}
            {error && <ErrorPage />}
        </PageContainer>
    );
}
