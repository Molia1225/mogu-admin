import axios from 'axios'


axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'



// 请求拦截器
axios.interceptors.request.use(function (config) {
    let path = config.url.split('?')[0]
    let search = config.url.split('?')[1] || ''

    // 添加时间戳
    search = ('?_v=' + Date.now()) + (search ? '&' + search : '')
    config.url = path + search

    return config

}, function (error) {
    return Promise.reject(error)
})


// 响应拦截器
axios.interceptors.response.use(function (response) {
    let result = response.data ? response.data : response
    if(result){
        if(result.msg=='您不是超级管理员,没有操作权限'||result.msg=='您不是超级管理员，没有操作权限'||result.msg=='请先登录'){
            location.href = location.origin +'/nbyh/manager-gold/login'
        }
    }
    return result
}, function (error) {
    return Promise.reject(error)
})


// get 请求
const get = (url, data, options) => axios(Object.assign({}, {
    method: 'get',
    url: url,
    params: data,
}, options))


// post 请求
const post = (url, data, options) => axios(Object.assign({}, {
    method: 'post',
    url: url,
    data: data,
}, options))


// all 请求
const all = (arrReqs) => axios.all(arrReqs)


export {
    get,
    post,
    all,
}