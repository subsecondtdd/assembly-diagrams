const assert = require('assert')
const Component = require('../src/Component')

function p(strings) {
  return strings.join(' ').trim().split(/\s+/g).join(' ')
}

describe('Component', () => {
  it('generates d for <path>', () => {
    const component = new Component(
      '__‾‾__‾‾__',
      null,
      '‾╲______╱‾'
    )

    const expected = p`
      M 0 50
      l 50 0
      l 50 0
      l 0 -50
      l 50 0
      l 50 0
      l 0 50
      l 50 0
      l 50 0
      l 0 -50
      l 50 0
      l 50 0
      l 0 50
      l 50 0
      l 50 0

      l 0 150

      l -50 0
      l -50 50
      l -50 0
      l -50 0
      l -50 0
      l -50 0
      l -50 0
      l -50 0
      l -50 -50
      l -50 0

      z
    `

    assert.deepStrictEqual(component.toD(50), expected)
  })

  it('generates escaped text', () => {
    const component = new Component(
      null,
      '<HTTPClient>',
      null
    )

    assert.deepStrictEqual(component.toText(), '<text x="50%" y="128" alignment-baseline="middle" text-anchor="middle">&lt;HTTPClient&gt;</text>')
  })

  it('generates g', () => {
    const component = new Component(
      '__‾‾__‾‾__',
      'HTTPClient',
      '‾╲______╱‾',
      'http'
    )

    const g = component.toG(50, {transform: 'translate(0 200)'}).split('\n')[0].trim()
    assert.strictEqual(g, '<g transform="translate(0 200)" class="http">')
  })
})
