import service from '@/utils/request'

export const getBlogCategoryList = () => {
  return service.get('/blog/category/list')
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
export const pageCategory = (searchParam) => {
  return service.post('/blog/category/pageCategory', searchParam)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
export const updateCategoryStatus = (category) => {
  return service.post('/blog/category/categoryStatus', category)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const addCategory = (category) => {
  return service.post('/blog/category/addCategory', category)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const clearCategory = (categoryId) => {
  return service.post('/blog/category/clearCategory', categoryId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const getCategory = (categoryId) => {
  return service.post('/blog/category/getCategory', categoryId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
