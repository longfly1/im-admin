import { request, formartParams } from '@/utils'

export default {
  create: (data) => request.post('/admin/user/add', data),
  read: (data = {}) => request.post('/admin/user/list', formartParams(data)),
  update: (data) => request.post(`/admin/user/update`, data),
  // updateStatus: (data) => request.put(`/system/user/changeStatus`, data),
  delete: (id) => request.post(`/admin/user/delete`, { id }),
  // resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

  // getAllRoles: () => request.get('/system/user/'),
}
