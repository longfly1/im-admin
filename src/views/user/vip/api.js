import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/app/vipLevel/page`, formartParams(data)),
  create: (data) => request.post('/capi/app/vipLevel/add', data),
  update: (data) => request.post(`/capi/app/vipLevel/update`, data),
  delete: (id) => request.post(`/capi/app/vipLevel/delete`, { id }),
}
