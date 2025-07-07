import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from './createUser';
import { translateEnumValue, ROLES_ENUM } from '../../enum_helpers';

export default function UserUpdate(){
    const { role } = useParams();
    const translated = translateEnumValue(ROLES_ENUM, role);
    const translatedRole = translated || role;
    return <UserForm isUpdate={true} type={translatedRole} />;
}
