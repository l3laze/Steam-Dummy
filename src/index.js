'use strict'

const debug = (process.env.CI !== 'undefined' ? require('ebug')('Steam-Dummy') : console.log)
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')
const afs = require('./afs.js')
const { copy } = require('./copyRecursive.js')

const dataPath = path.join(__dirname, '..', 'data')

async function makeDummy (dummyPath = path.join(__dirname, 'Dummy'), opts = { force: false }) {
  debug('\n\tdummyPath: %s\n\tforce: %s', dummyPath, opts.force)

  try {
    if (opts.force || await afs.exists(dummyPath) === false) {
      /*
        const options = {
          overwrite: opts.force,
          chmodF: 0o660,
          chmodD: 0o770
        }
       */

      debug('Creating dummy')

      if (await afs.exists(dummyPath) === false) {
        await afs.mkdir(dummyPath)
      }

      let creatingPath

      switch (platform) {
        case 'darwin':
          creatingPath = path.join(dataPath, 'Mac')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await copy(creatingPath, dummyPath)
          break

        case 'linux':
        case 'android':
          creatingPath = path.join(dataPath, 'Linux')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await copy(creatingPath, dummyPath)
          break

        case 'win32':
          creatingPath = path.join(dataPath, 'Windows')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await copy(creatingPath, dummyPath)

          await afs.delete(path.join(dummyPath, 'registry.vdf'))

          const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

          await winreg.set('language', 'english')
          await winreg.set('AutoLoginUser', 'someusername')
          await winreg.set('RememberPassword', 1)
          await winreg.set('SkinV4', 'Some Skin')
      }

      await copy(
        path.join(dataPath, 'External Steam Library Folder'),
        path.join(dummyPath, 'External Steam Library Folder')
      )

      debug('Created dummy for %s', platform)
    }
  } catch (err) {
    /* istanbul ignore next */
    throw err
  }
}

module.exports = makeDummy
