#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const readline = require('readline');
const Piece = require('./src/Piece')

const [, , ...args] = process.argv

const fsd = args[0];
const dir = args[1]
const lineReader = readline.createInterface({
  input: fs.createReadStream(fsd)
});

let state = 'top'
let top, text, bottom, style

lineReader.on('line', function (line) {
  if (line.match(/^\.\.\.\.\..*/)) {
    const piece = new Piece(top, text, bottom, style.join("\n"))
    const p = path.join(dir, fileName(text) + '.svg')
    fs.writeFileSync(p, piece.toSvg())
    state = 'top'
  } else if (state === 'top') {
    top = line
    state = 'text'
  } else if (state === 'text') {
    text = line.trim()
    state = 'bottom'
  } else if (state === 'bottom') {
    bottom = line
    state = 'style'
    style = []
  } else if (state === 'style') {
    style.push(line)
  }
});

function fileName(s) {
  return s.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}