const Component = require('./Component')

module.exports = function parse(assemblyScript) {
  let previousEdge = undefined
  let previousClassName = undefined
  let text = undefined

  const components = []

  const lines = assemblyScript.split(/\n/)
  lines.forEach((line, i) => {
    line = line.trim()
    let n = i % 2

    if (i % 2 === 0) {
      const [edge, className] = line.split('.')
      if (previousEdge) {
        const component = new Component(previousEdge, text, edge, previousClassName)
        components.push(component)
      }
      previousEdge = edge
      previousClassName = className
    } else {
      text = line
    }
  })

  return components
}
