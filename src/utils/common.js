import dayjs from 'dayjs'
import { isUrl } from './is.js'

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}
/**
 * 计算时间差
 * @param {new Date()} date1
 * @param {new Date()} date2
 * @returns
 */
export function getTimeDifference(date1, date2) {
  var difference = Math.abs(date1.getTime() - date2.getTime())
  var millisecondsPerDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
  var days = Math.floor(difference / millisecondsPerDay)
  var hours = Math.floor((difference % millisecondsPerDay) / (60 * 60 * 1000))
  var minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000))
  var seconds = Math.floor((difference % (60 * 1000)) / 1000)
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }
}
/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  var context, args
  var previous = 0

  return function () {
    var now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    let context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 * @desc  睡一会儿，让子弹暂停一下
 * @param {number} time 毫秒数
 * @returns
 */
export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

/**
 * @param {HTMLElement} el
 * @param {Function} cb
 * @return {ResizeObserver}
 */
export function useResize(el, cb) {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getFilePath(url) {
  if (isUrl(url)) return url
  else return import.meta.env.VITE_PROXY_TARGET + url
}

export function saveFile(data, fileName = '用户模板', mimeType) {
  const blob = new Blob([data], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

/**
 * 生成随机手机号码
 *
 * 本函数通过随机选择手机号开头，并在后面添加8位随机数字来生成一个模拟的手机号码
 * 这样的生成方式有助于确保生成的手机号码格式正确，且在大多数情况下不会重复
 *
 * @returns {string} 返回一个格式正确的随机手机号码字符串
 */
export function generateRandomPhoneNumber() {
  // 定义常见的手机号开头
  const prefixes = ['13', '14', '15', '17', '18', '19']

  // 随机选择一个开头
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

  // 生成剩余的8位随机数字
  let phoneNumber = prefix
  for (let i = 0; i < 8; i++) {
    phoneNumber += Math.floor(Math.random() * 10) // 0-9的随机数字
  }

  return phoneNumber
}

/**
 * 生成一个随机密码
 * @param {number} length - 密码的长度
 * @returns {string} 生成的随机密码
 */
export function generateRandomPassword(length = 6) {
  // 定义包含所有可能用到的字符的字符串
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  // 初始化一个空字符串用于构建密码
  let password = ''

  // 循环length次，每次生成一个随机字符并添加到密码字符串中
  for (let i = 0; i < length; i++) {
    // 生成一个随机索引
    const randomIndex = Math.floor(Math.random() * characters.length)
    // 将随机索引对应的字符添加到密码中
    password += characters[randomIndex]
  }

  // 返回生成的密码
  return password
}
