import { useEffect, useState } from "react";
import '../../styles/courseList.scss';
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { getCourses, deleteCourse } from "../../api/course_service";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

export default function CourseList(){
    const navigate = useNavigate()
    const [name] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [courses, setCourses] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(()=>{
        const roles = ['Administrator','Professor','Student']
        const token = localStorage.getItem('token')
        try{
            const decoded = jwt_decode(token)
            if(!roles.includes(decoded.role)){
                navigate('/')
            }
            setRole(decoded.role)
        }catch(err){
            navigate('/login')
        }
    },[navigate])

    useEffect(()=>{
        getCourses()
            .then(result=>{
                let mapped = []
                if(result){
                    mapped = result.map(course=>({
                        Id: course.id,
                        Nome: course.name,
                        Codigo: course.code,
                        Creditos: course.credits,
                        Conceito: course.concept,
                        Eletiva: course.isElective ? 'Sim' : 'Nao'
                    }))
                }
                setCourses(mapped)
                setIsLoading(false)
            })
    },[])

    const handleDelete = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        deleteCourse(id).then(() => setCourses(courses.filter(c => c.Id !== id)));
    };

    const handleEdit = (id) => {
        navigate(`${id}/edit`);
    };

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="courseBar">
                <div className="left-bar">
                    <div>
                        <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div className="title">Cursos</div>
                </div>
                {role === 'Administrator' && <div className="right-bar">
                    <div className="create-button">
                        <button onClick={()=>navigate('/courses/add')}>Novo Curso</button>
                    </div>
                </div>}
            </div>
            <BackButton />
            <Table
                data={courses}
                page={currentPage}
                itemsPerPage={itemsPerPage}
                useOptions={role!=='Student'}
                deleteCallback={handleDelete}
                editCallback={handleEdit}
            />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(courses.length/itemsPerPage)} onPageChange={setCurrentPage} />
        </PageContainer>
    )
}
