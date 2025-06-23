import { useEffect, useState } from "react";
import '../../styles/userList.scss';
import Table from "../../components/Table/table";
import Pagination from "../../components/Pagination/Pagination";
import { getUsers, deleteUser } from "../../api/user_service";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import BackButton from "../../components/BackButton";
import PageContainer from "../../components/PageContainer";
import { translateEnumValue, ROLES_ENUM } from "../../enum_helpers";

export default function UserList() {
    const navigate = useNavigate();
    const [name] = useState(localStorage.getItem('name'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [users, setUsers] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            const decoded = jwt_decode(token);
            if (decoded.role !== 'Administrator') {
                navigate('/');
            }
            setRole(decoded.role);
        } catch (error) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        getUsers()
            .then(result => {
                const list = result ?? [];
                setUsers(list);
                const mapped = list.map(u => ({
                    Id: u.id,
                    Nome: `${u.firstName} ${u.lastName}`,
                    Email: u.email,
                    Perfil: translateEnumValue(ROLES_ENUM, u.role)
                }));
                setTableData(mapped);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        deleteUser(id).then(() => {
            setUsers(users.filter(u => u.id !== id));
            setTableData(tableData.filter(t => t.Id !== id));
        });
    };

    const handleDetails = (id) => {
        const user = users.find(u => u.id === id);
        if (!user) return;
        switch (user.role) {
            case 'Student':
                navigate(`/students/${id}/edit`);
                break;
            case 'Professor':
                navigate(`/professors/${id}/edit`);
                break;
            case 'ExternalResearcher':
                navigate(`/researchers/${id}`);
                break;
            default:
                break;
        }
    };

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="userBar">
                <div className="left-bar">
                    <div>
                        <img src="student.png" alt="Users" height={"100rem"} />
                    </div>
                    <div className="title">Usuários</div>
                </div>
                <div className="right-bar">
                    <div className="create-button">
                        <button onClick={() => navigate('/user/add')}>Novo Usuário</button>
                    </div>
                </div>
            </div>
            <BackButton />
            <Table data={tableData} page={currentPage} itemsPerPage={itemsPerPage} useOptions={true} detailsCallback={handleDetails} deleteCallback={handleDelete} />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(tableData.length/itemsPerPage)} onPageChange={setCurrentPage} />
        </PageContainer>
    );
}
