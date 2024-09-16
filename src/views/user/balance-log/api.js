import { request } from '@/utils'

export default {
  create: (data) => request.post('/user', data),
  read: (params = {}) => request.post('/busi/CastleBalanceGiveLog/queryPage', { params }),
  update: (data) => request.patch(`/user/${data.id}`, data),
  delete: (id) => request.delete(`/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),
}
