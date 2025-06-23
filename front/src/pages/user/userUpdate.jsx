import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from './createUser';

export default function UserUpdate(){
    const { role } = useParams();
    return <UserForm isUpdate={true} type={role} />;
}
