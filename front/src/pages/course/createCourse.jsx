import { useEffect, useState } from "react"
import '../../styles/form.scss'
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode"
import BackButton from "../../components/BackButton"
import PageContainer from "../../components/PageContainer"
import InlineError from "../../components/error/InlineError"
import { postCourse } from "../../api/course_service"

export default function CreateCourse(){
    const navigate = useNavigate()
    const [name] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [error, setError] = useState('')
    const [course, setCourse] = useState({
        name:'',
        courseUnique:'',
        credits:0,
        code:'',
        concept:'',
        isElective:false
    })

    useEffect(()=>{
        const token = localStorage.getItem('token')
        try{
            const decoded = jwt_decode(token)
            if(decoded.role !== 'Administrator'){
                navigate('/')
            }
            setRole(decoded.role)
        }catch(err){
            navigate('/login')
        }
    },[navigate])

    const handleSave = (e)=>{
        e.preventDefault()
        postCourse(course)
            .then(()=>navigate(-1))
            .catch(err => setError(err?.message || 'Erro ao salvar curso'))
    }

    return(
        <PageContainer name={name} isLoading={false}>
            <BackButton />
            <form className='form'>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='name'>Nome</label>
                        <input type='text' id='name' value={course.name} onChange={e=>setCourse({...course, name:e.target.value})} required />
                    </div>
                    <div className='formInput'>
                        <label htmlFor='courseUnique'>Identificador</label>
                        <input type='text' id='courseUnique' value={course.courseUnique} onChange={e=>setCourse({...course, courseUnique:e.target.value})} required />
                    </div>
                </div>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='credits'>Creditos</label>
                        <input type='number' id='credits' value={course.credits} onChange={e=>setCourse({...course, credits:Number(e.target.value)})} />
                    </div>
                    <div className='formInput'>
                        <label htmlFor='code'>Codigo</label>
                        <input type='text' id='code' value={course.code} onChange={e=>setCourse({...course, code:e.target.value})} />
                    </div>
                </div>
                <div className='form-section'>
                    <div className='formInput'>
                        <label htmlFor='concept'>Conceito</label>
                        <input type='text' id='concept' value={course.concept} onChange={e=>setCourse({...course, concept:e.target.value})} />
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
                        <input type='submit' value='Submit' onClick={handleSave}/>
                        <InlineError message={error} />
                    </div>
                </div>
            </form>
        </PageContainer>
    )
}
