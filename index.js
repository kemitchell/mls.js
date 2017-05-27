var ALL_SPACE = /^\s*$/
var LEADING_SPACE = /^\s*/
var MAP_PREFIX = ': '
var LIST_PREFIX = '- '
var COMMENT_PREFIX = '#'

exports.parse = function (string) {
  return string
    .split(/\n\r?/)
    .map(function (line, index) {
      var record = {line: index + 1}
      if (ALL_SPACE.test(line)) {
        record.empty = true
      } else {
        var separated = separate(line)
        record.indent = separated.indent
        var content = separated.content
        if (content.substring(0, 2) === LIST_PREFIX) {
          record.string = content.substring(2)
        } else if (content[0] === COMMENT_PREFIX) {
          record.empty = true
        } else if (content.indexOf(MAP_PREFIX) !== -1) {
          var split = content.split(MAP_PREFIX, 2)
          record.key = split[0]
          if (split[1]) {
            record.string = split[1]
          }
        }
      }
      return record
    })
    .filter(function (record) {
      return !record.empty
    })
    .reduce(function (data, record) {
      if (data === null) {
        if (record.key) {
          data = {}
        } else {
          data = []
        }
      }
      if (record.key) {
        if (data === null || Array.isArray(data)) {
          throw new Error(
            'Unexpected map record on line ' + record.line
          )
        } else {
          data[record.key] = record.string || null
        }
      } else {
        if (!Array.isArray(data)) {
          throw new Error(
            'Unexpected list record on line ' + record.line
          )
        } else {
          data.push(record.string)
        }
      }
      return data
    }, null)
}

function separate (line) {
  var indent = LEADING_SPACE.exec(line)[0].length
  return {
    indent: indent,
    content: line.substring(indent)
  }
}

exports.stringify = function (data) {
  throw new Error('not implemented')
}
