import api from './_api'

export async function getResearchLines(page = 1, size = 10, search = ''){
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    return (await api.get(`researchLines?${params.toString()}`))?.data
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