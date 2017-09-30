const get = require('just-safe-get');
const last = require('just-last');

module.exports = function({types: t}) {
  const visitor = replaceIfElseWithTernary(t);
  return {visitor};
}

function replaceIfElseWithTernary(t) {
  return {
    IfStatement(path) {
      const {
        node: {
          test,
          consequent,
          alternate,
        },
      } = path;

      path.replaceWith(
        t.conditionalExpression(
          test,
          toExpression(t, consequent),
          toExpression(t, alternate)
        )
      );
    },
  }
}

function toExpression(t, value) {
  if (get(value, ['expression', 'type']) == 'CallExpression') {
    return value.expression;
  }
  if(Array.isArray(value.body)) {
    // TODO: concat multiple statements into comma-separated expression
    if (value.body.length > 1) {
      console.log("TODO: only including last statement")
    }
    return last(value.body).expression;
  } else {
    throw new Error("can't convert if-else statement to ternary");
  }
}
