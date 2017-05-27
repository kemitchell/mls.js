var ALL_SPACE = /^\s*$/
var LEADING_SPACE = /^\s*/
var MAP_PREFIX = ':'
var LIST_PREFIX = '-'
var COMMENT_PREFIX = '#'

exports.parse = function (string) {
  var lines = string
    .split(/\n\r?/)
    .map(function (line, index) {
      var record = {line: index + 1}
      if (ALL_SPACE.test(line)) {
        record.empty = true
      } else {
        var separated = separate(line)
        record.indent = separated.indent
        var content = separated.content
        if (content[0] === LIST_PREFIX) {
          record.string = content.substring(2)
        } else if (content[0] === COMMENT_PREFIX) {
          record.empty = true
        } else if (content[content.length - 1] === MAP_PREFIX) {
          record.key = content.substring(0, content.length - 2)
        } else if (content.indexOf(MAP_PREFIX) !== -1) {
          var split = content.split(MAP_PREFIX, 2)
          record.key = split[0]
          if (split[1][0] === ' ') {
            record.string = split[1].substring(1)
          } else {
            record.string = split[1]
          }
        } else {
          throw new Error('invalid input on line ' + record.line)
        }
      }
      return record
    })
    .filter(function (record) {
      return !record.empty
    })
  var context = []
  build(0, context, lines)
  return context[context.length - 1]
}

function separate (line) {
  var indent = LEADING_SPACE.exec(line)[0].length
  return {
    indent: indent,
    content: line.substring(indent)
  }
}

function build (indent, context, lines) {
  if (lines.length) {
    var data = context[0]
    var record = lines[0]
    if (data === null) {
      if (record.key) {
        context[0] = data = {}
      } else {
        context[0] = data = []
      }
    }
    if (record.key) {
      if (data === null || Array.isArray(data)) {
        throw new Error(
          'Unexpected map record on line ' + record.line
        )
      } else {
        var nextContext = record.string ? data : null
        data[record.key] = record.string || null
        build(0, nextContext, lines.slice(1))
      }
    } else {
      if (!Array.isArray(data)) {
        throw new Error(
          'Unexpected list record on line ' + record.line
        )
      } else {
        data.push(record.string)
        build(0, data, lines.slice(1))
      }
    }
  }
}

exports.stringify = function (data) {
  throw new Error('not implemented')
}
