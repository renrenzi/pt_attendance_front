import service from '@/utils/request'

export const getBlogTagList = () => {
    return service.get('/blog/tag/getBlogTag')
        .then(res => {
            return res.data.data;
        })
        .catch(res => {
            return false;
        })
}
export const pageBlogTag = (searchParam) => {
    return service.post('/blog/tag/pageBlogTag', searchParam)
        .then(res => {
            return res.data.data;
        })
        .catch(res => {
            return false;
        })
}
export const updateTagStatus = (blogTag) => {
    return service.post('/blog/tag/tagStatus', blogTag)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const addTag = (blogTag) => {
    return service.post('/blog/tag/addTag', blogTag)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const clearTag = (tagId) => {
    return service.post('/blog/tag/tagClear', tagId)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const getTag = (tagId) => {
    return service.post('/blog/tag/getTag', tagId)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
