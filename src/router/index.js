import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { useAuthStore, usePermissionStore, useUserStore, useDataStore } from '@/store'
import { getUserInfo, getPermissions } from '@/store/helper'
import { basicRoutes } from './basic-routes'

export const router = createRouter({
  history:
    import.meta.env.VITE_USE_HASH === 'true' ? createWebHashHistory('/') : createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app) {
  try {
    await initUserAndPermissions()
  } catch (error) {
    console.error('🚀 初始化失败', error)
  }
  setupRouterGuards(router)
  app.use(router)
}

export async function initUserAndPermissions() {
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const dataStore = useDataStore()

  if (!authStore.accessToken) {
    const route = unref(router.currentRoute)
    if (route.path !== '/login') {
      router.replace({
        path: '/login',
        query: route.query,
      })
    }
    return
  }
  const user = userStore.userInfo || (await getUserInfo())
  console.log(user)

  const [permissions] = await Promise.all([getPermissions(user.role)])
  if (user) userStore.setUser(user)
  dataStore.init()
  permissionStore.setPermissions(permissions)
  const routeComponents = import.meta.glob('@/views/**/*.vue')
  permissionStore.accessRoutes.forEach((route) => {
    route.component = routeComponents[route.component] || undefined
    !router.hasRoute(route.name) && router.addRoute(route)
  })
}
