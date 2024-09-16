import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/admin/liang/name/page`, formartParams(data)),
  create: (data) => request.post('/capi/admin/liang/name', data),
  update: (data) => request.put(`/capi/admin/liang/name`, data),
  delete: (id) => request.delete(`/capi/admin/liang/name`, { data: { id } }),
}
