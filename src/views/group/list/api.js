import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/app/roomGroup/page`, formartParams(data)),
  create: (data) => request.post('/capi/app/roomGroup/addAppRoomGroup', data),
  update: (data) => request.post(`/capi/app/roomGroup/updateAppRoomGroup`, data),
  delete: (id) => request.post(`/capi/app/roomGroup/delAppRoomGroup`, { id }),
  getConfig: (id) => request.get(`/capi/app/group/getById?groupId=${id}`),
  updateConfig: (data) => request.put(`/capi/app/group/editGroupConfig`, data),
  resetFinance: () => request.post(`capi/group/config/resetFinance`),
  resetFinanceByGroupId: () => request.post(`/capi/group/config/resetFinanceByGroupId`),
}
