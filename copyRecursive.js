'use strict'

const debug = (process.env.CI !== true ? require('ebug')('Steam-Dummy-cp-r') : console.log)
const path = require('path')
const afs = require('./afs.js')

debug('SD-cp-r: ', afs)

/*
 * Based on some of the answers from this SO qusetion
 * https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
 * along with this answer to another question https://stackoverflow.com/a/40686853/7665043
 */
async function copyRecursive (src, dest) {
  try {
    const garbageFiles = [
      '.DS_Store'
    ]
    const exists = await afs.exists(src)
    const stats = (exists ? await afs.lstat(src) : {})
    const isDir = (exists ? await stats.isDirectory() : false)
    const isNotGarbage = (exists && garbageFiles.indexOf(path.basename(src)) === -1)
    let destName

    if (exists && isDir && isNotGarbage) {
      try {
        await afs.mkdir(dest, stats.mode)
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
        await copyRecursive(path.join(src, child), path.join(dest, child), stats.mode)
      }
    } else if (isNotGarbage) {
      if (typeof stats.mode === 'number') {
        await afs.chmod(dest, stats.mode)
      }

      destName = path.dirname(dest)

      debug('Copying src -> %s to dest -> %s', path.basename(src), destName.substring(destName.lastIndexOf(path.sep) + 1))
      await afs.copy(src, dest) // , stats.mode)

      if (typeof chmodFlag === 'number') {
        await afs.chmod(dest, stats.mode)
      }
    } else {
      debug('Skipping garbage file: src -> %s', path.basename(src))
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  copy: copyRecursive
}
