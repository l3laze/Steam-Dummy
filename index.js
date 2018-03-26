'use strict'

const fse = require('fs-extra')
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')
const chmodrAsync = require('util').promisify(require('chmodr'))

function SteamDummy (pathTo) {
  this.dummyPath = path.join('./', 'Dummy')
  this.steamID = '107311984'
  this.created = []
}

SteamDummy.prototype.makeDummy = async function makeDummy (pathToDummy, force = false) {
  this.dummyPath = pathToDummy || this.dummyPath

  try {
    if (!force && await fse.exists(this.dummyPath)) {
      return
    }

    const opts = {
      overwrite: true
    }

    switch (platform) {
      case 'darwin':
        await fse.copy(path.join(__dirname, 'data', 'Mac'), this.dummyPath, opts)
        break

      case 'linux':
        await fse.copy(path.join(__dirname, 'data', 'Linux'), this.dummyPath, opts)
        break

      case 'win32':
        await fse.copy(path.join(__dirname, 'data', 'Windows'), this.dummyPath, opts)

        await fse.unlink(path.join(this.dummyPath, 'registry.vdf'))

        const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

        await winreg.set('language', 'english')
        await winreg.set('AutoLoginUser', 'someusername')
        await winreg.set('RememberPassword', 1)
        await winreg.set('SkinV4', 'Some Skin')
    }

    await fse.copy(path.join(__dirname, 'data', 'External Steam Library Folder'), path.join(this.dummyPath, 'External Steam Library Folder'), opts)

    await chmodrAsync(this.dummyPath, 0o777)
  } catch (err) {
    /* istanbul ignore next */
    throw err
  }
}

module.exports = SteamDummy
