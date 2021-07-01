module.exports = class Piece {
  constructor(top, text, bottom, className) {
    this.top = top;
    this.text = text;
    this.bottom = bottom;
    this.className = className;
  }

  toJSON() {
    return {top: this.top, text: this.text, bottom: this.bottom, className: this.className}
  }

  toD() {
    const path = []
    let first = true
    let onEdge = true
    for (const c of this.top) {
      switch (c) {
        case '_':
          if (first) {
            path.push('M', '0', '50')
            onEdge = false
          }
          if (onEdge) {
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
          if (!onEdge) {
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

    if (onEdge) {
      path.push('l', '0', '50')
    }

    path.push('l', '0', '150')
    onEdge = false

    for (let i = this.bottom.length - 1; i >= 0; i--) {
      const c = this.bottom[i];

      switch (c) {
        case '‾':
          if (onEdge) {
            path.push('l', '0', '-50')
          }
          path.push('l', '-50', '0')
          onEdge = false
          break
        case '_':
          if (!onEdge) {
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
    return `<text x="50%" y="150" alignment-baseline="middle" text-anchor="middle">${escapeHtml(this.text)}</text>`
  }

  toPath() {
    return `<path stroke="#000000" stroke-width="4" d="${this.toD()}" />`
  }

  toG(attrs) {
    attrs = {...attrs, class: this.className}

    return `  <g ${Object.entries(attrs).map(e => `${e[0]}="${e[1]}"`).join(' ')}>
    ${this.toPath()}
    ${this.toText()}
  </g>
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
