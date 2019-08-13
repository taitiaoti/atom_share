import request from '../config/axios'

export const fetchProductDetail = (productNo, obj) => {
    return request({
        url: '/shop/api/product/detail/share/' + productNo,
        method: 'get',
        params: obj
    });
}