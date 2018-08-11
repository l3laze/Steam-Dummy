'use strict'

const fs = require('fs')
const afs = {
  exists: fs.exists, // eslint-disable-line
  lstat: fs.lstat,
  mkdir: fs.mkdir,
  readdir: fs.readdir,
  copyFile: fs.copyFile,
  chmod: fs.chmod,
  unlink: fs.unlink
}
const path = require('path')
const platform = require('os').platform()
const {Registry} = require('rage-edit')

/*
 * Based on some of the answers from this SO qusetion
 * https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
 * along with this answer to another question https://stackoverflow.com/a/40686853/7665043
 */
async function copyRecursive (src, dest, options = {chmod: null}) {
  try {
    const exists = await afs.exists(src)
    const isDir = exists && await afs.lstat(src).isDirectory()

    if (exists && isDir) {
      try {
        await afs.mkdir(dest)
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err
        }

        if (err.code === 'ENOENT') {
          throw new Error(`EACCES: permision denied, mkdir ${dest}`)
        }

        const caught = [ 'EACCES', 'EPERM', 'EISDIR' ] > -1

        if (!caught) {
          throw err
        }
      }

      await Promise.all(
        afs.readdir(src).map(async (child) => {
          const result = await copyRecursive(path.join(src, child), path.join(dest, child), options)
          return result
        })
      )
    } else {
      await afs.copyFile(src, dest)
      typeof options.chmod === 'number' ? await afs.chmod(dest, options.chmod) : (function noOp () {})()
    }
  } catch (err) {
    console.error(err)
  }
}

async function makeDummy (pathToDummy, force = false) {
  const dummyPath = pathToDummy || path.join(__dirname, 'Dummy')

  try {
    if (!force && await afs.exists(dummyPath)) {
      return
    }

    const options = {
      overwrite: true,
      chmod: 0o777
    }

    switch (platform) {
      case 'darwin':
        await copyRecursive(path.join(__dirname, 'data', 'Mac'), dummyPath, options)
        break

      case 'linux':
        await copyRecursive(path.join(__dirname, 'data', 'Linux'), dummyPath, options)
        break

      case 'win32':
        await copyRecursive(path.join(__dirname, 'data', 'Windows'), dummyPath, options)

        await afs.unlink(path.join(dummyPath, 'registry.vdf'))

        const winreg = new Registry('HKCU\\Software\\Valve\\Steam')

        await winreg.set('language', 'english')
        await winreg.set('AutoLoginUser', 'someusername')
        await winreg.set('RememberPassword', 1)
        await winreg.set('SkinV4', 'Some Skin')
    }

    await copyRecursive(path.join(__dirname, 'data', 'External Steam Library Folder'), path.join(dummyPath, 'External Steam Library Folder'), options)

    await afs.chmod(dummyPath, 0o777)
  } catch (err) {
    /* istanbul ignore next */
    throw err
  }
}

module.exports = makeDummy
