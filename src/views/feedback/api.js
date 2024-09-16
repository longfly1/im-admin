import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/admin/feedback/getGroupConfigAll`, formartParams(data)),
  delete: (id) => request.post(`/capi/admin/feedback/delete`, { id }),
}
