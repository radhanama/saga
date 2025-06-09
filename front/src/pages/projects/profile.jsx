import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import PageContainer from "../../components/PageContainer";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import { getProjectById } from "../../api/project_service";
import { translateEnumValue, PROJECT_STATUS_ENUM } from "../../enum_helpers";

export default function ProjectProfile(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState();
    const [role, setRole] = useState();
    const [error, setError] = useState(false);
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
        getProjectById(id)
            .then(res => { setProject(res); setIsLoading(false); })
            .catch(()=> { setError(true); setIsLoading(false); });
    }, [id]);

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
                        <p data-label="Professores">{project.professors?.map(p => `${p.firstName} ${p.lastName}`).join(', ')}</p>
                        <p data-label="Estudantes">{project.students?.length}</p>
                    </div>
                </div>
            )}
            {error && <ErrorPage />}
        </PageContainer>
    );
}
