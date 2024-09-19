import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => {
    data.type = data.fromType == 4 ? 1 : data.type
    return request.post(`/capi/app/roomGroup/getAppListRoomGroupMember`, formartParams(data))
  },
  create: (data) => request.post('/capi/app/roomGroup/addAppRoomGroupMember', data),
  update: (data) => request.post('/capi/app/roomGroup/updateAppRoomGroupMember', data),
  delete: (id) => request.post(`/capi/app/roomGroup/delAppRoomGroupMember`, { id }),
  addOther: (data) => request.post(`/capi/app/roomGroup/saveCrawlerMember`, data),
}
