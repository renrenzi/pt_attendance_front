import service from '@/utils/request'

const PREFIX = '/clazz'

export const pageClazzList = (searchParam) => {
  return service.post(PREFIX + '/page/clazz/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
