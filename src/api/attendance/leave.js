import service from '@/utils/request'

const PREFIX = '/leave'

export const pageLeaveList = (searchParam) => {
  return service.post(PREFIX + '/page/leave/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
