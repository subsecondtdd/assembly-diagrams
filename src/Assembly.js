const fs = require('fs')

module.exports = class Assembly {
  constructor(components) {
    this.components = components
  }

  toSvg(css) {
    css = css || fs.readFileSync(`${__dirname}/assembly.css`, 'utf-8')

    const height = 256 * this.components.length
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 504 ${height}" width="506" height="${height + 2}">
  <defs>
    <style type="text/css"><![CDATA[
${css}
    ]]></style>
  </defs>
${this.components.map((component, i) => component.toG({transform: `translate(0, ${i*200})`})).join('')}</svg>
`
  }
}
