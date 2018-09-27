# The Odin Project: Calculator Project

This project is based upon the [*Calculator* Project](https://www.theodinproject.com/lessons/calculator)
from [**The Odin Project**](https://www.theodinproject.com) curriculum.

The final result can be found here: [The Calculator Project](https://markbailey0356.github.io/calculator/)

## An unsuccessful journey into functional programming

After recently reading [Professor Frisby's Mostly Adequate Guide to Functional
Programming](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/), I thought I would try and program this project
in a functional style. This proved to be an ultimately unsuccessful undertaking, and I ended up reverting to my old
object-oriented ways.

I can see the advantages of a functional approach, but it's such a different way of thinking that I decided that I
should start using it with an even smaller project. I'm currently finding it difficult to figure out what the *rules*
are regarding changing state, responding to input and displaying output. It's probably best if I do my first FP project in
a stricter language (like Haskell) whose compiler actively stops me from breaking the rules. I might then be able to
move on to using it in JS.

## The State design pattern

Once I had abandoned FP, the remainder of the project proved to be harder than I anticipated (*ain't that always the
way?*). Keeping track of which stage of the expression entry the calculator is up to and what the different buttons do
proved to be quite messy. I ended up using an internal `state` variable that took on various values from an *enum-like*
class of `STATES`. The event handlers would consult this variable, update it as necessary and perform behaviour
accordingly.

## Mapping functions to buttons and keys

I'm still trying to decide in which file the data belongs that maps internal functions to various HTML buttons and
keyboard bindings. On the one hand, it makes sense for the JS object to be independent of it's UI and for the mapping to
be handled through attributes on the HTML buttons. On the other hand, the key bindings can't be handled through HTML, so
they must be JS, and it makes no sense to separate the buttons and the key bindings.

In the end, I created an constant array on the JS object with entries that mapped functions to HTML button classes and
key codes. As part of the object's `init` method, we iterate through this array and create the buttons' `click` event
listeners. We also create a `keydown` listener that consults this array and runs the required function based upon `event.key`.
This at least has the advantage that it forces all of our bindings to be collated in one piece of data that could
technically be loaded in from an external JSON file.

## CSS Grid

Just a quick note that this project was when I really discovered and played with CSS Flexbox and CSS Grid. Their
combination is incredibly powerful, although a little overwhelming at the moment. Having said that, these technologies
make the calculator's layout pretty trivial to change and extend.
