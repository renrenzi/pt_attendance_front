import service from '@/utils/request'


const PREFIX = '/user/role/relation/';

export const allocateRole = (searchParam) => {
    return service.post(PREFIX + 'allocateRole', searchParam)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}

export const getRoleListById = (searchParam) => {
    return service.post(PREFIX + 'getRoleListById', searchParam)
        .then(res => {
            return res.data;
        })
        .catch(res => {
            return false;
        })
}
