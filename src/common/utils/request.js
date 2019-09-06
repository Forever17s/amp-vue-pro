import axios from 'axios'
// 通过状态码返回错误信息
const setErrorMessage = err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
    }
  } else if (err.code === 'ECONNABORTED') {
    err.message = err.config.url + '请求超时'
  }
}

// 创建实例时设置配置的默认值
export const ampMonitor = axios.create({
  // baseURL: ampBase,
  headers: {
    'content-type': 'application/json'
  },
  timeout: 0, // 不限超时时间，webpack的代理控制最长超时时间
  validateStatus(status) {
    return status >= 200 && status <= 500
  }
})

// monitor添加请求拦截器
ampMonitor.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = JSON.parse(sessionStorage.getItem('token'))
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = 'Bearer ' + token
    return config
  },
  error => {
    // todo 对请求错误做些什么
    console.log('request error before', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
ampMonitor.interceptors.response.use(
  response => {
    const data = response.data
    // todo 根据返回的code值来做不同的处理（和后端约定）
    switch (data.code) {
      case '400':
        return data

      // 需要重新登录
      case '500':
        break

      default:
    }
    if (data.httpStatusCode && data.httpStatusCode !== 200) {
      // todo 先用特别的处理,如果用户没有登陆就请求
      if (data.httpStatusCode === 400 && data.message === '请先获取token') {
        global.PYFF.$router.push('/login?redirect=' + data.uri)
      } else if (data.httpStatusCode === 401) {
        console.warn(data)
        // global.PYFF.$router.push('/login');
        if (data.refreshToken) {
          sessionStorage.setItem('token', JSON.stringify(data.refreshToken))
          window.location.reload()
        } else {
          const uri =
            global.PYFF.$router.mode == 'hash'
              ? location.hash.substring(1)
              : location.pathname
          global.PYFF.$router.push('/login?redirect=' + uri)
        }
      } else {
        // todo 其它特别处理
      }
      const err = new Error(data.message)
      err.data = data
      err.response = response
      throw err // 抛出异常，每个请求都应捕获处理
    } else if (response.status === 200) {
      return data
    } else {
      // todo 通用的还有 Network Error，404等等
      const err = new Error(response.statusText)
      err.data = data
      err.response = response
      setErrorMessage(err)
      throw err // 抛出异常，每个请求都应捕获处理
    }
  },
  err => {
    setErrorMessage(err)
    return Promise.reject(err)
  }
)
// 创建实例时设置配置的默认值
export const apmConsole = axios.create({
  // baseURL: ampBase,
  headers: {
    'content-type': 'application/json'
  },
  timeout: 0, // 不限超时时间，webpack的代理控制最长超时时间
  validateStatus(status) {
    return status >= 200 && status <= 500
  }
})
// 添加请求拦截器
apmConsole.interceptors.request.use(
  config =>
    // 在发送请求之前做些什么
    // console.log('request before');
    // console.log(config);
    config,
  error => {
    // todo 对请求错误做些什么
    console.log('request error before', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
apmConsole.interceptors.response.use(
  response => {
    const data = response.data
    // todo 根据返回的code值来做不同的处理（和后端约定）
    switch (data.code) {
      case '400':
        return data

      // 需要重新登录
      case '500':
        break

      default:
    }
    if (data.httpStatusCode && data.httpStatusCode !== 200) {
      // todo 先用特别的处理,如果用户没有登陆就请求
      if (data.httpStatusCode === 400 && data.message === '请先获取token') {
        global.PYFF.$router.push('/login')
      } else {
        // todo 其它特别处理
      }
      const err = new Error(data.message)
      err.data = data
      err.response = response
      throw err // 抛出异常，每个请求都应捕获处理
    } else if (response.status === 200) {
      return data
    } else {
      // todo 通用的还有 Network Error，404等等
      const err = new Error(response.statusText)
      err.data = data
      err.response = response
      setErrorMessage(err)
      throw err // 抛出异常，每个请求都应捕获处理
    }
  },
  err => {
    setErrorMessage(err)
    return Promise.reject(err)
  }
)
