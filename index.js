'use strict'

const fs = require('fs-extra')
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')

function SteamDummy () {
  this.dummyPath = path.join('./', 'Dummy')
  this.steamID = '107311984'
  this.created = []
}

SteamDummy.prototype.makeDummy = async function makeDummy (pathToDummy, force = false) {
  this.dummyPath = pathToDummy || this.dummyPath

  if (!force && fs.existsSync(this.dummyPath)) {
    return
  }

  try {
    switch (platform) {
      case 'darwin':
        await fs.copy(path.join(__dirname, 'data', 'Mac'), this.dummyPath)
        break

      case 'linux':
        await fs.copy(path.join(__dirname, 'data', 'Linux'), this.dummyPath)
        break

      case 'win32':
        await fs.copy(path.join(__dirname, 'data', 'Windows'), this.dummyPath)

        fs.unlink(path.join(this.dummyPath, 'registry.vdf'))

        const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

        await winreg.set('language', 'english')
        await winreg.set('AutoLoginUser', 'someusername')
        await winreg.set('RememberPassword', 1)
        await winreg.set('SkinV4', 'Some Skin')
    }

    await fs.copy(path.join(__dirname, 'data', 'External Steam Library Folder'), path.join(this.dummyPath, 'External Steam Library Folder'))
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = SteamDummy
