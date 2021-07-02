#!/usr/bin/env node
//
// Parses an assembly definitions file and outputs an SVG.
//
// Usage: assembly-diagrams ASSEMBLY_SCRIPT [STROKE_WIDTH] [CSS_FILE]
//
const fs = require('fs')
const { program } = require('commander')
const { version } = require('./package.json')
const parse = require('./src/parse')
const Assembly = require('./src/Assembly')

program.version(version)
program
  .argument('<script>', 'Assembly script')
  .option('-s, --stroke-width <width>', 'Border stroke width', '20')
  .option('-c, --css <stylesheet>', 'Stylesheet', `${__dirname}/src/assembly.css`)
program.parse(process.argv)
const options = program.opts()

main(
  program.args[0],
  +options.strokeWidth,
  options.css,
  process.stdout
).catch(err => {
  console.error(err)
  process.exit(1)
})


async function main(assemblyPath, strokeWidth, cssPath, writable) {
  const assemblyScript = await toString(fs.createReadStream(assemblyPath))
  const css = await toString(fs.createReadStream(cssPath))
  const components = parse(assemblyScript)
  const assembly = new Assembly(components)
  const svg = assembly.toSvg(strokeWidth, css)
  writable.write(svg)
}

async function toString(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString("utf-8")
}
