import { defineStore } from 'pinia'

type perf = {
  label: string | string[]
  times: number[]
  style: string
}
export const useTimeStore = defineStore('timeStore', () => {
  const perfTime: Record<string, perf> = {}
  const logsRes: Record<string, perf> = {}

  function logTime(label: string | string[], style = '') {
    const name = typeof label === 'string' ? label : label.join('')
    perfTime[name] = {
      label: label,
      times: [performance.now()],
      style: style
    }
  }

  function logEnd(label: string | string[]) {
    const name = typeof label === 'string' ? label : label.join('')
    if (!perfTime[name]) {
      console.warn(`${name} not logged`)
      return
    }

    perfTime[name].times.push(performance.now())
    logsRes[name] = perfTime[name]
  }

  function alignWord(des: string | string[], time: number, indent = 30) {
    let title
    let desStr
    let append

    if (Array.isArray(des)) {
      title = des[0]
      desStr = des.join('')
      append = des[1]
    } else {
      title = des
      desStr = des
      append = ''
    }

    const desHolder = desStr.replace(/%c/g, '')
    let gap = indent - desHolder.length - (~~time + '').length
    if (gap < 0) gap = 1
    const space = ' '.repeat(gap)
    return `${title + space + append + time} ms`
  }

  function logPerf() {
    const logs = Object.entries(logsRes).sort((a, b) => a[1].times[1] - b[1].times[1])
    for (const [, { label, times, style }] of logs) {
      const [start, end] = times
      console.log(alignWord(label, end - start), style)
    }
  }

  return { logTime, logEnd, logPerf }
})
