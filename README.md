# Full-Stack Diagrams

Generate SVGs for pieces that can be used to create full-stack diagrams for 
sub-second acceptance tests.

| `Full Stack          `                       | `DOM-Domain          `                | `Domain`                              | `HTTP-Domain`                         |
| -------------------------------------------- | ------------------------------------- | ------------------------------------- | --------------------------------------|
| ![test](svg/test.svg)                        | ![test](svg/test.svg)                 | ![test](svg/test.svg)                 | ![test](svg/test.svg)                 |
| ![webdriver_actor](svg/webdriver_actor.svg)  | ![dom_actor](svg/dom_actor.svg)       | ![test](svg/direct_actor.svg)         | ![test](svg/direct_actor.svg)         |
| ![browser](svg/browser.svg)                  | ![dom](svg/dom.svg)                   | ![domain_logic](svg/domain_logic.svg) | ![http_client](svg/http_client.svg)   |
| ![dom](svg/dom.svg)                          | ![react_app](svg/react_app.svg)       |                                       | ![http](svg/http.svg)                 |
| ![react_app](svg/react_app.svg)              | ![domain_logic](svg/domain_logic.svg) |                                       | ![webapp](svg/webapp.svg)             |
| ![http_client](svg/http_client.svg)          |                                       |                                       | ![domain_logic](svg/domain_logic.svg) | 
| ![http](svg/http.svg)                        |                                       |                                       |                                       |
| ![webapp](svg/webapp.svg)                    |                                       |                                       |                                       |
| ![domain_logic](svg/domain_logic.svg)        |                                       |                                       |                                       |

(There are more possibilities, such as `DOM-HTTP-Domain`)

The purpose of these diagrams is to visualise and explain how a test suite
(as well as the system under test) can be assembled in different configurations,
reusing the same acceptance tests.

The different assemblies make tradeoffs between test speed and test confidence.

The idea is to have more of the fast tests and fewer of the slow ones -
as few as you can get away with.

The *Dom-Domain* tests exercise most of the functional parts of the stack, yet they 
typically run in a few milliseconds. This is because all I/O has been removed. 
CPU-heavy components (such as a visual browser) have also been removed.

The only components these tests don't give us confidence about are the ones that 
are removed. We therefore have a *Full Stack* assembly that connects all the pieces
(similar to the production environment), and we occasionally run a few tests with 
this assembly, for maximum confidence.

The extremely fast acceptance tests enable high productivity, as developers can
get near-instant feedback on their changes. The slower, really thorough
ones have a different purpose - to verify that everything works before a commit,
and for more thorough CI tests.

## Edit and build SVGs pieces

The pieces are defined in `pieces.txt`. Rebuild the `./svg/*.svg` files:

    yarn build

## Conventions

To make it easier to distinguish between different types of components,
they are grouped in 4 categories (with separate colours):

* test - green
* infrastructure - pink
* frontend - orange
* backend - light blue