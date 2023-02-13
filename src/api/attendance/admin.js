import service from '@/utils/request'

const PREFIX = '/admin'

export const pageAdminInfoList = (searchParam) => {
  return service.post(PREFIX + '/page/admin/info/list', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}


export const userLoginInfo = (searchParam) => {
  return service.post(PREFIX + '/user/login/info', searchParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export class getCount {
}

export class registerUser {
}

export class editUserInfo {
}

export class deleteUsers {
}

export class logOut {
}
