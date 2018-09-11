# Assembly Diagrams

An Assembly is a collection of components that are connected in a particular way.
An Assembly diagram is a visualisation of an assembly.

Assembly diagrams visualise test components as well as application components.

Components can be decoupled via contracts. This makes it possible to create a wide
range of assemblies:

| `------Full Stack------`                            | `------DOM-Domain------`                     | `--------Domain--------`                     | `-----HTTP-Domain------`                     |
| --------------------------------------------------- | -------------------------------------------- | -------------------------------------------- | ---------------------------------------------|
| ![test](images/svg/test.svg)                        | ![test](images/svg/test.svg)                 | ![test](images/svg/test.svg)                 | ![test](images/svg/test.svg)                 |
| ![webdriveractor](images/svg/webdriveractor.svg)    | ![domactor](images/svg/domactor.svg)         | ![test](images/svg/directactor.svg)          | ![test](images/svg/directactor.svg)          |
| ![browser](images/svg/browser.svg)                  | ![dom](images/svg/dom.svg)                   | ![domainlogic](images/svg/domainlogic.svg)   | ![httpclient](images/svg/httpclient.svg)     |
| ![dom](images/svg/dom.svg)                          | ![reactapp](images/svg/reactapp.svg)         |                                              | ![http](images/svg/http.svg)                 |
| ![reactapp](images/svg/reactapp.svg)                | ![domainlogic](images/svg/domainlogic.svg)   |                                              | ![webapp](images/svg/webapp.svg)             |
| ![httpclient](images/svg/httpclient.svg)            |                                              |                                              | ![domainlogic](images/svg/domainlogic.svg)   |
| ![http](images/svg/http.svg)                        |                                              |                                              |                                              |
| ![webapp](images/svg/webapp.svg)                    |                                              |                                              |                                              |
| ![domainlogic](images/svg/domainlogic.svg)          |                                              |                                              |                                              |

(There are more possibilities, such as `DOM-HTTP-Domain`)

These different assemblies make tradeoffs between test *speed* and test *confidence*.

The idea is to have more of the fast tests and fewer of the slow ones -
as few as you can get away with.

The *Dom-Domain* tests exercise most of the functional parts of the stack, yet they
typically run in a few milliseconds. This is because there is no I/O in the assembly.
CPU-heavy components (such as a visual browser) are not present.

These tests obviously don't provide any confidence about components that are not present.
The *Full Stack* assembly connects all the components in a similar way to the production environment.
Tests in this assembly can be run occasionally, for maximum confidence.

The extremely fast acceptance tests enable high productivity, as developers can
get near-instant feedback on their changes. The slower, really thorough
ones have a different purpose - to verify that everything works before a commit,
and for more thorough CI tests.

## Edit and build your own SVGs

The pieces are defined in `pieces.txt`. It consists of multiple pieces like this:

```
‾‾╲╱‾‾╲╱‾‾
 React App
__‾‾__‾‾__
path { fill: rgba(132, 176, 130, 1); }
text { font: 60px serif; fill: #000000; }
```

You can fork this repo, edit `pieces.txt` and rebuild the `./svg/*.svg` files:

    yarn build

## Build PNGs from SVGs

Once you have generated the `images/svg/*.svg` files, you can generate `images/png/*.png`
from them. This is useful for environments that don't support SVG.

    brew install python3
    pip3 install cairosvg lxml tinycss cssselect
    make

## Conventions

Components are grouped in the follow categories:

* test - green
* infrastructure - pink
* frontend - orange
* backend - light blue

This makes it easier to distinguish between different types of components.
It also makes it easier to quickly spot what's essential about an assembly
(fast/slow, with/without infrastructure).
