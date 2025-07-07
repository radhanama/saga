import api from './_api'

export async function getResearch(){
    return (await api.get("orientations"))?.data
}

export async function postResearch(data){
    return (await api.post("orientations",data))?.data
}

export async function getResearchById(id){
    return (await api.get(`orientations/${id}`))?.data
}

export async function putResearch(id, data){
    return (await api.put(`orientations/${id}`, data))?.data
}

export async function deleteResearch(id){
    return await api.delete(`orientations/${id}`)
}

