import service from '@/utils/request'

export const getConfigList = () => {
  return service.get('/blog/config/getConfigList')
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const addConfig = (blogConfig) => {
  return service.post('/blog/config/addConfig', blogConfig)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const updateConfig = (blogConfig) => {
  return service.post('/blog/config/updateConfig', blogConfig)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const deleteConfig = (configField) => {
  return service.post('/blog/config/deleteConfig', configField)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

