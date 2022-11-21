import service from '@/utils/request'

const PREFIX = '/attendance'

export const pageAttendanceList = (searchParam) => {
  return service.post(PREFIX + '/page/attendance/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
