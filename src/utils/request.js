import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8090/', //process.env.BASE_API, // api 的 base_url
  timeout: 500000,
  withCredentials: true, //解决前后端session不一致问题
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Header': '*',
    'Access-Control-Allow-Credentials': 'true'

  }
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    const new_token = response.headers.token;
    setToken(new_token)
    return response;
  },
  error => {
    if (error.response.status === 503 || error.response.status === 504) {

      MessageBox.confirm('您操作超时或已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      Message({
        message: '无效请求!',
        type: 'warning',
        duration: 3 * 1000
      })
    }

    return Promise.reject(error)
  }
);

export default service