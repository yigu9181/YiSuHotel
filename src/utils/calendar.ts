const getMouth = (str) => String(str).split('/')[1]
const getDay = (str) => String(str).split('/')[2]
const getWeek = (str) => '日一二三四五六'.charAt(new Date(str).getDay())
// 计算两个日期之间的天数差
function getDaysBetween(dateStr1: string, dateStr2: string): number {
  // 将字符串转换为 Date 对象（支持 "2024-02-12" 或 "2024/02/12" 格式）
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
const formatDate = (date: Date) => {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}
const getDateDescription = (dateStr) => {
  if (!dateStr) return ''
  const { today, tomorrow, dayAfterTomorrow } = getTodayTomorrowDayAfter()
  if (dateStr === today) return '今天'
  if (dateStr === tomorrow) return '明天'
  if (dateStr === dayAfterTomorrow) return '后天'
  return ''
}
const getTodayTomorrowDayAfter = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(today.getDate() + 2)

  // 格式化日期为 YYYY/MM/DD 格式
  return {
    today: formatDate(today),
    tomorrow: formatDate(tomorrow),
    dayAfterTomorrow: formatDate(dayAfterTomorrow)
  }
}
export { getMouth, getDay, getWeek, getDaysBetween, formatDate, getDateDescription }
