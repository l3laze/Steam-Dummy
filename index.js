'use strict'

const fs = require('fs-extra')
const path = require('path')

function SteamDummy () {
  this.dummyPath = path.join('./', 'Dummy')
  this.steamID = '107311984'
  this.created = []
}

SteamDummy.prototype.makeDummy = function makeDummy (pathToDummy, force = false) {
  let tmp = null

  this.dummyPath = pathToDummy || this.dummyPath

  if (!force && fs.existsSync(this.dummyPath)) {
    return
  }

  try {
    if (!fs.existsSync(this.dummyPath)) {
      fs.mkdirsSync(this.dummyPath)
    }

    tmp = path.join(this.dummyPath, 'registry.vdf')
    fs.copySync(path.join(__dirname, 'registry.vdf'), tmp)
    this.created.push('registry')

    tmp = path.join(this.dummyPath, 'steamapps')
    if (!fs.existsSync(tmp)) {
      fs.mkdirsSync(tmp)
    }
    this.created.push('steamapps')

    tmp = path.join(this.dummyPath, 'steamapps', 'libraryfolders.vdf')
    fs.copySync(path.join(__dirname, 'steamapps', 'libraryfolders.vdf'), tmp)
    this.created.push('libraryfolders')

    tmp = path.join(this.dummyPath, 'appcache')
    if (!fs.existsSync(tmp)) {
      fs.mkdirsSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'appcache', 'appinfo.vdf')
    fs.copySync(path.join(__dirname, 'appcache', 'appinfo.vdf'), tmp)
    this.created.push('appinfo')

    tmp = path.join(this.dummyPath, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirsSync(tmp)
    }

    tmp = path.join(this.dummyPath, 'config', 'config.vdf')
    fs.copySync(path.join(__dirname, 'config', 'config.vdf'), tmp)
    this.created.push('config')

    tmp = path.join(this.dummyPath, 'config', 'loginusers.vdf')
    fs.copySync(path.join(__dirname, 'config', 'loginusers.vdf'), tmp)
    this.created.push('loginusers')

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, '7', 'remote')
    fs.mkdirsSync(tmp)

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, '7', 'remote', 'sharedconfig.vdf')
    fs.copySync(path.join(__dirname, 'userdata', `${this.steamID}`, '7', 'remote', 'sharedconfig.vdf'), tmp)
    this.created.push('sharedconfig')

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, 'config')
    fs.mkdirsSync(tmp)

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, 'config', 'localconfig.vdf')
    fs.copySync(path.join(__dirname, 'userdata', `${this.steamID}`, 'config', 'localconfig.vdf'), tmp)
    this.created.push('localconfig')

    tmp = path.join(this.dummyPath, 'userdata', `${this.steamID}`, 'config', 'shortcuts.vdf')
    fs.copySync(path.join(__dirname, 'userdata', `${this.steamID}`, 'config', 'shortcuts.vdf'), tmp)
    this.created.push('shortcuts')

    tmp = path.join(this.dummyPath, 'Steam.AppBundle', 'Steam', 'Contents', 'MacOS', 'skins')
    fs.mkdirsSync(tmp)
    this.created.push('skins')

    let fp

    let apps = fs.readdirSync(path.join(__dirname, 'steamapps'))

    apps.forEach(async (file) => {
      try {
        if (file.indexOf('.acf') !== -1) {
          fp = path.join(__dirname, 'steamapps', file)
          fs.copySync(fp, path.join(this.dummyPath, 'steamapps', file))
        }
      } catch (err) {
        throw new Error(err)
      }
    })
    this.created.push('appmanifest')
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = SteamDummy
