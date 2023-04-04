import service from '@/utils/request'

const PREFIX = '/student'

export const pageStudentList = (requestParam) => {
  return service.post(PREFIX + '/page/student/list', requestParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const updateStudentInfo = (requestParam) => {
  return service.post(PREFIX + '/update/student/info', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const batchDeleteStudentList = (requestParam) => {
  return service.post(PREFIX + '/batch/delete/student/list', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const addStudent = (requestParam) => {
  return service.post(PREFIX + '/student/add', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
