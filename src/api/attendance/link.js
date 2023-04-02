import service from '@/utils/request'

const PREFIX = '/link'

export const getLinkTypeList = () => {
  return service.get(PREFIX+'/getLinkTypeList')
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const pageLinkList = (searchParam) => {
  return service.post(PREFIX+'/pageLinkList',searchParam)
    .then(res => {
      return res.data.data;
    })
    .catch(res => {
      return false;
    })
}
export const addLink = (blogLink) => {
  return service.post(PREFIX+'/addLink',blogLink)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const isDel = (blogLink) => {
  return service.post(PREFIX+'/isDel',blogLink)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const clearLink = (blogId) => {
  return service.post(PREFIX+'/clearLink',blogId)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const getLink = (blogId) => {
  return service.post(PREFIX+'/getLink',blogId)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const editLink = (blogLink) => {
  return service.post(PREFIX+'/editLink',blogLink)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
