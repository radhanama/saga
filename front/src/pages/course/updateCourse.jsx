import { useEffect, useState } from "react"
import '../../styles/form.scss'
import { useNavigate, useParams } from "react-router"
import jwt_decode from "jwt-decode"
import BackButton from "../../components/BackButton"
import PageContainer from "../../components/PageContainer"
import { getCourseById, putCourseById } from "../../api/course_service"

export default function UpdateCourse(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [name] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        try{
            const decoded = jwt_decode(token)
            if(decoded.role === 'Student'){
                navigate('/')
            }
            setRole(decoded.role)
        }catch(err){
            navigate('/login')
        }
    },[navigate])

    useEffect(()=>{
        getCourseById(id)
            .then(res=>{ setCourse(res); setIsLoading(false) })
            .catch(()=>{ setIsLoading(false) })
    },[id])

    const handleSave = (e)=>{
        e.preventDefault()
        putCourseById(id, course)
            .then(()=>navigate('/courses'))
    }

    if(!course) return <PageContainer name={name} isLoading={isLoading}><BackButton/></PageContainer>

    return(
        <PageContainer name={name} isLoading={isLoading}>
            <BackButton />
            <form className='form'>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='name'>Nome</label>
                        <input type='text' id='name' value={course.name||''} onChange={e=>setCourse({...course, name:e.target.value})} required />
                    </div>
                    <div className='formInput'>
                        <label htmlFor='courseUnique'>Identificador</label>
                        <input type='text' id='courseUnique' value={course.courseUnique||''} onChange={e=>setCourse({...course, courseUnique:e.target.value})} required />
                    </div>
                </div>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='credits'>Creditos</label>
                        <input type='number' id='credits' value={course.credits} onChange={e=>setCourse({...course, credits:Number(e.target.value)})} />
                    </div>
                    <div className='formInput'>
                        <label htmlFor='code'>Codigo</label>
                        <input type='text' id='code' value={course.code||''} onChange={e=>setCourse({...course, code:e.target.value})} />
                    </div>
                </div>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='concept'>Conceito</label>
                        <input type='text' id='concept' value={course.concept||''} onChange={e=>setCourse({...course, concept:e.target.value})} />
                    </div>
                    <div className='formInput'>
                        <label htmlFor='isElective'>Eletiva</label>
                        <select id='isElective' value={course.isElective ? '1':'0'} onChange={e=>setCourse({...course, isElective:e.target.value==='1'})}>
                            <option value='0'>Não</option>
                            <option value='1'>Sim</option>
                        </select>
                    </div>
                </div>
                <div className='form-section'>
                    <div className='formInput'>
                        <input type='submit' value='Update' onClick={handleSave}/>
                    </div>
                </div>
            </form>
        </PageContainer>
    )
}
