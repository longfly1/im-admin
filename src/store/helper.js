import { basePermissions } from '@/settings'
import { asyncRoutes } from '@/router/async-routes'
import api from '@/api'

function hasPermission(role, route) {
  if (route.roles) {
    return route.roles.includes(role)
  } else {
    return true
  }
}

function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, account, role } = res.data || {}
  return {
    id,
    account,
    // avatar: profile?.avatar,
    // nickName: profile?.nickName,
    // gender: profile?.gender,
    // address: profile?.address,
    // email: profile?.email,
    role,
    // currentRole,
  }
}

export async function getPermissions(role) {
  let asyncPermissions = []
  try {
    if (role == 'admin') asyncPermissions = asyncRoutes
    else asyncPermissions = filterAsyncRoutes(asyncRoutes, role)
  } catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
