import { useAuthStore, useUserStore } from '@/store'
import { initUserAndPermissions } from '../index'
// import api from '@/api'

const WHITE_LIST = ['/login', '/404']
export function createPermissionGuard(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    const userStore = useUserStore()
    const role = userStore.role

    /** 没有token */
    if (!token) {
      if (WHITE_LIST.includes(to.path)) return true
      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }
    if (!role || role.length === 0) {
      await initUserAndPermissions()
    }

    // 有token的情况
    if (to.path === '/login') return { path: '/' }
    if (WHITE_LIST.includes(to.path)) return true

    const routes = router.getRoutes()
    if (routes.find((route) => route.name === to.name)) return true

    // 判断是无权限还是404
    // const { data: hasMenu } = await api.validateMenuPath(to.path)
    const { data: hasMenu } = true
    return hasMenu
      ? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
      : { name: '404', query: { path: to.fullPath } }
  })
}
