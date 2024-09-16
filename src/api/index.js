import { request } from '@/utils'

export default {
  // 获取用户信息
  getUser: () => request.get('/admin/user/detail'),
  // 刷新token
  refreshToken: () => request.get('/auth/refresh/token'),
  // 登出
  logout: () => request.post('/auth/logout'),
  // 切换当前角色
  switchCurrentRole: (role) => request.post(`/auth/current-role/switch/${role}`),
  // 获取角色权限
  getRolePermissions: () => request.get('/role/permissions/tree'),
  // 验证菜单路径
  validateMenuPath: (path) => request.get(`/permission/menu/validate?path=${path}`),
  // 通用获取配置
  getConfig: (data) => request.post('/system/config/group_list', { groupType: data }),
  // 通用配置更新
  batchUpdateValue: (data) => request.post('/system/config/batchUpdateValue', data),
  // 文件上传
  upload: (formData, otherConfig) =>
    request.post('/capi/admin/oss/upload/image', formData, otherConfig),
  // 发布公告
  notification: (data) => request.post('/capi/admin/message/send', data),
}
