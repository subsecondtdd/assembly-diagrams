const Piece = require('./Piece')

module.exports = function parse(assemblyScript) {
  let previousEdge = undefined
  let previousClassName = undefined
  let text = undefined

  const pieces = []

  const lines = assemblyScript.split(/\n/)
  lines.forEach((line, i) => {
    line = line.trim()
    let n = i % 2

    switch(n) {
      case 0: {
        const [edge, className] = line.split('.')
        if(previousEdge) {
          const piece = new Piece(previousEdge, text, edge, previousClassName)
          pieces.push(piece)
        }
        previousEdge = edge
        previousClassName = className
        break
      }
      case 1: {
        text = line
        break
      }
    }
  })

  return pieces
}
