import service from '@/utils/request'

export const logOut = (condition) => {
  return service.get('/admin/logOut', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const login = (condition) => {
  return service.post('/admin/login', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const getCount = () => {
  return service.get('/admin/count')
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const uploadAuthorImg = (requestParam) => {
  return service({
    url: '/admin/uploadAuthorImg',
    method: 'post',
    data: requestParam,
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
    return res.data
  }).catch(res => {
    return false
  })
}

export const editUserInfo = (condition) => {
  return service.post('/admin/editUserInfo', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const registerUser = (condition) => {
  return service.post('/admin/register', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const deleteUsers = (condition) => {
  return service.post('/admin/deleteUsers', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const pageUser = (condition) => {
  return service.post('/admin/pageUser', condition)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
