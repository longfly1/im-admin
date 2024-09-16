/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/system/role', data),
  read: (params = {}) => request.get('/system/role/list', { params }),
  update: (data) => request.put(`/system/role`, data),
  delete: (id) => request.delete(`/system/role/${id}`),
  updateStatus: (data) => request.put(`/system/role/changeStatus`, data),
  getAllPermissionTree: () => request.get('/system/menu/treeselect'),
  getAllUsers: (params = {}) => request.get('/user', { params }),
  addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data),
}
