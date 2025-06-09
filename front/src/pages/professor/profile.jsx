import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import PageContainer from "../../components/PageContainer";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import { getProfessorById } from "../../api/professor_service";

export default function ProfessorProfile(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [professor, setProfessor] = useState();
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
        getProfessorById(id)
            .then(result => { setProfessor(result); setIsLoading(false); })
            .catch(() => { setError(true); setIsLoading(false); });
    }, [id]);

    return (
        <PageContainer name={name} isLoading={isLoading}>
            {!error && professor && (
                <div style={{display:'flex', flexDirection:'column', flexWrap:'wrap'}}>
                    <div className="bar">
                        <BackButton />
                        {role === 'Administrator' && (
                            <div className="options">
                                <input type={'button'} className="option" value={'Editar Professor'} onClick={()=>navigate('edit')} />
                            </div>
                        )}
                    </div>
                    <div className="card-label">Perfil professor</div>
                    <div className="studentCard">
                        <p data-label="Nome">{`${professor.firstName} ${professor.lastName}`}</p>
                        <p data-label="Email">{professor.email}</p>
                        <p data-label="CPF">{professor.cpf}</p>
                        <p data-label="SIAPE">{professor.siape}</p>
                    </div>
                </div>
            )}
            {error && <ErrorPage />}
        </PageContainer>
    );
}
