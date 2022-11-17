import Cookies from 'js-cookie'
const TokenKey = 'Authorization'
const UserKey = 'UserMapKey'
const UserMap = new Map()
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserKey() {
  return localStorage.getItem(UserKey)
}

export function setUserKey(userMap) {
  return localStorage.setItem(UserKey, userMap)
}

export function removeUserKey() {
  return localStorage.removeItem(UserKey)
}

export function getUser(id) {
  if (getUserKey()) {
    return getUserKey().get(id)
  }
}

export function setUser(user) {
  if (getUserKey()) {
    return getUserKey().set(user.getAdminUserId, user)
  } else {
    UserMap.set(user.getAdminUserId, user)
    setUserKey(UserKey, UserMap)
  }
}

export function removeUser(id) {
  removeUserKey()
}
