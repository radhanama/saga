import { useEffect, useState } from "react"
import '../../styles/professorList.scss';
import Table from "../../components/Table/table"
import { getProfessors } from "../../api/professor_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";


export default function ProfessorList() {
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [professors, setProfessors] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [disableNext, setDisableNext] = useState(false)

    const detailsCallback = (id)=>
    {
        navigate(id)
    }

    useEffect(() => {
        const roles = ['Administrator']
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
        setIsLoading(true);
        getProfessors(page, 10, search)
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    console.log(result)
                    mapped = result.map((professor) => {
                        return {
                            Id: professor.id,
                            Nome: `${professor.firstName} ${professor.lastName}`,
                            "E-mail": professor.email,
                            Siape: professor.siape,
                        }
                    })
                }
                setProfessors(mapped)
                setDisableNext(result.length < 10)
                setIsLoading(false)
            })
    }, [page, search])


    return (<PageContainer name={name} isLoading={isLoading}>
        <div className="bar professorBar">
            <div className="left-bar">
                <div>
                    <img src="professor.png" alt="A logo representing professors" height={"100rem"} />
                </div>
                <div className="title">Professores</div>
            </div>
            <div className="right-bar">
                <div className="search">
                    <input type="search" name="search" id="search" value={search} onChange={(e)=>{setPage(1);setSearch(e.target.value)}} />
                    <i className="fas fa-"/>
                </div>
                <div className="create-button">
                    <button onClick={()=> navigate('/professors/add')}>Novo Professor</button>
                </div>
            </div>
        </div>
        <BackButton />
        {!isLoading && <Table data={professors} useOptions={true} page={page} setPage={setPage} disableNext={disableNext} detailsCallback={detailsCallback} />}
    </PageContainer>
)
}