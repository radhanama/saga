import api from './_api'

export async function getStudents(page = 1, pageSize = 10){
    return (await api.get(`students?page=${page}&pageSize=${pageSize}`))?.data
}

export async function postStudents(data){
    return (await api.post("students",data))?.data
}

export async function deleteStudent(id){
    return (await api.delete(`students/${id}`))
}
export async function getStudentById(id){
    return (await api.get(`students/${id}`))?.data
}

export async function putStudentById(id, data){
    return (await api.put(`students/${id}`,data))?.data
}
export async function postStudentCsv(formData){
    return (await api.post(`students/csv`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }))?.data
}

export async function postStudentCourseCsv(formData){
    return (await api.post(`students/course/csv`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }))?.data
}

export async function exportStudentsCsv(fields){
    const response = await api.post(`students/export`, fields ?? [], { responseType: 'blob' });
    return response.data
}
