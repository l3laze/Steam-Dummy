'use strict'

const fs = require('fs')
const path = require('path')

let dummyPath = path.join('./', 'Dummy')
let steamID = '107311984'

function parseArgs () {
  let args = process.argv.splice(2)

  if (args) {
    // ...
  }
}

function run () {
  parseArgs()
  let tmp = null
  try {
    if (!fs.existsSync(dummyPath)) {
      fs.mkdirSync(dummyPath)
    }

    tmp = path.join(dummyPath, 'appcache')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'appcache', 'appinfo.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    fs.copyFileSync(path.join('./', 'appcache', 'appinfo.vdf'), tmp)

    tmp = path.join(dummyPath, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'config', 'config.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    fs.copyFileSync(path.join('./', 'config', 'config.vdf'), tmp)

    tmp = path.join(dummyPath, 'config', 'loginusers.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    fs.copyFileSync(path.join('./', 'config', 'loginusers.vdf'), tmp)

    tmp = path.join(dummyPath, 'userdata')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`)
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, '7')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, '7', 'remote')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, '7', 'remote', 'sharedconfig.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    fs.copyFileSync(path.join('./', 'userdata', `${steamID}`, '7', 'remote', 'sharedconfig.vdf'), tmp)

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSyncSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, 'config', 'localconfig.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    fs.copyFileSync(path.join('./', 'userdata', `${steamID}`, 'config', 'localconfig.vdf'), tmp)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

console.info(`Using NodeJS ${process.versions.node}...`)

run()
