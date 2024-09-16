import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/admin/wallet/recharge/page`, formartParams(data)),
  update: (data) => request.put(`/capi/admin/wallet/recharge`, data),
}
