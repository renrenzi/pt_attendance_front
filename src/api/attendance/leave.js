import service from '@/utils/request'

const PREFIX = '/leave'

export const pageLeaveList = (searchParam) => {
  return service.post(PREFIX + '/page/leave/list', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
export const updateLeaveInfo = (searchParam) => {
  return service.post(PREFIX + '/update/leave/info', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const batchDeleteLeave = (searchParam) => {
  return service.post(PREFIX + '/batch/delete/leave/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
