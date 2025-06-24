import { useState, useEffect } from 'react'
import MultiSelect from '../../components/Multiselect'
import PageContainer from '../../components/PageContainer'
import ErrorPage from '../../components/error/Error'
import BackButton from '../../components/BackButton'
import { exportStudentsCsv } from '../../api/student_service'
import { useNavigate } from 'react-router'
import jwt_decode from 'jwt-decode'

export default function StudentExport(){
    const [name] = useState(localStorage.getItem('name'))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [selectedFields, setSelectedFields] = useState([])
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{
        const roles = ['Administrator']
        const token = localStorage.getItem('token')
        try{
            const decoded = jwt_decode(token)
            if(!roles.includes(decoded.role)){
                navigate('/')
            }
        }catch(err){
            navigate('/login')
        }
    },[navigate])

    const handleExport = () => {
        setIsLoading(true)
        exportStudentsCsv(selectedFields)
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob], {type: 'text/csv'}))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'students.csv')
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
                setMessage('CSV gerado com sucesso')
            })
            .catch(()=>setError(true))
            .finally(()=>setIsLoading(false))
    }

    const fieldOptions = [
        'FirstName','LastName','Email','Cpf','Registration','RegistrationDate',
        'ProjectId','Status','EntryDate','ProjectDefenceDate','ProjectQualificationDate',
        'Proficiency','UndergraduateInstitution','InstitutionType','UndergraduateCourse',
        'GraduationYear','UndergraduateArea','DateOfBirth','Scholarship'
    ].map(opt=>({Id: opt, Name: opt}))

    return (
        <PageContainer name={name} isLoading={isLoading}>
            {!error && <div className='form csv'>
                <MultiSelect
                    options={fieldOptions}
                    selectedValues={fieldOptions.filter(f=>selectedFields.includes(f.Id))}
                    placeholder='Campos para exportar'
                    onSelect={list=>setSelectedFields(list.map(l=>l.Id))}
                    onRemove={list=>setSelectedFields(list.map(l=>l.Id))}
                    displayValue='Name'
                />
                <div className='formInput'>
                    <input type='button' value='Exportar CSV' onClick={handleExport} />
                </div>
                {message && <div className='success'>{message}</div>}
            </div>}
            {error && <ErrorPage/>}
            <BackButton />
        </PageContainer>
    )
}
