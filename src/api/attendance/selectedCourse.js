import service from '@/utils/request'

const PREFIX = '/selectedCourse'

export const pageSelectedCourseList = (searchParam) => {
  return service.post(PREFIX + '/page/selected/course/list', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
