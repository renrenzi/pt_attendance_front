
import service from '@/utils/request'

export const getLinkTypeList = () => {
    return service.get('/blog/link/getLinkTypeList')
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const pageLinkList = (searchParam) => {
    return service.post('/blog/link/pageLinkList',searchParam)
        .then(res => {
            return res.data.data;
        })
        .catch(res => {
            return false;
        })
}
export const addLink = (blogLink) => {
    return service.post('/blog/link/addLink',blogLink)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const isDel = (blogLink) => {
    return service.post('/blog/link/isDel',blogLink)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const clearLink = (blogId) => {
    return service.post('/blog/link/clearLink',blogId)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const getLink = (blogId) => {
    return service.post('/blog/link/getLink',blogId)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
export const editLink = (blogLink) => {
    return service.post('/blog/link/editLink',blogLink)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
