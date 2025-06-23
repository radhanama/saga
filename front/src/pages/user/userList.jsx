import { useEffect, useState } from "react";
import '../../styles/userList.scss';
import Table from "../../components/Table/table";
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
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

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
    }, [navigate, setRole]);

    useEffect(() => {
        getUsers()
            .then(result => {
                let mapped = [];
                if (result) {
                    mapped = result.map(user => ({
                        Id: user.id,
                        Nome: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
                        "E-mail": user.email,
                        Role: translateEnumValue(ROLES_ENUM, user.role)
                    }));
                }
                setUsers(mapped);
                setIsLoading(false);
            });
    }, [setUsers, setIsLoading]);

    const handleDelete = (id) => {
        deleteUser(id).then(() => {
            setUsers(prev => prev.filter(u => u.Id !== id));
        });
    };

    return (
        <PageContainer name={name} isLoading={isLoading}>
            <div className="userBar">
                <div className="left-bar">
                    <div>
                        <img src="professor.png" alt="Users icon" height={"100rem"} />
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
            <Table data={users} useOptions={true} deleteCallback={handleDelete} />
        </PageContainer>
    );
}
