import React, { useEffect, useState } from 'react';
import CSVReader from 'react-csv-reader';
import PageContainer from '../components/PageContainer';
import Table from '../components/Table/table';
import '../styles/form.scss'
import '../styles/csvLoader.scss'
import Select from '../components/select';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router';
import { postStudentCsv, postStudentCourseCsv, exportStudentsCsv } from '../api/student_service';
import ErrorPage from '../components/error/Error';
import MultiSelect from '../components/Multiselect';

const CsvLoader = () => {
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(null);
    const [name,] = useState(localStorage.getItem('name'))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [entity, setEntity] = useState('Estudantes')
    const [selectedFields, setSelectedFields] = useState([])
    const [message, setMessage] = useState('')

    const handleFileLoaded = (data,file_info, originalFile) => {
        setFileData(data);
        setFile(originalFile)
    };
    const navigate = useNavigate()

    useEffect(() => {
        const roles = ['Administrator']
        const token = localStorage.getItem('token')
        try {
            const decoded = jwt_decode(token)
            if (!roles.includes(decoded.role)) {
                navigate('/')
            }
        } catch (error) {
            navigate('/login')
        }
    }, [navigate]);

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);
        if(entity === 'Estudantes')
        {       
            postStudentCsv(formData)
                .then((response) => {
                    navigate('/')
                })
                .catch((error) => {
                    setError(true);
                });
        }
        else if (entity === 'Materias cursados')
        {
            postStudentCourseCsv(formData)
                .then((response) => {
                    navigate('/')
                })
                .catch((error) => {
                    setError(true);
                }); 
        }
        setIsLoading(false)
    };

    const handleExport = () => {
        setIsLoading(true)
        exportStudentsCsv(selectedFields)
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'students.csv')
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
                setMessage('CSV gerado com sucesso')
            })
            .catch(() => {
                setError(true)
            })
            .finally(()=> setIsLoading(false))
    }

    const csvOptions = {
        header: true,
        preview: 5
    }
    const fieldOptions = [
        "FirstName","LastName","Email","Cpf","Registration","RegistrationDate",
        "ProjectId","Status","EntryDate","ProjectDefenceDate","ProjectQualificationDate",
        "Proficiency","UndergraduateInstitution","InstitutionType","UndergraduateCourse",
        "GraduationYear","UndergraduateArea","DateOfBirth","Scholarship"
    ].map(opt => ({ Id: opt, Name: opt }));
    return (
        <PageContainer name={name} isLoading={isLoading}>
            { !error &&
            <div className='csv-loader'>
            <div className="form csv">
                <div className='form-section'>
                    <div className='formInput'>
                    <Select
                        onSelect={setEntity}
                        options={["Estudantes", "Materias cursados"].map((option) => ({
                            value: option,
                            label: option,
                        }))}
                        label={"Entidade a criar"}
                        name={"entity"}
                        />
                    </div>
                </div>
                <div className='form-section'>
                    <MultiSelect
                        options={fieldOptions}
                        selectedValues={fieldOptions.filter(f => selectedFields.includes(f.Id))}
                        placeholder="Campos para exportar"
                        onSelect={(list)=>setSelectedFields(list.map(l=>l.Id))}
                        onRemove={(list)=>setSelectedFields(list.map(l=>l.Id))}
                        displayValue="Name"
                    />
                    <div className='formInput'>
                        <input type={'button'} value="Exportar CSV" onClick={()=>handleExport()} />
                    </div>
                </div>
                <div className='form-section'>
                    <CSVReader
                        onFileLoaded={handleFileLoaded}
                        cssClass='reader formInput'
                        label={'Escolher'}
                        cssLabelClass='file-label'
                        inputId='file-input'
                        name='file-input'
                        parserOptions={csvOptions} />
                    <div className='form-section'>
                        <div className='formInput'>
                            <input type={'submit'} value="Anexar" onClick={(e) => handleFileUpload()} />
                        </div>
                    </div>
                </div>
            </div>
            {fileData && <Table data={fileData} />}
            {message && <div className='success'>{message}</div>}
            </div>}
            {error && <ErrorPage/>}
        </PageContainer>)
};

export default CsvLoader;
