// calculator functions
// Number -> Number -> Number
const add = (x,y) => x + y;
const subtract = (x,y) => x - y;
const multiply = (x,y) => x * y;
const divide = (x,y) => x / y;

// curried operate function
// operate :: (Number -> Number -> Number) -> Number -> Number -> Number
const operate = curry((operator, x, y) => operator(x,y));

