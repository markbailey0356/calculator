// functional programming functions
// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
// courtesy of the mostly-adequate-guide
export const curry = (fn) => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};
