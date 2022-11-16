import service from '@/utils/request'

export const editBlog = (condition) => {
  return service.post('/blog/info/editBlogInfo', condition)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const pageBlog = (condition) => {
  return service.post('/blog/info/pageBlog', condition)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const saveBlog = (saveParam) => {
  return service.post('/blog/info/saveBlog2', saveParam)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const getBlogList = () => {
  return service.get('/blog/info/getAllBlog')
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}

export const getBlogInfo = (blogId) => {
  return service.post('/blog/info/getBlogInfo', blogId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const updateBlogStatus = (blogInfo) => {
  return service.post('/blog/info/blogStatus', blogInfo)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const deleteBlog = (blogId) => {
  return service.post('/blog/info/deleteBlog', blogId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const restoreBlog = (blogId) => {
  return service.post('/blog/info/restoreBlog', blogId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const clearBlog = (blogId) => {
  return service.post('/blog/info/clearBlog', blogId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const uploadFileByFastDFS = (file) => {
  return service.post('/blog/info/uploadFileByFastDFS',
    file,
    { 'Content-Type': 'multipart/form-data' }).then(res => {
    return res.data
  })
    .catch(res => {
      return false
    })
}
