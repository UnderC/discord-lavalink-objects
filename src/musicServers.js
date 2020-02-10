const lavalink = require('discord.js-lavalink')
const MusicServer = require('./musicServer')

class MusicServers {
  constructor (client, nodes, options) {
    this.servers = new Map()
    this.client = client
    this.nodes = nodes
    this.playerManager = new lavalink.PlayerManager(this.client, this.nodes, options)
  }

  get (gID) {
    const server = this.servers.get(gID)
    if (!server) return this.set(gID)
    return server
  }

  set (gID, server) {
    const here = server || new MusicServer(gID, this.playerManager)
    this.servers.set(gID, here)
    return here
  }

  del (gID) {
    this.get(gID).removeAllListeners()
    this.servers.delete(gID)
    this.handlers.delete(gID)
  }
}

module.exports = MusicServers
