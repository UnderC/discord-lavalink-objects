const fetch = require('node-fetch')
const URLRegExp = new RegExp(/(http|https):\/\/.*/gi)

class MusicSearcher {
  constructor (host, port, pass) {
    this.host = host
    this.port = port
    this.pass = pass
  }

  async search (query) {
    return await this._(`${URLRegExp.test(query) ? '' : 'ytsearch:'}${query}`)
  }

  async _ (query) {
    const result = await fetch(
      `http://${this.host}:${this.port}/loadtracks?identifier=${query}`,
      { headers: { Authorization: this.pass } }
    )

    return result.json()
  }

  /*
  playlist () {

  }
  */
}

module.exports = MusicSearcher
