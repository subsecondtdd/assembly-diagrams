module.exports = class Piece {
  constructor(top, text, bottom, style, globalStyle) {
    this._top = top;
    this._text = text;
    this._bottom = bottom;
    this._style = style;
    this._globalStyle = globalStyle;
  }

  toPath() {
    const path = []
    let first = true
    let onEdge = true
    for (const c of this._top) {
      switch (c) {
        case '_':
          if (first) {
            path.push('M', '0', '50')
            onEdge = false
          }
          if(onEdge) {
            path.push('l', '0', '50')
          }
          path.push('l', '50', '0')
          onEdge = false
          break
        case '‾':
          if (first) {
            path.push('M', '0', '0')
            onEdge = true
          }
          if(!onEdge) {
            path.push('l', '0', '-50')
          }
          path.push('l', '50', '0')
          onEdge = true
          break
        case '╱':
          if (first) {
            path.push('M', '0', '50')
            onEdge = true
          }
          path.push('l', '50', '-50')
          onEdge = true
          break
        case '╲':
          if (first) {
            path.push('M', '0', '0')
          }
          path.push('l', '50', '50')
          onEdge = false
          break
      }
      first = false
    }

    if(onEdge) {
      path.push('l', '0', '50')
    }

    path.push('l', '0', '150')
    onEdge = false

    first = true
    for (let i = this._bottom.length - 1; i >= 0; i--){
      const c = this._bottom[i];

      switch (c) {
        case '‾':
          if(onEdge) {
            path.push('l', '0', '-50')
          }
          path.push('l', '-50', '0')
          onEdge = false
          break
        case '_':
          if(!onEdge) {
            path.push('l', '0', '50')
          }
          path.push('l', '-50', '0')
          onEdge = true
          break
        case '╱':
          path.push('l', '-50', '50')
          onEdge = true
          break
        case '╲':
          path.push('l', '-50', '-50')
          onEdge = false
          break
      }
      first = false
    }
    path.push('z')
    return path.join(' ')
  }

  toText() {
    return `<text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle">${escapeHtml(this._text)}</text>`
  }

  toSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 504 256" width="506" height="258">
  <defs>
    <style type="text/css"><![CDATA[
${this._style}
${this._globalStyle}
    ]]></style>
  </defs>
  <path stroke="#000000" stroke-width="4" d="${this.toPath()}" />
  ${this.toText()}
</svg>
`
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
