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

const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");


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

    return (
        <PageContainer name={name} isLoading={isLoading}>
            {!error && <div style={
                { display: "flex", flexDirection: "column", flexWrap: 'wrap' }
            }>
                <div className="bar">
                    <BackButton />
                    {role === "Administrator" && <div className="options">
                        <input type={'button'} className="option" value={"Criar Dissertação"} onClick={(e) => navigate(`researches/add`)} />
                        <input type={'button'} className="option" value={'Prorrogação'} onClick={(e) => navigate('extensions/add')} />
                        <input type={'button'} className="option" value={'Editar Estudante'} onClick={(e) => navigate('edit')} />
                    </div>}
                </div>
                {!isLoading && (
                    <>
                        <div className="card-label">Perfil estudante</div>
                        <div className="studentCard">
                            <p data-label="Nome">{`${student.firstName} ${student.lastName}`}</p>
                            <p data-label="Email">{student.email}</p>
                            <p data-label="CPF">{student.cpf}</p>
                            <p data-label="Status">{translateEnumValue(STATUS_ENUM, student.status)}</p>
                            <p data-label="Matrícula">{student.registration}</p>
                            <p data-label="Data de Matrícula">{formatDate(student.registrationDate)}</p>
                            <p data-label="Data de Ingresso">{formatDate(student.entryDate)}</p>
                            <p data-label="Data de Nascimento">{formatDate(student.dateOfBirth)}</p>
                            <p data-label="Instituição de Graduação">{student.undergraduateInstitution}</p>
                            <p data-label="Tipo de Instituição">{translateEnumValue(INSTITUTION_TYPE_ENUM, student.institutionType)}</p>
                            <p data-label="Curso">{student.undergraduateCourse}</p>
                            <p data-label="Área">{translateEnumValue(AREA_ENUM, student.undergraduateArea)}</p>
                            <p data-label="Ano de Formação">{student.graduationYear}</p>
                            <p data-label="Proficiência em Inglês">{student.proficiency ? 'Sim' : 'Não'}</p>
                            <p data-label="Bolsa">{translateEnumValue(SCHOLARSHIP_TYPE, student.scholarship)}</p>
                            <p data-label="Projeto de Pesquisa">{student.project?.name}</p>
                            <p data-label="Data de Qualificação">{formatDate(student.projectQualificationDate)}</p>
                            <p data-label="Data de Defesa">{formatDate(student.projectDefenceDate)}</p>
                            {orientation && (
                                <>
                                    <p data-label="Dissertação">{orientation.dissertation}</p>
                                    <p data-label="Orientador">{`${orientation.professor?.firstName} ${orientation.professor?.lastName}`}</p>
                                    {orientation.coorientator && (
                                        <p data-label="Coorientador">{`${orientation.coorientator?.firstName} ${orientation.coorientator?.lastName}`}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
            }
            {error && <ErrorPage />}

        </PageContainer>
    );
}
