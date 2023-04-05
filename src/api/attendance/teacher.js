import service from '@/utils/request'

const PREFIX = '/teacher'

export const pageTeacherList = (requestParam) => {
  return service.post(PREFIX + '/page/teacher/list', requestParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const batchDeleteTeacher = (requestParam) => {
  return service.post(PREFIX + '/batch/delete/teacher', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const updateTeacherInfo = (requestParam) => {
  return service.post(PREFIX + '/update/teacher/info', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const addTeacher = (requestParam) => {
  return service.post(PREFIX + '/add/teacher', requestParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
