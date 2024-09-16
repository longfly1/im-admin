import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/admin/emotecontent/page`, formartParams(data)),
  create: (data) => request.post('/admin/emotecontent/create', data),
  update: (data) => request.post(`/admin/emotecontent/update`, data),
  delete: (id) => request.post(`/admin/emotecontent/delete`, { id }),
}
