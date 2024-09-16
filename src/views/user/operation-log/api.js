import { request } from '@/utils'

export default {

  read: (params = {}) => request.get('/busi/CastleUserLog/list', { params }),

}
