const strToSec = (duration) => arrayToSec(strToArray(duration).reverse())
const strToArray = (duration) => duration.split(':').map(v => Number(v))
const secToArray = (duration) => {
  const result = [duration]
  let go = true
  do {
    const temp = Math.floor(result[result.length - 1] / 60)
    if (temp === 0) go = false
    result[result.length - 1] -= temp * 60
    result.push(temp)
  } while (go)

  return result.reverse().splice(1)
}

const arrayToSec = (durations) => {
  let result = 0
  let gap = 1

  for (const i of durations) {
    result += gap * i
    gap *= 60
  }

  return result
}

class MusicItem {
  constructor (obj) {
    if (obj.track) obj.track = obj.track
    if (obj.info) obj = obj.info

    this.link = obj.uri
    this.title = obj.song
    this.thumbnail = `https://img.youtube.com/vi/${obj.identifier}/default.jpg`
    this.views = obj.views
    this.secDuration = obj.length / 1000
    this.strDuration = secToArray(this.secDuration).join(':')
    this.secToArray = secToArray
    this.arrayToSec = arrayToSec
    this.author = {
      name: obj.author,
      link: obj.uri
    }
  }
}

module.exports = MusicItem
