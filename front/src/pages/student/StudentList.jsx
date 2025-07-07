import { useEffect, useState } from "react";
import '../../styles/studentList.scss';
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate } from "react-router";
import { getStudents, exportStudentsCsv, deleteStudent } from "../../api/student_service"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import { translateEnumValue } from "../../enum_helpers";
import { STATUS_ENUM } from "../../enum_helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';

const formatDate = (date) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export default function StudentList() {
    const navigate = useNavigate()
    const [name, _] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [students, setStudents] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const itemsPerPage = 10


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
        getStudents(currentPage, itemsPerPage)
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    mapped = result.items.map((student) => ({
                        Id: student.id,
                        Nome: `${student.firstName} ${student.lastName}`,
                        Status: translateEnumValue(STATUS_ENUM, student.status),
                        "E-mail": student.email,
                        "Matrícula": student.registration,
                        "Data de qualificação": formatDate(student.projectQualificationDate),
                        "Data de defesa": formatDate(student.projectDefenceDate),
                    }))
                    setTotalCount(result.totalCount)
                }
                setStudents(mapped)
            })
            .catch(() => { })
            .finally(() => setIsLoading(false))
    }, [currentPage])

    const handleExport = () => {
        setIsLoading(true)
        exportStudentsCsv()
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob], {type: 'text/csv'}))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'students.csv')
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
            .finally(() => setIsLoading(false))
    }

    const handleDelete = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        deleteStudent(id).then(() => {
            setStudents(students.filter((s) => s.Id !== id));
        });
    };

    const handleEdit = (id) => {
        navigate(`${id}/edit`);
    };

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="studentBar">
                <div className="left-bar">
                    <div>
                        <FontAwesomeIcon icon={faUserGraduate} />
                    </div>
                    <div className="title">Estudantes</div>
                </div>
                {role === 'Administrator' && <div className="right-bar">
                    <div className="create-button">
                        <button onClick={() => navigate('/students/add')}>Novo Estudante</button>
                    </div>
                    <div className="create-button">
                        <button onClick={handleExport}>Exportar CSV</button>
                    </div>
                </div>}
            </div>
            <BackButton ></BackButton>
            <p className="info">Para cadastrar uma dissertação ou prorrogação, abra o perfil do estudante clicando em sua linha.</p>
            <Table
                data={students}
                page={1}
                itemsPerPage={itemsPerPage}
                useOptions={true}
                deleteCallback={handleDelete}
                editCallback={handleEdit}
                detailsCallback={(id) => navigate(`${id}`)}
            />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(totalCount / itemsPerPage)} onPageChange={setCurrentPage} />
        </PageContainer>
    )
}