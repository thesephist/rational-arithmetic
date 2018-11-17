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

