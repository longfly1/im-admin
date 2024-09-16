import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/admin/wallet/withhold/page`, formartParams(data)),
  update: (data) => request.put(`/capi/admin/wallet/withhold`, data),
}
