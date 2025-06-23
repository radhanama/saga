import { useEffect, useState } from "react"
import '../../styles/studentList.scss'
import Table from "../../components/Table/table"
import { getStudents } from "../../api/student_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton"
import PageContainer from "../../components/PageContainer"
import { translateEnumValue } from "../../enum_helpers";
import { STATUS_ENUM } from "../../enum_helpers";

const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export default function StudentList() {
    const navigate = useNavigate()
    const [name, _] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [students, setStudents] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [disableNext, setDisableNext] = useState(false)

    useEffect(() => {
        const roles = ['Administrator', 'Professor']
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
        setIsLoading(true)
        getStudents(page, 10, search)
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    mapped = result.map((student) => ({
                        Id: student.id,
                        Nome: `${student.firstName} ${student.lastName}`,
                        Status: translateEnumValue(STATUS_ENUM, student.status),
                        "E-mail": student.email,
                        "Matrícula": student.registration,
                        "Data de qualificação": formatDate(student.projectQualificationDate),
                        "Data de defesa": formatDate(student.projectDefenceDate),
                    }))
                }
                setStudents(mapped)
                setDisableNext(result.length < 10)
                setIsLoading(false)

            })
    }, [page, search])

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="studentBar">
                <div className="left-bar">
                    <div>
                        <img src="student.png" alt="A logo representing students" height={"100rem"} />
                    </div>
                    <div className="title">Estudantes</div>
                </div>
                {role === 'Administrator' && <div className="right-bar">
                    <div className="search">
                        <input type="search" name="search" id="search" value={search} onChange={(e)=>{setPage(1);setSearch(e.target.value)}} />
                        <i className="fas fa-" />
                    </div>
                    <div className="create-button">
                        <button onClick={() => navigate('/students/add')}>Novo Estudante</button>
                    </div>
                </div>}
            </div>
            <BackButton ></BackButton>
            <Table data={students} useOptions={true} page={page} setPage={setPage} disableNext={disableNext} detailsCallback={(id) => navigate(`${id}`)} />
        </PageContainer>
    )
}