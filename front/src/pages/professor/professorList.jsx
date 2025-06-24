import { useEffect, useState } from "react"
import '../../styles/professorList.scss';
import Table from "../../components/Table/table"
import Pagination from "../../components/Pagination/Pagination"
import { getProfessors, exportProfessorsCsv } from "../../api/professor_service"
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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

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
        getProfessors()
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
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
                setIsLoading(false)
            })
    }, [setProfessors, setIsLoading])

    const handleExport = () => {
        setIsLoading(true)
        exportProfessorsCsv()
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob], {type: 'text/csv'}))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'professors.csv')
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
            .finally(() => setIsLoading(false))
    }


    return (<PageContainer name={name} isLoading={isLoading}>
        <div className="bar professorBar">
            <div className="left-bar">
                <div>
                    <img src="professor.png" alt="A logo representing professors" height={"100rem"} />
                </div>
                <div className="title">Professores</div>
            </div>
            <div className="right-bar">
                <div className="create-button">
                    <button onClick={()=> navigate('/professors/add')}>Novo Professor</button>
                </div>
                <div className="create-button">
                    <button onClick={handleExport}>Exportar CSV</button>
                </div>
            </div>
        </div>
        <BackButton />
        {!isLoading && <Table data={professors} page={currentPage} itemsPerPage={itemsPerPage} useOptions={true} detailsCallback={detailsCallback} />}
        <Pagination currentPage={currentPage} totalPages={Math.ceil(professors.length/itemsPerPage)} onPageChange={setCurrentPage} />
    </PageContainer>
)
}