import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/busi/castleProtocol/queryPage', data),
  create: (data) => request.post('/busi/castleProtocol/add', data),
  update: (data) => request.post(`/busi/castleProtocol/update`, data),
}
