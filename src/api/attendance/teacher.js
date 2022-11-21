import service from '@/utils/request'

const PREFIX = '/teacher'

export const pageTeacherList = (searchParam) => {
  return service.post(PREFIX + '/page/teacher/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
