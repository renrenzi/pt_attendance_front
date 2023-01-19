import service from '@/utils/request'

const PREFIX = '/selectedCourse'

export const updateSelectedCourse = (requestParam) => {
  return service.post(PREFIX + '/update/selected/course', requestParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const pageSelectedCourseList = (requestParam) => {
  return service.post(PREFIX + '/page/selected/course/list', requestParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
