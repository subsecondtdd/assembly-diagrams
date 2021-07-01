const fs = require('fs')
const assert = require('assert')
const parse = require('../src/parse')
const Assembly = require('../src/Assembly')

describe('Assembly', () => {
  it('generates an SVG with stacked pieces', () => {
    const pieces = parse(fs.readFileSync(`${__dirname}/../assemblies/webdriver-full-stack.txt`, 'utf-8'))
    const assembly = new Assembly(pieces)
    assert(assembly.toSvg())
  })
})
