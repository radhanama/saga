import React, { useEffect, useState } from 'react';
import CSVReader from 'react-csv-reader';
import PageContainer from '../components/PageContainer';
import Table from '../components/Table/table';
import '../styles/form.scss'
import '../styles/csvLoader.scss'
import Select from '../components/select';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router';
import { postStudentCsv, postStudentCourseCsv } from '../api/student_service';
import InlineError from '../components/error/InlineError';

const CsvImport = () => {
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(null);
    const [name,] = useState(localStorage.getItem('name'))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [entity, setEntity] = useState('Estudantes')
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
                .catch((err) => {
                    setError(err?.message || 'Erro ao importar dados');
                });
        }
        else if (entity === 'Materias cursados')
        {
            postStudentCourseCsv(formData)
                .then((response) => {
                    navigate('/')
                })
                .catch((err) => {
                    setError(err?.message || 'Erro ao importar dados');
                });
        }
        setIsLoading(false)
    };


    const csvOptions = {
        header: true,
        preview: 5
    }
    return (
        <PageContainer name={name} isLoading={isLoading}>
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
                            <InlineError message={error} />
                        </div>
                    </div>
                </div>
            </div>
            {fileData && <Table data={fileData} />}
            {message && <div className='success'>{message}</div>}
            </div>
        </PageContainer>)
};

export default CsvImport;
