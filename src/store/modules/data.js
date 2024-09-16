import { defineStore } from 'pinia'
import api from '@/api'
function formatLabel(list) {
  list.forEach((item) => {
    item['show'] = false
    item.customChecked = false
    item.indeterminate = false
    if (item.childList && item.childList.length != 0) formatLabel(item.childList)
  })
}
export const useDataStore = defineStore('data', {
  state: () => ({
    vipList: [],
    labelList: [],
    // roleList: [],
    tags: [
      { color: '#fff0f6', textColor: '#c41d7f', borderColor: '#ffadd2' },
      { color: '#fff1f0', textColor: '#cf1322', borderColor: '#ffa39e' },
      { color: '#fff7e6', textColor: '#d46b08', borderColor: '#ffd591' },
      { color: '#f6ffed', textColor: '#389e0d', borderColor: '#b7eb8f' },
      { color: '#e6fffb', textColor: '#08979c', borderColor: '#87e8de' },
      { color: '#e6f4ff', textColor: '#0958d9', borderColor: '#91caff' },
      { color: '#2b1d11', textColor: '#e89a3c', borderColor: '#593815' },
    ],
  }),
  getters: {},
  actions: {
    async init() {
      console.log('这里可以加载初始数据')
      // await this.getVipList()
      // await this.getLabelList()
      // await this.getAllRoles()
    },
    async getVipList() {
      const { data } = await api.getVipList()
      data.forEach((item) => {
        item.idInt = Number(item.id)
      })
      this.vipList = data
      return this.vipList
    },
    async getLabelList() {
      const { data } = await api.getLabelList()
      formatLabel(data)
      this.labelList = data
      return this.labelList
    },
    // async getAllRoles(up = false) {
    //   if (this.roleList.length == 0 || up) {
    //     const { data } = await api.getAllRoles()
    //     this.roleList = data
    //     return this.roleList
    //   }
    // },
    resetData() {
      this.$reset()
    },
  },
  persist: true,
})
