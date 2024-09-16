import axios from 'axios'
import jsonBig from 'json-bigint'
import { setupInterceptors } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    baseURL: import.meta.env.MODE == 'development' ? '' : import.meta.env.VITE_PROXY_TARGET,
    timeout: 0,
    // 自定义返回的元素数据,axios会默认用JSON.parse
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [
      function (data) {
        // 对 data 进行任意转换处理
        try {
          // 如果转换成功则返回转换的数据结果
          const json = jsonBig({
            storeAsString: true,
          })
          return json.parse(data)
        } catch (err) {
          return data
        }
      },
    ],
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  setupInterceptors(service)
  return service
}

export function convertToSnakeCase(str) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i)
    if (char === char.toUpperCase() && i > 0) {
      result += `_${char.toLowerCase()}`
    } else {
      result += char.toLowerCase()
    }
  }
  return result
}

export function formartParams(params) {
  // 构建目标格式的对象
  let formattedObject = {
    frontParams: [],
    pageNum: 0,
    pageSize: 0,
    sortField: '',
    sortType: '',
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (key !== 'ignore') {
      if (key != 'op') {
        if (formattedObject[key] != undefined || params.ignore?.includes(key)) {
          formattedObject[key] =
            key == 'sortField'
              ? convertToSnakeCase(value)
              : key == 'sortType'
              ? value.substring(0, value.indexOf('c') + 1)
              : value
        } else {
          value &&
            formattedObject.frontParams.push({
              cond: params.op?.[key] ?? 'like',
              field: convertToSnakeCase(key),
              value: value,
            })
        }
      }
    }
  })
  return formattedObject
}

export const request = createAxios()

// export const mockRequest = createAxios({
//   baseURL: '/mock-api',
// })
