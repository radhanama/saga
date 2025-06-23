import React, { useEffect, useState } from "react";
import '../../styles/researcherList.scss';
import Table from "../../components/Table/table"
import { getResearchers } from "../../api/researcher_service"
import { useNavigate } from "react-router"
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";

export default function ResearcherList() {
    const navigate = useNavigate()
    const [name,] = useState(localStorage.getItem('name'))
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [isLoading, setIsLoading] = useState(true)
    const [researchers, setResearchers] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [disableNext, setDisableNext] = useState(false)

    const detailsCallback = (id) => {
        navigate(id)
    }

    useEffect(() => {
        const roles = ['Administrator']
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
        getResearchers(page, 10, search)
            .then(result => {
                let mapped = []
                if (result !== null && result !== undefined) {
                    mapped = result.map((researcher) => {
                        return {
                            Id: researcher.id,
                            Nome: `${researcher?.firstName} ${researcher?.lastName}`,
                            "E-mail": researcher.email,
                            "Instituição": researcher.institution,
                        }
                    })
                }
                setResearchers(mapped)
                setDisableNext(result.length < 10)
                setIsLoading(false)
            })
    }, [page, search])

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="researcherBar">
                <div className="left-bar">
                    <div>
                        <img className="filtered" src="researcher.png" alt="A logo representing researchers" height={"100rem"} />
                    </div>
                    <div className="title">Pesquisadores</div>
                </div>
                <div className="right-bar">
                    <div className="search">
                        <input type="search" name="search" id="search" value={search} onChange={(e)=>{setPage(1);setSearch(e.target.value)}} />
                        <i className="fas fa-" />
                    </div>
                    <div className="create-button">
                        <button onClick={() => navigate('/researches/add')}>Novo Pesquisador</button>
                    </div>
                </div>
            </div>
            <BackButton />
            <Table data={researchers} useOptions={true} page={page} setPage={setPage} disableNext={disableNext} detailsCallback={detailsCallback} />
        </PageContainer>
    )
}
