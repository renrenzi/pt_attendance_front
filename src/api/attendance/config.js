import service from '@/utils/request'

const PREFIX = '/config'
export const getConfigList = () => {
  return service.get(PREFIX+'/getConfigList')
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const addConfig = (blogConfig) => {
  return service.post(PREFIX+'/addConfig',blogConfig)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const updateConfig = (blogConfig) => {
  return service.post(PREFIX+'/updateConfig',blogConfig)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}
export const deleteConfig = (configField) => {
  return service.post(PREFIX+'/deleteConfig',configField)
    .then(res => {
      return res.data;
    })
    .catch(res => {
      return false;
    })
}

