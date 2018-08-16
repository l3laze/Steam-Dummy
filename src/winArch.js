'use strict'

const { statSync } = require('fs')

module.exports = {
  winArch: function () {
    try {
      if (statSync('C:\\Program Files (x86)')) {
        return 'ia64'
      } else {
        return 'ia32'
      }
    } catch (err) {
      return 'ia32'
    }
  }
}
