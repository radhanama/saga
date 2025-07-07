import { useEffect, useState } from "react";
import '../../styles/extensionList.scss';
import Table from "../../components/Table/table"
import Pagination from "../../components/Pagination/Pagination"
import { getExtensions, exportExtensionsCsv, deleteExtensions } from "../../api/extension_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import ErrorPage from "../../components/error/Error";
import PageContainer from "../../components/PageContainer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';


export default function ExtensionList() {
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [extensions, setextensions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        const roles = ['Administrator', 'Student']
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
        getExtensions()
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    mapped = result.map((extension) => {
                        return {
                            Id: extension.id,
                            Status: extension.status,
                            Estudante: extension?.student?.email,
                            Dias: extension?.numberOfDays,
                            Tipo: extension?.type === 1? "Defesa": "Qualificação" 
                        }
                    })
                }
                setextensions(mapped)
                setIsLoading(false)

            })
    }, [setextensions, setIsLoading, ])

    const handleExport = () => {
        setIsLoading(true)
        exportExtensionsCsv()
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob], {type: 'text/csv'}))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'extensions.csv')
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
            .finally(() => setIsLoading(false))
    }

    const handleDelete = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar?')) return;
        deleteExtensions(id).then(() => setextensions(extensions.filter(e => e.Id !== id)));
    };

    const handleEdit = (id) => {
        navigate(`${id}/edit`);
    };


    return (<PageContainer isLoading={isLoading} name={name} >
                <div className="extensionBar">
                    <div className="left-bar">
                        <div style={{margin: "0.5rem"}}>
                            <FontAwesomeIcon icon={role === 'Administrator' ? faCalendarCheck : faClock} />
                        </div>
                        <div className="title">Extensões</div>
                    </div>
                    <div className="right-bar">
                        {role === 'Administrator' && <div className="create-button">
                            <button onClick={handleExport}>Exportar CSV</button>
                        </div>}
                    </div>
                </div>
                <BackButton />
                <p className="info">Para criar uma nova prorrogação, acesse o perfil do estudante desejado.</p>
                <Table
                    data={extensions}
                    page={currentPage}
                    itemsPerPage={itemsPerPage}
                    useOptions={role === 'Administrator'}
                    deleteCallback={handleDelete}
                    editCallback={handleEdit}
                />
                <Pagination currentPage={currentPage} totalPages={Math.ceil(extensions.length/itemsPerPage)} onPageChange={setCurrentPage} />
                {error && < ErrorPage/>}
      </PageContainer>)
}