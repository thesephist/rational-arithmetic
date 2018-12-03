# rational-arithmetic

A no-dependency, lightweight JS library for arithmetic with rational numbers

## Rationale

Why another rational numbers library?

There's definitely more than enough rational numbers libraries for JavaScript. I created `rational-arithmetic` because most of the other libraries I could find didn't have the level of API ergonomics that I desired.

Implementing a class like `Rational` in Python is great, because it allows custom classes to overload default operators. This is not so in JS, so we need to be smarter about how to expose arithmetic operator APIs and primitive-object conversions in a way that's easy to read and use. This project puts API ergonomics at the top of the list of its priorities.

## Features

- Correct support for infinities
- Support for primitive JS double precision floating-point values
- Ergonomic and readable API
- Support for all JavaScript unary and binary number operators
- Transparent interoperability with primitive numbers when exact correctness isn't needed

## API

### `Rational` class

A rational number is represented as an instance of the `Rational` class.

But in normal usage, you should very rarely need to use the `Rational` class directly. Instead, you should use the `r` function to tag template literals into `Rational` instances.

```javascript

const { r } = require('rational-arithmetic');

const r1 = r`12/5`;     // 12 / 5
const r2 = r`2.5`;      // 5 / 2
const r3 = r`-89.123`;  // - 89123 / 1000
```

The `r` tag accepts numbers in any format, including integers and floating points with signs, and improper fractions using the `/` symbol.

If you'd like to construct instances of `Rational` manually, you can also do so.

The signature for the `Rational` class constructor is `Rational(numerator: number, denominator: number[, sign: 1 or -1])`. You can place any JavaScript number primitive into numerator and denominator slots, and they'll be normalized into reduced fractions.

```javascript
const { Rational } = require('rational-arithmetic');

const r1 = new Rational(12, 5)          // 12 / 5
const r2 = new Rational(10 / 4)         // 5 / 2
const r3 = new Rational(89.123, 1, -1)  // - 89123 / 1000
```

Instances of the `Rational` class also have access to 3 other utility methods, `normalize()`, `equal(r)`, and `clone()`.

#### `normalize() -> Rational (self)`

Normalizes the numerator, denominator, and sign of the rational number to a canonical format, by ensuring the following is true:

- Numerator and denominator share no common factors larger than 1
- Numerator is a nonnegative integer
- Denominator is a natural number
- Sign is either `1` or `-1`

`normalize()` __mutates the original object__, and returns itself.

#### `equal(r: Rational) -> Boolean`

Does a deep equality comparison between two instances of `Rational`. `equal(r)` compares values after normalization (reducing the fraction).

#### `clone() -> Rational`

Returns a new instance of `Rational` with the same properties as itself.

### Arithmetic

`rational-arithmetic` comes with the following operators. Wherever `number` is marked as the accepted type, instances of `Rational` as well as JavaScript number primitives are accepted; all operators will return instances of `Rational`, even if all operands were primitive.

```javascript
const {
  r,
  abs,
  add, sub,
  mul, div,
} = require('rational-arithmetic');

abs(r`-23/5`)                 // 23 / 5
add(1, 2, 3)                  // 6
sub(r`7/6`, 2)                // 19 / 6
mul(r`12/7`, -3.5, r`24/16`)  // - 9
div(12, 2.21)                 // 1200 / 221
```

#### `abs(number) -> Rational`

Absolute value operator.

#### `add(...number) -> Rational`

Addition operator. `add` is [variadic](https://en.wikipedia.org/wiki/Variadic_function), and will return the sum of all given arguments. You can mix primitives and `Rational` numbers as arguments.

#### `sub(number, number) -> Rational`

Subtraction operator. Unlike `add`, `sub` only ever takes two arguments.

#### `mul(...number) -> Rational`

Multiplication operator. `mul` is [variadic](https://en.wikipedia.org/wiki/Variadic_function), and will return the product of all given arguments. You can mix primitives and `Rational` numbers as arguments.

#### `div(number, number) -> Rational`

Division operator. Unlike `mul`, `div` only ever takes two arguments, and returns the quotient as a `Rational` number.

### Compatibility and conversion between primitives and `Rational` instances

Transparent interoperability between JavaScript primitive values and `Rational` instances was a key design goal of `rational-arithmetic`. The library makes interoperation easy and transparent in two cases

#### Using primitive values in arithmetic operations

When you use primitive numbers in any of the arithmetic operators given as functions here, they'll be transparently promoted to instances of `Rational` without losing any precision. See the examples above in the Arithmetic section for more examples.

#### Using `Rational` instances with native JavaScript operators

When native JavaScript operators like `+ - / * %` or native `Math` functions like `Math.abs()` or `Math.pow()` are used with `Rational` instances, the double precision approximation for the rational numbers will be used instead, requiring no explicit conversion step.

### Infinities and indeterminate (undefined) values

Infinite and indeterminate values are correctly supported in `rational-arithmetic`. Infinite values are represented internally as

```javascript
// positive Infinity
Rational {
  sign: 1,
  numerator: Infinity,
  denominator: 1,
}

// or negative Infinity
Rational {
  sign: -1,
  numerator: Infinity,
  denominator: 1,
}
```

and undefined or indeterminate values (the result of evaluating `Infinity / Infinity` or `0 / 0`) are represented as

```javascript
// indeterminate value, NaN
Rational {
  sign: 1,
  numerator: NaN,
  denominator: NaN,
}
```

and these values are canonicalized to NaN when cast to primitive values.

The full list of arithmetic involving infinities follows native ECMAScript conventions, and is as follows:

```javascript
Infinity / Infinity -> NaN
Infinity / 0 -> Infinity
0 / Infinity -> 0
0 / 0 -> NaN
Infinity / <finite number> -> Infinity
<finite number> / Infinity -> 0
```

These infinite and indeterminate value representations should interoperate transparently with JavaScript primitive values the way other `Rational` values do.

## Contributing

Found a bug? Please put in a pull request! If you have a feature request, feel free to open an issue, though those aren't guaranteed to be followed-through.

### Tests

`rational-arithmetic` strives for 100% test coverage of exposed interfaces. You can run tests with

```sh
yarn test
# or
npm test
```

and add tests under `test/test.js`.

