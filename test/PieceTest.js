const assert = require('assert')
const Piece = require('../src/Piece')

function p(strings) {
  return strings.join(' ').trim().split(/\s+/g).join(' ')
}

describe('Piece', () => {
  it('generates path for HTTPClient', () => {
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

    assert.deepStrictEqual(piece.toPath(), expected)
  })

  it('generates text for HTTPClient', () => {
    const piece = new Piece(
      null,
      '<HTTPClient>',
      null
    )

    assert.deepStrictEqual(piece.toText(), '<text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle">&lt;HTTPClient&gt;</text>')
  })
  
  it('generates svg', () => {
    const piece = new Piece(
      '__‾‾__‾‾__',
      'HTTPClient',
      '‾╲______╱‾'
    )

    assert(piece.toSvg())
  })
})