'use strict'

const fs = require('fs')
const path = require('path')

function SteamDummy () {
  this.dummyPath = path.join('./', 'Dummy')
  this.steamID = '107311984'
}

SteamDummy.prototype.makeDummy = async function makeDummy (pathToDummy) {
  let tmp = null

  this.dummyPath = pathToDummy || this.dummyPath

  try {
    if (!fs.existsSync(this.dummyPath)) {
      fs.mkdirSync(this.dummyPath)
    }

    tmp = path.join(this.dummyPath, 'registry.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'registry.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'steamapps')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'steamapps', 'libraryfolders.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'steamapps', 'libraryfolders.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'appcache')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'appcache', 'appinfo.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'appcache', 'appinfo.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'config', 'config.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'config', 'config.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'config', 'loginusers.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'config', 'loginusers.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'userdata')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`)
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, '7')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, '7', 'remote')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, '7', 'remote', 'sharedconfig.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'userdata', `${this.steamID}`, '7', 'remote', 'sharedconfig.vdf'), tmp)

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, 'config', 'localconfig.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    await copyThisFile(path.join(__dirname, 'userdata', `${this.steamID}`, 'config', 'localconfig.vdf'), tmp)
  } catch (err) {
    if (err.message.indexOf('ENOENT') !== -1) {
      console.error(err.message)
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

async function copyThisFile (from, to) {
  function done (err) {
    if (err) {
      throw err
    }
  }

  let reader = fs.createReadStream(from)
  reader.on('error', function (err) {
    done(err)
  })

  let writer = fs.createWriteStream(to)
  writer.on('error', function (err) {
    done(err)
  })

  writer.on('close', function (err) {
    if (err) {
      done(err)
    } else {
      done()
    }
  })

  reader.pipe(writer)
}

module.exports = SteamDummy
