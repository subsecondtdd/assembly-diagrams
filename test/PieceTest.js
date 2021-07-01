const assert = require('assert')
const Piece = require('../src/Piece')

function p(strings) {
  return strings.join(' ').trim().split(/\s+/g).join(' ')
}

describe('Piece', () => {
  it('generates d for <path>', () => {
    const piece = new Piece(
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

    assert.deepStrictEqual(piece.toD(), expected)
  })

  it('generates escaped text', () => {
    const piece = new Piece(
      null,
      '<HTTPClient>',
      null
    )

    assert.deepStrictEqual(piece.toText(), '<text x="50%" y="150" alignment-baseline="middle" text-anchor="middle">&lt;HTTPClient&gt;</text>')
  })

  it('generates g', () => {
    const piece = new Piece(
      '__‾‾__‾‾__',
      'HTTPClient',
      '‾╲______╱‾',
      'http'
    )

    const g = piece.toG({transform: 'translate(0 200)'}).split('\n')[0].trim()
    assert.strictEqual(g, '<g transform="translate(0 200)" class="http">')
  })
})
