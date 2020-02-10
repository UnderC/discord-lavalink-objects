const events = require('events')
const MusicQueue = require('./musicQueue')
const MusicPlayer = require('./musicPlayer')

class MusicServer extends events.EventEmitter {
  constructor (gID, playerManager) {
    super()
    this.guild = gID
    this.playerManager = playerManager
    this.player = null
    this.isPlaying = false
    this.skipSafe = false
    this.queue = new MusicQueue()
    this.nowPlaying = null
    this.volume = 0.5
    this.repeat = false
    this.handled = false
    this._ = new MusicPlayer(this)
  }

  join (voiceChannel) {
    if (this.player) return
    this.player = this.playerManager({
      guild: this.guild,
      channel: voiceChannel.id,
      host: this.playerManager.nodes[0].host
    })
  }

  leave () {
    if (!this.player) return
    this.player.disconnect()

    this.stop()
    this.clear()
    return true
  }

  move (voiceChannel) {
    const here = this.player.voiceConnection.channel.calculatedPosition
    if (here === voiceChannel.calculatedPosition) return

    this.leave()
    this.join(voiceChannel)
    return true
  }

  stop () {
    if (!this.player) return
    this.skipSafe = true
    this.player.end()
    return true
  }

  setVolume (vol) {
    if (!vol) return
    const before = this.volume
    this.volume = vol % 1 === 0 ? vol / 100 : vol
    if (this.player) this.player.setVolume(this.volume)
    return [before, this.volume]
  }

  stateToggle () {
    if (!this.player) return
    this.player.pause(!this.player.paused)
    return this.player.paused
  }

  skip () {
    if (!this.player) return
    this.player.end()
    return true
  }

  clear () {
    delete this.player
  }
}

module.exports = MusicServer
