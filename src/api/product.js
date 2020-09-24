import request from '../config/axios'

export const fetchProductDetail = (productNo, obj) => {
    return request({
        url: '/shop/api/product/detail/share/' + productNo,
        method: 'get',
        params: obj
    });
}
export const productProperty = (productNo, obj) => {
    return request({
        url: '/shop/api/product/property/' + productNo,
        method: 'get',
        params: obj
    });
}
export const productPay = (data) => {
    return request({
        url: '/shop/api/pay/cartBuyNew',
        method: 'post',
        data: data
    });
}
// 新增地址
export const setAddress = (data) => {
    return request({
        url: '/shop/api/delivery/add',
        method: 'post',
        params: data
    });
}
// 所有地址
export const addressPage = () => {
    return request({
        url: '/shop/api/delivery/page?appId=dudu&pageNum=1&pageSize=100&uid=922789',
        method: 'get'
    });
}
