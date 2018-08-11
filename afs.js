'use strict'

const util = require('util')

/*
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
 */

/*
  const chmod = util.promisify(require('fs').chmod)
  const copy = require('./copyRecursive.js').copyRecursive
  const exists = util.promisify(require('fs').exists) // eslint-disable-line
  const lstat = util.promisify(require('fs').lstat)
  const mkdir = util.promisify(require('fs').mkdir)
  const readdir = util.promisify(require('fs').readdir)
  const remove = util.promisify(require('fs').unlink)
 */

module.exports = {
  chmod: util.promisify(require('fs').chmod),
  copyFile: util.promisify(require('fs').copyFile),
  exists: util.promisify(require('fs').exists), // eslint-disable-line
  lstat: util.promisify(require('fs').lstat),
  mkdir: util.promisify(require('fs').mkdir),
  readdir: util.promisify(require('fs').readdir),
  remove: util.promisify(require('fs').unlink)
}
