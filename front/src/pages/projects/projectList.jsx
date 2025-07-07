import { useEffect, useState } from "react";
import '../../styles/projectList.scss';
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { getProjects, deleteProject } from "../../api/project_service";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import { translateEnumValue } from "../../enum_helpers";
import { PROJECT_STATUS_ENUM } from "../../enum_helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

export default function ProjectList() {
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [projects, setProjects] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const detailsCallback = (id)=>
    {
        navigate(id)
    }

    const handleDelete = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        deleteProject(id).then(() => setProjects(projects.filter(p => p.Id !== id)));
    };

    const handleEdit = (id) => {
        navigate(`${id}/edit`);
    };
    useEffect(() => {
        const roles = ['Administrator', 'Student', 'Professor']
        const token = localStorage.getItem('token')
        try {
            const decoded = jwt_decode(token)
            if (!roles.includes(decoded.role)) {
                navigate('/')
            }
            setRole(decoded.role)
        } catch (error) {
            navigate('/login')
        }
    }, [setRole, navigate, role]);

    useEffect(() => {
        getProjects()
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    mapped = result.map((project) => {
                        return {
                            Id: project.id,
                            Nome: project.name,
                            Status: translateEnumValue(PROJECT_STATUS_ENUM, project.status),
                            Professores: project?.professors?.length,
                            Students: project?.students?.length
                        }
                    })
                }
                setProjects(mapped)
            })
            .catch(() => { })
            .finally(() => setIsLoading(false))
    }, [])


    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="projectBar">
                <div className="left-bar">
                    <div>
                        <FontAwesomeIcon icon={faLightbulb} />
                    </div>
                    <div className="title">Projetos</div>
                </div>
                <div className="right-bar">
                    {role === 'Administrator' && <div className="create-button">
                        <button onClick={() => navigate('/projects/add')}>Novo Projeto</button>
                    </div>}
                </div>
            </div>
            <BackButton />
            <Table
                data={projects}
                page={currentPage}
                itemsPerPage={itemsPerPage}
                useOptions={role === 'Administrator'}
                deleteCallback={handleDelete}
                editCallback={handleEdit}
                detailsCallback={detailsCallback}
            />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(projects.length/itemsPerPage)} onPageChange={setCurrentPage} />
        </PageContainer>
    )
}
