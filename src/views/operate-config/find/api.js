import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/admin/find/page', data),
  create: (data) => request.post('/admin/find/create', data),
  update: (data) => request.post('/admin/find/update', data),
  delete: (id) => request.post(`/admin/find/delete`, { id }),
}
