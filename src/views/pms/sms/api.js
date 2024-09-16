

import { request } from '@/utils'

export default {

  read: (params = {}) => request.get('/busi/SmsLog/list', { params }),

}
