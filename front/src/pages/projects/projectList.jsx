import { useEffect, useState } from "react"
import '../../styles/projectList.scss';
import Table from "../../components/Table/table"
import { getProjects } from "../../api/project_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import { translateEnumValue } from "../../enum_helpers";
import { PROJECT_STATUS_ENUM } from "../../enum_helpers";

export default function ProjectList() {
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [projects, setProjects] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [disableNext, setDisableNext] = useState(false)

    const detailsCallback = (id)=>
    {
        navigate(id)
    }
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
        getProjects(page, 10, search)
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
                setDisableNext(result.length < 10)
                setIsLoading(false)

            })
    }, [page, search])


    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="projectBar">
                <div className="left-bar">
                    <div>
                        <img src="lamp.png" alt="A logo representing Projects" height={"100rem"} />
                    </div>
                    <div className="title">Projetos</div>
                </div>
                <div className="right-bar">
                    <div className="search">
                        <input type="search" name="search" id="search" value={search} onChange={(e)=>{setPage(1);setSearch(e.target.value)}} />
                        <i className="fas fa-" />
                    </div>
                    {role === 'Administrator' && <div className="create-button">
                        <button onClick={() => navigate('/projects/add')}>Novo Projeto</button>
                    </div>}
                </div>
            </div>
            <BackButton />
            <Table data={projects} useOptions={role === 'Administrator'} page={page} setPage={setPage} disableNext={disableNext} detailsCallback={detailsCallback} />
        </PageContainer>
    )
}
