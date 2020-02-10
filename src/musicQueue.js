const MusicItem = require('./musicItem')

class MusicQueue {
  constructor () {
    this.queue = []
  }

  add (raw) {
    if (raw) {
      const song = new MusicItem(raw)
      this.queue.push(song)
    }
    return this
  }

  fix (song) {
    if (song) this.queue = [song].concat(this.queue)
    return this
  }

  shift () {
    return this.queue.shift()
  }

  get isLast () {
    return !this.queue.length
  }
}

module.exports = MusicQueue
