import service from '@/utils/request'

const PREFIX = '/course'

export const batchDeleteCourse = (searchParam) => {
  return service.post(PREFIX + '/batch/delete/course', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const pageCourseList = (searchParam) => {
  return service.post(PREFIX + '/page/course/list', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
