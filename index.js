'use strict'

const fse = require('fs-extra')
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')
const chmodrAsync = require('util').promisify(require('chmodr'))

async function makeDummy (pathToDummy, force = false) {
  const dummyPath = pathToDummy || path.join(__dirname, 'Dummy')

  try {
    if (!force && await fse.exists(dummyPath)) {
      return
    }

    const opts = {
      overwrite: true
    }

    switch (platform) {
      case 'darwin':
        await fse.copy(path.join(__dirname, 'data', 'Mac'), dummyPath, opts)
        break

      case 'linux':
        await fse.copy(path.join(__dirname, 'data', 'Linux'), dummyPath, opts)
        break

      case 'win32':
        await fse.copy(path.join(__dirname, 'data', 'Windows'), dummyPath, opts)

        await fse.unlink(path.join(dummyPath, 'registry.vdf'))

        const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

        await winreg.set('language', 'english')
        await winreg.set('AutoLoginUser', 'someusername')
        await winreg.set('RememberPassword', 1)
        await winreg.set('SkinV4', 'Some Skin')
    }

    await fse.copy(path.join(__dirname, 'data', 'External Steam Library Folder'), path.join(dummyPath, 'External Steam Library Folder'), opts)

    await chmodrAsync(dummyPath, 0o777)
  } catch (err) {
    /* istanbul ignore next */
    throw err
  }
}

module.exports = makeDummy
