import { request, formartParams } from '@/utils'

export default {
  fetchData: (data) => request.post(`/capi/app/user/page`, formartParams(data)),
  create: (data) => request.post('/capi/app/user/create', data),
  update: (data) => {
    // eslint-disable-next-line no-unused-vars
    const { phone, ...params } = data
    return request.post(`/capi/app/user/update`, { data: params })
  },
  delete: (id) => request.post(`/capi/app/user/delete`, { id }),
  download: () => request.get(`/capi/app/user/downloadExamples`),
  import: (formData, otherConfig) =>
    request.post(`/capi/app/user/fileImportUser`, formData, otherConfig),
  editPsd: ({ id, type, password }) =>
    request.post(`/capi/app/user/updatePwd`, {
      userId: id,
      type,
      password,
    }),
}
