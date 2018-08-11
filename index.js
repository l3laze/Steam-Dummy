'use strict'

const util = require('util')
/*
  const afs = {
    exists: util.promisify(require('fs').exists), // eslint-disable-line
    lstat: util.promisify(require('fs').lstat),
    mkdir: util.promisify(require('fs').mkdir),
    readdir: util.promisify(require('fs').readdir),
    readFile: util.promisify(require('fs').readFile),
    writeFile: util.promisify(require('fs').writeFile),
    chmod: util.promisify(require('fs').chmod),
    unlink: util.promisify(require('fs').unlink)
  }
 */
const afs = {
  exists: require('fs-extra').pathExists,
  lstat: util.promisify(require('fs').lstat),
  mkdir: require('fs-extra').mkdirp,
  readdir: util.promisify(require('fs').readdir),
  // readFile: util.promisify(require('fs').readFile),
  // writeFile: util.promisify(require('fs').writeFile),
  copy: require('fs-extra').copy,
  chmod: util.promisify(require('fs').chmod),
  delete: require('fs-extra').remove
}
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')

const debug = (process.env.CI !== true ? require('ebug')('Steam-Dummy') : console.log)

/*
 * Based on some of the answers from this SO qusetion
 * https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
 * along with this answer to another question https://stackoverflow.com/a/40686853/7665043
 */

/*
  async function copyRecursive (src, dest, chmodFlag) {
  try {
    const garbageFiles = [
      '.DS_Store'
    ]
    const exists = await afs.exists(src)
    const stats = (exists ? await afs.lstat(src) : {})
    const isDir = (exists ? await stats.isDirectory() : false)
    const isNotGarbage = (exists && garbageFiles.indexOf(path.basename(src)) === -1)
    let destName

    if (typeof chmodFlag === 'undefined') {
      chmodFlag = stats.mode
    }

    if (exists && isDir && isNotGarbage) {
      try {
        await afs.mkdir(dest, chmodFlag)
      } catch (err) {
        if (err.code === 'EEXIST') {
          // Ignore it..
        }

        if (err.code === 'ENOENT') {
          throw new Error(`EACCES: permision denied, mkdir ${dest}`)
        }

        const caught = [ 'EACCES', 'EPERM', 'EISDIR', 'EEXIST' ].indexOf(err.code) > -1

        if (!caught) {
          throw err
        }
      }

      destName = path.dirname(dest)

      debug('Copying src -> %s to dest -> %s', path.basename(src), destName.substring(destName.lastIndexOf(path.sep) + 1))

      const contents = await afs.readdir(src)
      let child

      debug('Contents: %s', contents.join(', '))

      for (child of contents) {
        await child
        await copyRecursive(path.join(src, child), path.join(dest, child), chmodFlag)
      }
    } else if (isNotGarbage) {
      if (typeof chmodFlag === 'number') {
        await afs.chmod(dest, chmodFlag)
      }

      destName = path.dirname(dest)

      debug('Copying src -> %s to dest -> %s', path.basename(src), destName.substring(destName.lastIndexOf(path.sep) + 1))
      await afs.copy(src, dest, chmodFlag)

      if (typeof options.chmodF === 'number') {
        await afs.chmod(dest, options.chmodF)
      }
    } else {
      debug('Skipping garbage file: src -> %s', path.basename(src))
    }
  } catch (err) {
    throw err
  }
}
*/

async function makeDummy (dummyPath = path.join(__dirname, 'Dummy'), opts = { force: false }) {
  debug('\n\tdummyPath: %s\n\tforce: %s', dummyPath, opts.force)

  try {
    if (opts.force || await afs.exists(dummyPath)) {
      /*
        const options = {
          overwrite: opts.force,
          chmodF: 0o660,
          chmodD: 0o770
        }
       */

      debug('Creating dummy')

      if (await afs.exists(dummyPath) === false) {
        // await afs.chmod(path.dirname(dummyPath).substring(path.dirname(dummyPath).lastIndexOf(path.sep)), options.chmodD)
        await afs.mkdir(dummyPath) //, options.chmodD)
      }

      let creatingPath

      switch (platform) {
        case 'darwin':
          creatingPath = path.join(__dirname, 'data', 'Mac')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await afs.copy(creatingPath, dummyPath, { overwrite: true })
          break

        case 'linux':
        case 'android':
          creatingPath = path.join(__dirname, 'data', 'Linux')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await afs.copy(creatingPath, dummyPath, { overwrite: true })
          break

        case 'win32':
          creatingPath = path.join(__dirname, 'data', 'Windows')
          debug('\n\tsource: %s\n\tdest: %s', creatingPath, dummyPath)
          // await copyRecursive(creatingPath, dummyPath, options)
          await afs.copy(creatingPath, dummyPath, { overwrite: true })

          await afs.delete(path.join(dummyPath, 'registry.vdf'))

          const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

          await winreg.set('language', 'english')
          await winreg.set('AutoLoginUser', 'someusername')
          await winreg.set('RememberPassword', 1)
          await winreg.set('SkinV4', 'Some Skin')
      }

      debug('Created dummy for %s', platform)

      await afs.copy(
        path.join(__dirname, 'data', 'External Steam Library Folder'),
        path.join(dummyPath, 'External Steam Library Folder'),
        { overwrit: true }
      )
    }
  } catch (err) {
    /* istanbul ignore next */
    throw err
  }
}

module.exports = makeDummy
