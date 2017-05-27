var assert = require('assert')
var parse = require('.').parse

assert.deepEqual(
  parse([
    'a: x',
    'b: y'
  ].join('\n')),
  {a: 'x', b: 'y'}
)

assert.deepEqual(
  parse([
    '- a',
    '- b'
  ].join('\n')),
  ['a', 'b']
)

assert.deepEqual(
  parse([
    '',
    '- a',
    '        ',
    '- b',
    ''
  ].join('\n')),
  ['a', 'b'],
  'ignores empty lines'
)

assert.deepEqual(
  parse([
    '# a comment',
    '- a',
    '# another comment',
    '- b',
    '    # indented comment'
  ].join('\n')),
  ['a', 'b'],
  'ignores comment lines'
)

assert.deepEqual(
  parse([
    'x:',
    ' - a',
    ' - b',
    'y: c'
  ].join('\n')),
  {
    x: ['a', 'b'],
    y: 'c'
  }
)

