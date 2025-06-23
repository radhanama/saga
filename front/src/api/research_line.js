import api from './_api'

export async function getResearchLines(){
    return (await api.get("researchLines"))?.data
}

export async function postResearchLine(data){
    return (await api.post("researchLines", data))?.data
}

export async function putResearchLine(id, data){
    return (await api.put(`researchLines/${id}`, data))?.data
}

export async function deleteResearchLine(id){
    return await api.delete(`researchLines/${id}`)
}