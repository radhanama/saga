import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from './createUser';

export default function UserUpdate(){
    const { role } = useParams();
    const roleMapping = {
        Student: 'Estudante',
        ExternalResearcher: 'Externo',
        Professor: 'Professor',
    };
    const translatedRole = roleMapping[role] ?? role;
    return <UserForm isUpdate={true} type={translatedRole} />;
}
