import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/admin/emote/page`, formartParams(data)),
  create: (data) => request.post('/admin/emote/create', data),
  update: (data) => request.post(`/admin/emote/update`, data),
  delete: (id) => request.post(`/admin/emote/delete`, { id }),
}
