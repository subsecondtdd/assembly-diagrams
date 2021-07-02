module.exports = class Assembly {
  constructor(components) {
    this.components = components
  }

  toSvg(strokeWidth, css) {
    // The components are made up of squares. 4 squares height and 10 squares wide.
    // They overlap by one square.
    const squareSize = 50

    const componentWidth = 10 * squareSize
    const componentHeight = 4 * squareSize
    const strokeHeight = (strokeWidth / 2) * Math.sqrt(2)

    const width = componentWidth + strokeWidth
    const height = (componentHeight * this.components.length) + squareSize + (2 * strokeHeight)

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style type="text/css"><![CDATA[
${css}
    ]]></style>
  </defs>
${this.components.map((component, i) => component.toG(squareSize, {
      'stroke-width': strokeWidth,
      transform: `translate(${strokeWidth / 2}, ${i * componentHeight + strokeHeight})`
    })).join('')}</svg>
`
  }
}
