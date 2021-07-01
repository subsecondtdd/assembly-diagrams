const fs = require('fs')
const parse = require('../src/parse')
const assert = require("assert")

describe('parse', () => {
  it('generates an array of pieces', () => {
    const pieces = parse(fs.readFileSync(`${__dirname}/../assemblies/webdriver-full-stack.txt`, 'utf-8'))
    assert.deepStrictEqual(pieces.map(piece => piece.toJSON()), [
      {
        top: '‾‾‾‾‾‾‾‾‾‾',
        text: 'Actor',
        bottom: '___‾‾‾‾___',
        className: 'test',
      },
      {
        top: '___‾‾‾‾___',
        text: 'WebDriverInteraction',
        bottom: '__╱╲╱╲╱╲__',
        className: 'browser',
      },
      {
        top: '__╱╲╱╲╱╲__',
        text: 'Browser',
        bottom: '__╱╲__╱╲__',
        className: 'browser',
      },
      {
        top: '__╱╲__╱╲__',
        text: 'DOM',
        bottom: '‾‾╲╱‾‾╲╱‾‾',
        className: 'dom',
      },
      {
        top: '‾‾╲╱‾‾╲╱‾‾',
        text: 'ReactApp',
        bottom: '__‾‾__‾‾__',
        className: 'dom',
      },
      {
        top: '__‾‾__‾‾__',
        text: 'HttpApiClient',
        bottom: '‾‾__‾‾__‾‾',
        className: 'http',
      },
      {
        top: '‾‾__‾‾__‾‾',
        text: 'Network',
        bottom: '__‾‾__‾‾__',
        className: 'http',
      },
      {
        top: '__‾‾__‾‾__',
        text: 'ExpressApp',
        bottom: '_‾_‾__‾_‾_',
        className: 'http',
      },
      {
        top: '_‾_‾__‾_‾_',
        text: 'DomainLogic',
        bottom: '__________',
        className: 'domain',
      },
    ])
  })
})
