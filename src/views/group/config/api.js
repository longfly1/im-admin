import { request } from '@/utils'

export default {
  fetchData: (data) => request.post('/busi/CastileCard/queryPage', data),
}
