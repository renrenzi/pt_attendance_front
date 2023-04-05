import service from '@/utils/request'

const PREFIX = '/user/role/'

export const addRole = (searchParam) => {
  return service.post(PREFIX + 'addRole', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const deleteRoles = (searchParam) => {
  return service.post(PREFIX + 'deleteRoles', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const editRole = (searchParam) => {
  return service.post(PREFIX + 'editRole', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const pageRole = (searchParam) => {
  return service.post(PREFIX + 'pageRole', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const getAllRole = (searchParam) => {
  return service.get(PREFIX + 'all/enable/role', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
