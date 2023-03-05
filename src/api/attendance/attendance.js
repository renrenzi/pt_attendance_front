import service from '@/utils/request'

const PREFIX = '/attendance'

export const pageAttendanceList = (searchParam) => {
  return service.post(PREFIX + '/page/attendance/list', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
export const updateAttendance = (searchParam) => {
  return service.post(PREFIX + '/update/attendance/info', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const batchDeleteAttendance = (searchParam) => {
  return service.post(PREFIX + '/batch/delete/attendance/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
