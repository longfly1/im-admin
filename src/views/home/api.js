import { request, formatDate } from '@/utils'

export default {
  readTop: () => request.post('/busi/home/getPlatformRegisterReport'),
  readRight: () => request.post('/busi/home/getPlatformDataStatistics'),
  readCard: (data) =>
    request.post('/busi/home/getFlashCardTradeStat', { month: formatDate(data.time, 'YYYY-MM') }),
  readGame: (data) =>
    request.post('/busi/home/getGameStat', { month: formatDate(data.time, 'YYYY-MM') }),
}
