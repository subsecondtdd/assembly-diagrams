#!/usr/bin/env node
//
// Parses a .txt file with assembly definitions and outputs an SVG.
//
const fs = require('fs')
const parse = require('./src/parse')
const Assembly = require('./src/Assembly')

async function main(assemblyPath, cssPath, writable) {
  const assemblyScript = await toString(fs.createReadStream(assemblyPath))
  const components = parse(assemblyScript)
  const assembly = new Assembly(components)
  const css = cssPath ? await toString(fs.createReadStream(cssPath)) : undefined
  const svg = assembly.toSvg(css)
  writable.write(svg)
}

async function toString(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString("utf-8")
}

const [, , assemblyPath, cssPath] = process.argv
main(assemblyPath, cssPath, process.stdout)
