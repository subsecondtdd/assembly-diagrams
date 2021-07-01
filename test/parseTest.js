const fs = require('fs')
const parse = require('../src/parse')
const assert = require("assert")

describe('parse', () => {
  it('generates an array of components', () => {
    const components = parse(fs.readFileSync(`${__dirname}/../assemblies/webdriver-full-stack.txt`, 'utf-8'))
    assert.deepStrictEqual(components.map(component => component.toJSON()), [
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
        className: 'test',
      },
      {
        top: '__╱╲╱╲╱╲__',
        text: 'Browser',
        bottom: '__╱╲__╱╲__',
        className: 'infrastructure',
      },
      {
        top: '__╱╲__╱╲__',
        text: 'DOM',
        bottom: '‾‾╲╱‾‾╲╱‾‾',
        className: 'infrastructure',
      },
      {
        top: '‾‾╲╱‾‾╲╱‾‾',
        text: 'ReactApp',
        bottom: '__‾‾__‾‾__',
        className: 'production',
      },
      {
        top: '__‾‾__‾‾__',
        text: 'HttpSession',
        bottom: '‾‾__‾‾__‾‾',
        className: 'production',
      },
      {
        top: '‾‾__‾‾__‾‾',
        text: 'Network',
        bottom: '__‾‾__‾‾__',
        className: 'infrastructure',
      },
      {
        top: '__‾‾__‾‾__',
        text: 'ExpressApp',
        bottom: '_‾_‾__‾_‾_',
        className: 'production',
      },
      {
        top: '_‾_‾__‾_‾_',
        text: 'DomainLogic',
        bottom: '__________',
        className: 'production',
      },
    ])
  })
})
