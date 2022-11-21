import service from '@/utils/request'

const PREFIX = '/student'

export const pageStudentList = (searchParam) => {
  return service.post(PREFIX + '/page/student/list', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
