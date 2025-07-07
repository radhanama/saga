import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from './createUser';
// map every backend role name to the values expected by UserForm
const ROLE_MAP = {
    Student: 'Estudante',
    Professor: 'Professor',
    Administrator: 'Administrator',
    ExternalResearcher: 'Externo',
    ResetPassword: 'ResetPassword'
};

export default function UserUpdate(){
    const { role } = useParams();
    const formRole = ROLE_MAP[role] ?? role;
    return <UserForm isUpdate={true} type={formRole} />;
}
