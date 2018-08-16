'use strict'

const { lstatSync } = require('fs')

module.exports = {
  winArch: function () {
    try {
      const stats = lstatSync('C:\\Program Files (x86)')
      if (typeof stats.uid !== 'undefined') {
        return 'ia64'
      } else {
        return 'ia32'
      }
    } catch (err) {
      return 'ia32'
    }
  }
}
