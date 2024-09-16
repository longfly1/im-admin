import { defineStore } from 'pinia'
import avatar from '@/assets/images/avatar.jpeg'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  getters: {
    userId() {
      return this.userInfo?.id
    },
    account() {
      return this.userInfo?.account
    },
    nickName() {
      return this.userInfo?.nickName
    },
    avatar() {
      return avatar
    },
    currentRole() {
      return this.userInfo?.currentRole || {}
    },
    role() {
      return this.userInfo?.role || []
    },
    token() {
      return this.userInfo?.token
    },
  },
  actions: {
    setUser(user) {
      console.log(user)

      this.userInfo = user
    },
    resetUser() {
      this.$reset()
    },
  },
  persist: [
    {
      paths: [],
      storage: localStorage,
    },
    {
      paths: [],
      storage: sessionStorage,
    },
  ],
})
