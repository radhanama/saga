import { useEffect, useState } from "react"
import '../../styles/courseList.scss'
import Table from "../../components/Table/table"
import { getCourses } from "../../api/course_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode"
import BackButton from "../../components/BackButton"
import PageContainer from "../../components/PageContainer"

export default function CourseList(){
    const navigate = useNavigate()
    const [name] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [courses, setCourses] = useState([])

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

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="courseBar">
                <div className="left-bar">
                    <div>
                        <img src="lamp.png" alt="Course icon" height={"100rem"}/>
                    </div>
                    <div className="title">Cursos</div>
                </div>
                {role === 'Administrator' && <div className="right-bar">
                    <div className="search">
                        <input type="search" name="search" id="search" />
                    </div>
                    <div className="create-button">
                        <button onClick={()=>navigate('/courses/add')}>Novo Curso</button>
                    </div>
                </div>}
            </div>
            <BackButton />
            <Table data={courses} useOptions={role!=='Student'} detailsCallback={(id)=>navigate(`${id}/edit`)} />
        </PageContainer>
    )
}
