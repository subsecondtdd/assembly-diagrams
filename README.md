# Assembly Diagrams

An *Assembly Diagram* is a visualisation of a *Component Assembly*.
A *Component Assembly is a set of components that are connected (stacked) in a particular way.

Assembly Diagrams typically visualise three kinds of components:

* ![#FFB000](https://via.placeholder.com/15/FFB000/000000?text=+) Test components
* ![#DC267F](https://via.placeholder.com/15/DC267F/000000?text=+) Infrastructure components
* ![#648FFF](https://via.placeholder.com/15/648FFF/000000?text=+) Production components

You can think of a component as a "lego brick" with three characteristics:

* The top is the *contract* it implements (the **interface**)
* The middle is *how* the component fulfills the contract (the **implementation**)
* The bottom is the contract it *needs* (the **dependency**)

There can be multiple implementations of the same interface. This makes it possible to create a wide
range of assemblies:

| Full Stack                                   | DOM-HTTP-Domain                         | DOM-Domain                         | HTTP-Domain                         | Domain                              |
| ---------------------------------------------| --------------------------------------- | ---------------------------------- | ----------------------------------- | ----------------------------------- |
| ![test](images/svg/webdriver-full-stack.svg) | ![test](images/svg/dom-http-domain.svg) | ![test](images/svg/dom-domain.svg) | ![test](images/svg/http-domain.svg) | ![test](images/svg/domain.svg) |

These different assemblies make tradeoffs between three important aspects of automated tests:

* Speed
* Confidence (how much is tested)
* Diagnostic precision (how easy it is to understand why a test fails)

The general idea is to have more of the fast tests and fewer of the slow ones -
as few as you can get away with.

The *Dom-Domain* assembly exercises most of the functional parts of the stack, yet they
typically run in a few milliseconds. This is because there is no I/O in the assembly.

These tests obviously don't provide any confidence about components that are not present.
The *Full Stack* assembly connects all the components similarly to the production environment.
Tests in this assembly can be run occasionally, for maximum confidence.

The extremely fast acceptance tests enable high productivity, as developers can
get near-instant feedback on their changes. The slower, really thorough
ones have a different purpose - to verify that everything works before a commit,
and for more thorough CI tests.

## Conventions

Components are grouped in the follow categories:

* test code - green
* infrastructure - pink
* production code  - light blue

This makes it easier to distinguish between different types of components.
It also makes it easier to quickly spot what's essential about an assembly:

* How fast is it? (less infrastructure means faster tests)
* How much confidence does it give? (less production code means less confidence)
* How easy is it to diagnose why a test failed? (less production code and infastructure means easier)
  (fast/slow, with/without infrastructure).

## Generate your own assembly diagrams

    npx assembly-diagrams some-assembly.txt [some-style.css] > some-assembly.svg

### Build PNGs from SVGs

If you need to convert the SVG file to a PNG file, you can use [cairosvg]().

    brew install python3
    pip3 install cairosvg lxml tinycss cssselect
    cairosvg --scale 0.4 assembly.svg -o assembly.png
