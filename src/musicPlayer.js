class MusicPlayer {
  constructor (server) {
    this.server = server
  }

  start () {
    if (this.server.isPlaying || !this.server.player) return
    const np = this.server.nowPlaying = this.server.queue.shift()
    if (!np) return
    this.play(np)
  }

  play (np) {
    this.server.isPlaying = true
    this.server.player.play(np.track)
    this.server.player.once('end', this.end.bind(this))
    this.server.player.volume(this.server.volume)
    this.server.emit('now', np)
  }

  end (data) {
    this.server.isPlaying = false
    if (data.reason === 'REPLACED') return
    if (this.loop) this.server.queue.add(this.server.nowPlaying)
    if (this.server.queue.isLast) return this.server.leave()
    this.start()
  }
}

module.exports = MusicPlayer
