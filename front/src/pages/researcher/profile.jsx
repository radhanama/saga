import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import "../../styles/profile.scss";
import PageContainer from "../../components/PageContainer";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import jwt_decode from "jwt-decode";
import { getResearcherById } from "../../api/researcher_service";

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

    return (
        <PageContainer name={name} isLoading={isLoading}>
            {!error && researcher && (
                <div style={{display:'flex', flexDirection:'column', flexWrap:'wrap'}}>
                    <div className="bar">
                        <BackButton />
                        {role === 'Administrator' && (
                            <div className="options">
                                <input type='button' className='option' value='Editar Pesquisador' onClick={()=>navigate('edit')} />
                            </div>
                        )}
                    </div>
                    <div className="card-label">Perfil pesquisador</div>
                    <div className="studentCard">
                        <p data-label="Nome">{`${researcher.firstName} ${researcher.lastName}`}</p>
                        <p data-label="Email">{researcher.email}</p>
                        <p data-label="CPF">{researcher.cpf}</p>
                        <p data-label="Instituição">{researcher.institution}</p>
                    </div>
                </div>
            )}
            {error && <ErrorPage />}
        </PageContainer>
    );
}
