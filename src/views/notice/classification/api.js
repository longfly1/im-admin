import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/busi/CastleAfficheCate/queryPage', data),
  create: (data) => request.post('/busi/CastleAfficheCate/add', data),
  update: (data) => request.put(`/busi/CastleAfficheCate`, data),
}
