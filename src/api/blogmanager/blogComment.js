import service from '@/utils/request'

export const replyComment = (blogComment) => {
  return service.post('/front/view/replyComment', blogComment)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const createComment = (blogComment) => {
  return service.post('/blog/comment/createComment', blogComment)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}

export const pageComment = (condition) => {
  return service.post('/blog/comment/pageComment', condition)
    .then(res => {
      return res.data.data
    })
    .catch(res => {
      return false
    })
}
export const updateCommentStatus = (blogComment) => {
  return service.post('/blog/comment/commentStatus', blogComment)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const deleteComment = (commentId) => {
  return service.post('/blog/comment/deleteComment', commentId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
export const getComment = (commentId) => {
  return service.post('/blog/comment/getComment', commentId)
    .then(res => {
      return res.data
    })
    .catch(res => {
      return false
    })
}
