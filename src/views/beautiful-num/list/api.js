import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/admin/liang/item/page`, formartParams(data)),
  create: (data) => request.post('/capi/admin/liang/item', data),
  update: (data) => request.put(`/capi/admin/liang/item`, data),
  delete: (id) => request.delete(`/capi/admin/liang/item`, { data: { id } }),
  setUse: (data) => request.put(`/capi/admin/liang/item/set`, data),
}
