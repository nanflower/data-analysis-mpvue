import Promise from '../plugins/es6-promise'
import urls from './api'

let max_request = 5
let requestFn = wx.request
let queue = requestQueue()
let eventEmit = eventHandler()

eventEmit.on('loading', (loading) => {
  if (loading) {
    wx.showLoading({
      title: '正在加载',
      mask: true,
      success: () => {},
      fail: () => {},
      complete: () => {}
    })
  } else {
    wx.hideLoading()
  }
})

// 请求方式检查
function requestTypeCheck(type) {
  switch (type) {
    case 'wx.request':
      max_request = 5
      break
    case 'wx.downloadFile':
      max_request = 10
      break
    case 'wx.uploadFile':
      max_request = 10
      break
    default:
      max_request = 9999999999
  }
}

// 获取微信请求方法
function getFunctionName(params) {
  let paramsArg = Object.keys(params)
  let fnType = ''

  if (paramsArg.indexOf('method')) {
    fnType = 'wx.request'
  } else if (paramsArg.indexOf('filePath')) {
    fnType = 'wx.uploadFile'
  } else {
    fnType = 'wx.downloadFile'
  }

  return fnType
}

// 设置cookie
function setCookieStr(res) {
  let arr = res.header['Set-Cookie'] && res.header['Set-Cookie'].split('')
  if (!arr) return

  let cookieObj = {}
  let key = []
  for (let i = 0; i < arr.length; i++) {
    key = arr[i].split('=')
    cookieObj[key[0]] = key[1]
  }

  const cookiePrev = wx.getStorageSync('COOKIE')
  const updatedCookie = cookiePrev ? Object.assign(cookiePrev, cookieObj) : cookieObj

  wx.setStorageSync('COOKIE', updatedCookie)
}

// 获取cookie
function getCookieStr() {
  const cookieObj = wx.getStorageSync('COOKIE')
  let cookieStr = ''

  for (let key in cookieObj) {
    if (cookieObj.hasOwnProperty(key))
      cookieStr += `${key}=${cookieObj[key]}`
  }
  if (cookieStr) cookieStr.slice(0, cookieStr.length - 1)

  return cookieStr
}

// 参数扩展方法
function extend() {
  for (let i = 1; i < arguments.length; i++)
    for (let key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key]
  return arguments[0]
}

// 请求参数扩展
function extendParams(params) {
  const cookieStr = getCookieStr()
  let defaultParams = {
    url: '',
    method: 'POST',
    dataType: 'json',
    data: {},
    header: {
      'content-Type': 'application/json charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': `${cookieStr}`
    },
    success: () => {},
    fail: () => {},
    complete: () => {}
  }

  return extend({}, defaultParams, params)
}

// 请求队列
function requestQueue() {
  let proto = Queue.prototype

  // 请求参数、队列、loading队列
  function Queue() {
    this.map = {}
    this.queue = []
    this.loading = []
  }

  // 请求入队列，生成请求标示
  proto.push = (params) => {
    params.id = +new Date()

    while (this.queue.indexOf(params.id) > -1 || this.loading.indexOf(params.id) > -1) {
      params.id += Math.random() * 10 >> 0
    }

    this.queue.push(params.id)
    this.map[params.id] = params
  }

  proto.next = () => {
    if (this.queue.length < 1) {
      if (this.loading.length < 1) {
        // 队列为空关闭loading
        eventEmit.emit('loading', false)
      }
      return
    }

    if (this.loading.length < max_request) {
      let head = this.queue.shift()
      let params = this.map[head]
      let oldComplete = params.complete

      // 请求完成出队列，删除请求标示
      params.complete = (...args) => {
        this.loading.splice(this.loading.indexOf(params.id), 1)
        delete this.map[params.id]
        oldComplete && oldComplete.apply(params, args)
        this.next()
      }

      this.loading.push(params.id)
      eventEmit.emit('loading', true)
      return requestFn(params)
    }
  }

  proto.request = (params) => {
    this.push(params)

    return this.next()
  }

  return new Queue()
}

// 事件状态收集
function eventHandler() {
  let proto = Event.prototype

  function Event() {
    this._cbs = {}
  }

  proto.on = (event, fn) => {
    if (typeof fn !== 'function') {
      console.error('fn must be a function')
      return
    }

    this._cbs = this._cbs || {}
    if (this._cbs[event]) this._cbs[event].push(fn)
  }

  proto.emit = (event) => {
    this._cbs = this._cbs || {}
    let callbacks = this._cbs[event]
    let args
    if (callbacks) {
      callbacks = callbacks.slice(0)
      args = [].slice.call(arguments, 1)
      for (let i = 0, len = callbacks.length; i < len; i++) {
        callbacks[i].apply(null, args)
      }
    }
  }

  return new Event()
}

// promise请求封装
function promiseRequest(params) {
  return new Promise((resolve, reject) => {
    ['success', 'fail', 'complete'].map((status) => {
      params[status] = (res) => {
        if (status === 'success') {
          setCookieStr(res)
          resolve(res)
        } else if (status === 'fail') {
          reject(res)
        }
      }
    })
    queue.request(params)
  })
}

// 可调用公共请求
export default function request(apiName = '', params = {}) {
  let url = ''
  if (urls.hasOwnProperty(apiName)) {
    url = urls[apiName]
  } else {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '不存在的请求api [' + apiName + ']',
      success: function (res) {}
    })
    return
  }

  // 设置最大连接数
  requestTypeCheck(getFunctionName(params))

  params.url = url
  return promiseRequest(extendParams(params))
}
