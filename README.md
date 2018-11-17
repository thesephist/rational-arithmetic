# rational-arithmetic

A no-dependency, lightweight JS library for arithmetic with rational numbers

**NOTE: `rational-arithmetic` is currently experimental, and use in production environments is not recommended.** The library is currently being used primarily as a proof-of-concept for advanced operator pseudo-overloading in JavaScript by abusing its single-threaded event loop.

## Rationale

Why another rational numbers library?

There's definitely more than enough rational numbers libraries for JavaScript. I created `rational-arithmetic` because most of the other libraries I could find didn't have the level of API ergonomics that I desired.

Implementing a class like `Rational` in Python is great, because it allows custom classes to overload default operators. This is not so in JS, so we need to be smarter about how to expose arithmetic operator APIs in a way that's easy to read and use. This project puts API ergonomics at the top of the list of its priorities.

## Features

- Correct support for infinities
- Support for primitive JS double precision floating-point values

- Ergonomic API with operator overloading in JavaScript
- Support for all JavaScript unary and binary number operators

## API

### `Rational` class

```
// TODO
```

### Operators

```
// TODO
```
### Converting between JavaScript numbers and `Rational`

```
// TODO
```

