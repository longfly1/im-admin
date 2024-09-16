import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/busi/castleGame/queryPage', data),
  create: (data) => request.post('/busi/castleGame/add', data),
  update: (data) => request.post('/busi/castleGame/update', data),
  delete: (id) => request.delete(`/user/${id}`),
}
