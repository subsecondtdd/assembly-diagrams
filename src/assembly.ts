import { Graphic } from 'svg-turtle'

const thickness = 4
const unit = 10
// const connectorWidth = unit * 4

const hexagonSidePad = 50
// const hexagonSide = connectorWidth + hexagonSidePad * 2
// const componentHeight = unit * 5
// const componentWidth = unit * 8
// const componentOffset = (hexagonSide - componentWidth) / 2
// const componentPad = (componentWidth - connectorWidth) / 2

type Protrude = 'in' | 'out'
type Curve = 'curveLeft' | 'curveRight'
type Turn = 'turnLeft' | 'turnRight'

function turns(protrude: Protrude): [Turn, Turn] {
  const turnLeft = protrude === 'in' ? 'turnLeft' : 'turnRight'
  const turnRight  = protrude === 'in' ? 'turnRight' : 'turnLeft'
  return [turnLeft, turnRight]
}

function curves(protrude: Protrude): [Curve, Curve] {
  const curveLeft  = protrude === 'in' ? 'curveLeft' : 'curveRight'
  const curveRight = protrude === 'in' ? 'curveRight' : 'curveLeft'
  return [curveLeft, curveRight]
}

abstract class Connector {
  constructor(readonly g: Graphic) {}
  abstract draw(protrude: Protrude, pad: number): Graphic
}

class RectangleConnector extends Connector {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude)
    return this.g.draw(pad)
    [turnLeft](90).draw(2*unit)
    [turnRight](90).draw(4*unit)
    [turnRight](90).draw(2*unit)
    [turnLeft](90).draw(pad)
  }
}

class TriangleConnector extends Connector {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude)
    return this.g.draw(pad)
    [turnLeft](45).draw(2*unit*Math.sqrt(2))
    [turnRight](90).draw(2*unit*Math.sqrt(2))
    [turnLeft](45).draw(pad)
  }
}

class StairsConnector extends Connector {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft, turnRight] = turns(protrude)
    return this.g.draw(pad)
    [turnLeft](90).draw(unit)
    [turnRight](90).draw(unit)
    [turnLeft](90).draw(unit)
    [turnRight](90).draw(unit*2)
    [turnRight](90).draw(unit)
    [turnLeft](90).draw(unit)
    [turnRight](90).draw(unit)
    [turnLeft](90).draw(pad)
  }
}

class SemicircleConnector extends Connector {
  draw(protrude: Protrude, pad: number) {
    const [turnLeft,] = turns(protrude)
    const [, curveRight] = curves(protrude)
    return this.g.draw(pad)
    [turnLeft](90)
    [curveRight](180, 2*unit)
    [turnLeft](90).draw(pad)
  }
}

const g = new Graphic()
g.beginPath({ Color:'black', Width: thickness, Fill: 'pink' })

new StairsConnector(g).draw('out', hexagonSidePad).turnLeft(60)
new RectangleConnector(g).draw('out', hexagonSidePad).turnLeft(60)
new TriangleConnector(g).draw('in', hexagonSidePad).turnLeft(60)
new RectangleConnector(g).draw('in', hexagonSidePad).turnLeft(60)
new TriangleConnector(g).draw('in', hexagonSidePad).turnLeft(60)
new SemicircleConnector(g).draw('out', hexagonSidePad).turnLeft(60)


// // Draw a piece
// g.alignAt(comp1)
// g.beginPath({ Color:'red'})
// // Move to beginning of component
// g.turnLeft(180)
// g.move(componentOffset)
// g.turnLeft(90).draw(componentHeight)
// g.turnRight(90).draw(componentWidth)
// g.turnRight(90).draw(componentHeight)
// g.turnRight(90).triangle('in', componentPad)

//   // Draw a piece
// g.alignAt(comp2)
// g.beginPath({ Color:'blue'})
// // Move to beginning of component
// g.turnLeft(180)
// g.move(componentOffset)
// g.turnLeft(90).draw(componentHeight)
// g.turnRight(90).draw(componentWidth)
// g.turnRight(90).draw(componentHeight)
// g.turnRight(90).stairs('out', componentPad)

const SVG = g.asSVG('px')
console.log(SVG)