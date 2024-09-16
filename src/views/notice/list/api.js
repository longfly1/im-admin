import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/busi/CastleAffiche/queryPage', data),
  create: (data) => request.post('/busi/CastleAffiche/add', data),
  update: (data) => request.post(`/busi/CastleAffiche/update`, data),
  delete: (id) => request.delete(`/user/${id}`),
}
