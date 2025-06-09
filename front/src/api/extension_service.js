import api from './_api'

export async function getExtensions(){
    return (await api.get("extensions"))?.data
}

export async function postExtensions(data) {
    return (await api.post("extensions", data))?.data
}

export async function deleteExtensions(id) {
    return await api.delete(`extensions/${id}`)
}

export async function getExtensionById(id){
    return (await api.get(`extensions/${id}`))?.data
}

export async function putExtensionById(id, data){
    return (await api.put(`extensions/${id}`, data))?.data
}