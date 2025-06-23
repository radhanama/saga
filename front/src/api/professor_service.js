import api from './_api'

export async function getProfessors(page = 1, size = 10, search = ''){
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    return (await api.get(`professors?${params.toString()}`))?.data
}

export async function getProfessorById(id){
    return (await api.get(`professors/${id}`))?.data
}

export async function putProfessorById(id, data){
    return (await api.put(`professors/${id}`,data))?.data
}

export async function postProfessors(data){
    return (await api.post("professors",data))?.data
}