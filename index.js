'use strict'

const fs = require('fs')
const path = require('path')

let dummyPath = path.join('./', 'Dummy')
let steamID = '107311984'
let cli = require('cli')
let options = cli.parse({
  path: ['p', 'Path to create dummy at.', 'path', null]
})

function run () {
  let tmp = null

  console.info(JSON.stringify(options, null, 2))
  dummyPath = options.path || dummyPath

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
    copyThisFile(path.join('./', 'appcache', 'appinfo.vdf'), tmp)

    tmp = path.join(dummyPath, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'config', 'config.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    copyThisFile(path.join('./', 'config', 'config.vdf'), tmp)

    tmp = path.join(dummyPath, 'config', 'loginusers.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    copyThisFile(path.join('./', 'config', 'loginusers.vdf'), tmp)

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
    copyThisFile(path.join('./', 'userdata', `${steamID}`, '7', 'remote', 'sharedconfig.vdf'), tmp)

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, 'config')
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }

    tmp = path.join(dummyPath, 'userdata', `${steamID}`, 'config', 'localconfig.vdf')
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, '')
    }
    copyThisFile(path.join('./', 'userdata', `${steamID}`, 'config', 'localconfig.vdf'), tmp)
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

run()
