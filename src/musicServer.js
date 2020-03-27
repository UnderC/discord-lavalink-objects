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
    this.volume = 50
    this.repeat = false
    this.handled = false
    this._ = new MusicPlayer(this)
  }

  join (voiceChannel) {
    if (this.player) return
    this.player = this.playerManager.join({
      guild: this.guild,
      channel: voiceChannel.id,
      host: this.playerManager.nodes.keys().next().value
    })
  }

  leave () {
    if (!this.player) return
    this.stop()
    this.player.disconnect()
    this.player.destroy()
    this.playerManager.leave(this.guild)

    this.clear()
    delete this.player
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
    this.player.stop()
    return true
  }

  setVolume (vol) {
    if (!vol) return
    const before = this.volume
    this.volume = vol % 1 === 0 ? vol : vol * 100
    if (this.player) this.player.volume(this.volume)
    return [before / 100, this.volume / 100]
  }

  stateToggle () {
    if (!this.player) return
    this.player.pause(!this.player.paused)
    return this.player.paused
  }

  skip () {
    if (!this.player) return
    this.player.stop()
    return true
  }

  clear () {
    delete this.player
  }
}

module.exports = MusicServer
