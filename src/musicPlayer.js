class MusicPlayer {
  constructor (server) {
    this.server = server
  }

  start () {
    const np = this.server.nowPlaying = this.server.queue.shift()
    if (!np) return
    this.play(np)
  }

  play (np) {
    this.server.player.play(np.track)
    this.server.player.once('end', this.end.bind(this))
    this.server.player.volume(this.server.volume)
  }

  end (data) {
    if (data.reason === 'REPLACED') return
    if (this.loop) this.server.queue.add(this.server.nowPlaying)
    if (this.server.queue.isLast) return this.server.leave()
    this.start()
  }
}

module.exports = MusicPlayer
