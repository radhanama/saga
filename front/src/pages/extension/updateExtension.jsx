import { useEffect, useState } from "react";
import "../../styles/createExtension.scss";
import { useParams, useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import Select from "../../components/select";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import ErrorPage from "../../components/error/Error";
import { getExtensionById, putExtensionById } from "../../api/extension_service";

export default function ExtensionUpdate(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [name] = useState(localStorage.getItem('name'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [extension, setExtension] = useState();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        try{
            const decoded = jwt_decode(token);
            setRole(decoded.role);
        }catch(err){
            navigate('/login');
        }
    },[navigate]);

    useEffect(()=>{
        getExtensionById(id)
            .then(res => { setExtension(res); setIsLoading(false); })
            .catch(()=>{ setError(true); setIsLoading(false); });
    }, [id]);

    const setDays = (val)=> setExtension({...extension, numberOfDays: Number(val)});
    const setType = (val)=> setExtension({...extension, type: val === 'Defesa' ? 1:2});

    const handleUpdate=(e)=>{
        e.preventDefault();
        putExtensionById(id, extension)
            .then(()=>navigate(-1))
            .catch(()=>setError(true));
    };

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <BackButton />
            {!error && extension && (
                <div className='extensionForm'>
                    <div className='form-section'>
                        <div className='formInput'>
                            <label htmlFor='numberOfDays'>Quantidade de Dias</label>
                            <input type='number' name='numberOfDays' value={extension.numberOfDays} onChange={e=>setDays(e.target.value)} id='numberOfDays'/>
                        </div>
                        <Select
                            className='formInput'
                            onSelect={setType}
                            defaultValue={extension.type === 1 ? 'Defesa':'Qualificação'}
                            options={["Defesa","Qualificação"].map(o=>({value:o,label:o}))}
                            label='Type'
                            name='type'
                        />
                    </div>
                    <div className='form-section'>
                        <div className='formInput'>
                            <input type='submit' value='Update' onClick={handleUpdate}/>
                        </div>
                    </div>
                </div>
            )}
            {error && <ErrorPage />}
        </PageContainer>
    );
}
