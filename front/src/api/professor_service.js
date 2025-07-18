import api from './_api'

export async function getProfessors(){
    return (await api.get("professors"))?.data
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

export async function deleteProfessor(id){
    return await api.delete(`professors/${id}`)
}

export async function exportProfessorsCsv(fields){
    const response = await api.post(`professors/export`, fields ?? [], { responseType: 'blob' })
    return response.data
}

