import api from './_api'

export function Login({email, password})
    {
        return api.post('users/login', { email, password})
    }

    export function ResetPassword({token, password})
    {
        const config = {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${token}`,
            },
          }
        return api.postWithoutToken('users/resetPassword', { password }, config)
    }

export function ForgotPassword({email, resetPasswordPath})
{
    return api.postWithoutToken('users/resetPasswordRequet', { email, resetPasswordPath })
}

export async function getUsers(){
    return (await api.get('users'))?.data
}

export async function deleteUser(id){
    return (await api.delete(`users/${id}`))?.data
}

