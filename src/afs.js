'use strict'

const { promisify } = require('util')

module.exports = {
  exists: promisify(require ('fs').exists),
  lstat: promisify(require('fs').lstat),
  mkdir: promisify(require ('fs').mkdir),
  readdir: promisify(require('fs').readdir),
  readFile: promisify(require('fs').readFile),
  writeFile: promisify(require('fs').writeFile),
  copyFile: promisify(require ('fs').copyFile),
  chmod: promisify(require('fs').chmod),
  chown: promisify(require ('fs').chown),
  delete: promisify(require ('fs').unlink)
}
