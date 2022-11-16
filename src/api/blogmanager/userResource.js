import service from '@/utils/request'

const PREFIX = '/user/resource/'

export const getResourceByRoleId = (searchParam) => {
  return service.post(PREFIX + 'getResourceByRoleId', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const addResource = (searchParam) => {
  return service.post(PREFIX + 'addResource', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const deleteResources = (searchParam) => {
  return service.post(PREFIX + 'deleteResources', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const editResource = (searchParam) => {
  return service.post(PREFIX + 'editResource', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const pageResource = (searchParam) => {
  return service.post(PREFIX + 'pageResource', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
