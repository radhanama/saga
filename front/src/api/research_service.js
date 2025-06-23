import api from './_api'

export async function getResearch(page = 1, size = 10, search = ''){
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    return (await api.get(`orientations?${params.toString()}`))?.data
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