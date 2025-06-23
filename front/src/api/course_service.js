import api from './_api'

export async function getCourses(){
    return (await api.get("courses"))?.data
}

export async function getCourseById(id){
    return (await api.get(`courses/${id}`))?.data
}

export async function postCourse(data){
    return (await api.post("courses", data))?.data
}

export async function putCourseById(id, data){
    return (await api.put(`courses/${id}`, data))?.data
}

export async function deleteCourse(id){
    return await api.delete(`courses/${id}`)
}
