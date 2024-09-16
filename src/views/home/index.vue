<template>
  <AppPage>
    <n-grid :x-gap="8" :y-gap="8" :cols="24" item-responsive responsive="screen">
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="今日注册人数">
            <n-number-animation :from="0" :to="topData.todayRegister" />
            <template #suffix>
              <n-tag round :bordered="false" type="success" class="align-middle">
                <span class="flex items-center">
                  +30%
                  <i class="i-fe:chevron-up" />
                </span>
              </n-tag>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="平台用户">
            <n-number-animation :from="0" :to="topData.online" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="在线人数">
            <n-number-animation :from="0" :to="topData.online" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="VIP人数">
            <n-number-animation :from="0" :to="topData.online" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <!-- <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="今日充值订单数">
            <n-number-animation :from="0" :to="topData.todayGive" />
            <template #suffix><span class="text-6xl">笔</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="今日充值订单总额">
            <n-number-animation :from="0" :to="topData.todayGive" />
            <template #suffix><span class="text-6xl">$</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="今日提现订单数">
            <n-number-animation :from="0" :to="topData.todayGive" />
            <template #suffix><span class="text-6xl">笔</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="12 s:8 m:6 l:6">
        <n-card hoverable header-style="padding-bottom:0" content-style="padding: 10px">
          <n-statistic tabular-nums label="今日提现订单总额">
            <n-number-animation :from="0" :to="topData.todayGive" />
            <template #suffix><span class="text-6xl">$</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item> -->
      <n-grid-item span="24 s:24 m:18 l:18">
        <n-card hoverable title="⚡️ 充值/提现统计" segmented>
          <template #header-extra>
            <n-date-picker
              v-model:value="cardDate"
              type="month"
              clearable
              @update:value="onChangeDate('cardDate')"
            />
          </template>
          <VChart :option="cardOption" :init-options="{ height: 400 }" autoresize />
        </n-card>
      </n-grid-item>
      <n-grid-item span="24 s:24 m:6 l:6">
        <n-card hoverable title="⚡️ 数据统计" segmented class="h-full">
          <n-grid x-gap="12" :cols="1">
            <n-gi>
              <n-statistic tabular-nums label="今日充值订单数">
                <div class="inline-block">
                  <n-h2 prefix="bar" type="info">
                    <n-number-animation :from="0" :to="20" />
                  </n-h2>
                </div>
                <template #suffix><span class="text-6xl">笔</span></template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic tabular-nums label="今日充值订单总额">
                <div class="inline-block">
                  <n-h2 prefix="bar" type="error">
                    <n-number-animation :from="0" :to="20" />
                  </n-h2>
                </div>
                <template #suffix><span class="text-6xl">$</span></template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic tabular-nums label="今日提现订单数">
                <div class="inline-block">
                  <n-h2 prefix="bar" type="warning">
                    <n-number-animation :from="0" :to="20" />
                  </n-h2>
                </div>
                <template #suffix><span class="text-6xl">笔</span></template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic tabular-nums label="今日提现订总额">
                <div class="inline-block">
                  <n-h2 prefix="bar" type="warning">
                    <n-number-animation :from="0" :to="20" />
                  </n-h2>
                </div>
                <template #suffix><span class="text-6xl">$</span></template>
              </n-statistic>
            </n-gi>
          </n-grid>
        </n-card>
      </n-grid-item>
      <n-grid-item span="24 s:24 m:18 l:18">
        <n-card hoverable title="⚡️ 会员开通统计" segmented>
          <template #header-extra>
            <n-date-picker
              v-model:value="gameDate"
              type="month"
              clearable
              @update:value="onChangeDate('gameDate')"
            />
          </template>
          <VChart :option="gameOption" :init-options="{ height: 400 }" autoresize />
        </n-card>
      </n-grid-item>
      <n-grid-item span="24 s:24 m:6 l:6">
        <n-card hoverable title="⚡️ 当前用户余额排行" segmented class="h-full">
          <p>查询用户余额排行</p>
        </n-card>
      </n-grid-item>
    </n-grid>
  </AppPage>
</template>

<script setup>
// import { useUserStore } from '@/store'
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import api from './api.js'
import { formatDate } from '@/utils'

// const userStore = useUserStore()
const instance = getCurrentInstance()
console.log(instance)

onMounted(() => {
  readTop()
  readRight()
  readCard()
  readGame()
})

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

// const message = $message

const topData = ref({})
function readTop() {
  api.readTop().then((result) => {
    topData.value = result.data
  })
}
var rightData = ref(null)
function readRight() {
  api.readRight().then((result) => {
    rightData.value = result.data
  })
}

function onChangeDate(type) {
  console.log(instance.setupState[type])
  switch (type) {
    case 'cardDate':
      readCard()
      break
    case 'gameDate':
      readGame()
      break

    default:
      break
  }
}

const cardOption = ref({})
const cardDate = ref(new Date())
function readCard() {
  if (!cardDate.value) return
  api.readCard({ time: cardDate.value }).then((result) => {
    let title = []
    let date = []
    let data = {}
    result.data.caseList.forEach((cardItem) => {
      title.push(cardItem.title)
      date = []
      result.data.dataMap[cardItem.id].forEach((item) => {
        date.push(formatDate(item.date, 'MM-DD'))
        if (!data[cardItem.id]) data[cardItem.id] = []
        else data[cardItem.id].push(item.cardNum)
      })
    })
    cardOption.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside', // 内置型数据区域缩放
          start: 0, // 数据窗口的起始位置，表示30%的位置
          end: 100, // 数据窗口的结束位置，表示70%的位置
        },
        {
          type: 'slider', // 滑动条型数据区域缩放
          start: 0, // 数据窗口的起始位置，表示%的位置
          end: 100, // 数据窗口的结束位置，表示70%的位置
        },
      ],
      legend: {
        top: '5%',
        data: title,
      },
      xAxis: [
        {
          type: 'category',
          data: date,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: result.data.caseList.map((item) => {
        return {
          name: item.title,
          type: 'line',
          smooth: true,
          data: data[item.id],
        }
      }),
    }
  })
}
const gameOption = ref({})
const gameDate = ref(new Date())
function readGame() {
  if (!gameDate.value) return
  api.readGame({ time: gameDate.value }).then((result) => {
    let title = []
    let date = []
    let data = {}
    result.data.caseList.forEach((cardItem) => {
      title.push(cardItem.title + '累计投入')
      title.push(cardItem.title + '累计获得')
      // title.push(cardItem.title + '服务费')
      title.push(cardItem.title + '奖励')
      title.push(cardItem.title + '盈亏')
      result.data.dataMap[`${cardItem.id}`].forEach((item) => {
        date.push(formatDate(item.date, 'MM-DD'))
        if (!data[`${cardItem.id}_downBalance`]) data[`${cardItem.id}_downBalance`] = []
        else data[`${cardItem.id}_downBalance`].push(item.downBalance)

        if (!data[`${cardItem.id}_winBalance`]) data[`${cardItem.id}_winBalance`] = []
        else data[`${cardItem.id}_winBalance`].push(item.winBalance)

        if (!data[`${cardItem.id}_platPhase`]) data[`${cardItem.id}_platPhase`] = []
        else data[`${cardItem.id}_platPhase`].push(item.platPhase)

        if (!data[`${cardItem.id}_commissionBalance`]) data[`${cardItem.id}_commissionBalance`] = []
        else data[`${cardItem.id}_commissionBalance`].push(item.commissionBalance)

        if (!data[`${cardItem.id}_platWin`]) data[`${cardItem.id}_platWin`] = []
        else
          data[`${cardItem.id}_platWin`].push(
            (item.downBalance - item.winBalance - item.commissionBalance).toFixed(2)
          )
      })
    })
    gameOption.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside', // 内置型数据区域缩放
          start: 0, // 数据窗口的起始位置，表示30%的位置
          end: 100, // 数据窗口的结束位置，表示70%的位置
        },
        {
          type: 'slider', // 滑动条型数据区域缩放
          start: 0, // 数据窗口的起始位置，表示30%的位置
          end: 100, // 数据窗口的结束位置，表示70%的位置
        },
      ],
      legend: {
        top: '0%',
        data: title,
      },
      xAxis: [
        {
          type: 'category',
          data: date,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series: [
        {
          name: title[0],
          type: 'bar',
          smooth: true,
          data: data['1_downBalance'],
        },
        {
          name: title[1],
          type: 'bar',
          smooth: true,
          data: data['1_winBalance'],
        },
        {
          name: title[2],
          type: 'bar',
          smooth: true,
          data: data['1_commissionBalance'],
        },
        {
          name: title[3],
          type: 'line',
          smooth: true,
          data: data['1_platWin'],
        },
        {
          name: title[4],
          type: 'bar',
          smooth: true,
          data: data['2_downBalance'],
        },
        {
          name: title[5],
          type: 'bar',
          smooth: true,
          data: data['2_winBalance'],
        },
        {
          name: title[6],
          type: 'bar',
          smooth: true,
          data: data['2_commissionBalance'],
        },
        {
          name: title[7],
          type: 'line',
          smooth: true,
          data: data['2_platWin'],
        },
        {
          name: title[8],
          type: 'bar',
          smooth: true,
          data: data['3_downBalance'],
        },
        {
          name: title[9],
          type: 'bar',
          smooth: true,
          data: data['3_winBalance'],
        },
        {
          name: title[10],
          type: 'bar',
          smooth: true,
          data: data['3_commissionBalance'],
        },
        {
          name: title[11],
          type: 'line',
          smooth: true,
          data: data['3_platWin'],
        },
      ],
    }
  })
}
</script>
