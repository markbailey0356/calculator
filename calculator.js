// functional programming functions
// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
// courtesy of the mostly-adequate-guide
const curry = (fn) => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

// calculator functions
const add = (x,y) => x + y;
const subtract = (x,y) => x - y;
const multiply = (x,y) => x * y;
const divide = (x,y) => x / y;

// curried operate function
const operate = curry((operator, x, y) => operator(x,y));

