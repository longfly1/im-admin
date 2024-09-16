import { request } from '@/utils'

export default {
  fetchData: (data) => request.get('/capi/admin/config/public/config', data),
  create: (data) => request.post('/capi/admin/config/public/config/addKey', data),
  update: (data) => request.post('/capi/admin/config/public/config/updateKey', data),
  delete: (id) => request.post(`/capi/admin/config/public/config/deleteKey`, { id }),
}
