const fastFactorize = require('./fast-factorize.js');
const fastIntersect = require('./fast-intersect.js');

function floatToIntegerPair(n) {
    const str = n.toString();
    const split = str.split('.');

    const integerPart = parseInt(split[0]);
    const fractionPart = parseInt(split[1]);
    const denominator = Math.pow(10, split[1].length);

    return [
        integerPart * denominator + fractionPart,
        denominator,
    ];
}

class Rational {

    constructor(numerator, denominator = 1, sign = 1) {
        // TODO: take care of infinities
        //  - when numerator is Infinity:
        //      - if denominator is Infinity, return Infinity
        //      - else, return Infinity
        //  - when numerator is zero
        //      - if denominator is zero, return Infinity
        //      - else, return zero
        //  - when denominator is Infinity
        //      - numerator must be nonzero finite, so return 0
        //  - when denominator is zero
        //      - numerator must be nonzero finite, so return Infinity

        // TODO: take care of double floating points
        //  - if numerator is floating point
        //      - if denominator is floating point, just divide and lose precision
        //      - else, floatToIntegerPair(numerator), then divide by denominator
        //  - if denominator is floating point
        //      - numerator must not be floating point, so floatToIntegerPair(denom),
        //        then geom_invert() and multiply by the given denominator

        this.sign = sign;
        this.numerator = numerator;
        this.denominator = denominator;

        this.normalize();
    }

    normalize() {
        // normalize sign
        const sign = this.valueOf() < 0 ? -1 : 1;
        this.numerator = Math.abs(this.numerator);
        this.denominator = Math.abs(this.denominator);

        // reduce fraction
        const nFactors = fastFactorize(this.numerator);
        const dFactors = fastFactorize(this.denominator);
        const common = fastIntersect(nFactors, dFactors).reduce((acc, cur) => acc * cur, 1);

        this.numerator /= common;
        this.denominator /= common;
    }

    valueOf() {
        return this.sign * this.numerator / this.denominator;
    }

    toString() {
        return `${this.sign < 0 ? '-' : ''}${this.numerator}/${this.denominator}`;
    }

    equal(r) {
        const a = this.normalize(),
            b = r.normalize();

        return (
            a.sign == b.sign
            && a.numerator == b.numerator
            && a.denominator == b.denominator
        )
    }

}

// Unary operators

function makeInstance(n) {
    if (!(n instanceof Rational)) {
        return new Rational(n);
    }
}

function arith_invert(n) {
    n = makeInstance(n);
    return new Rational(n.numerator, n.denominator, -1 * n.sign);
}

function geom_invert(n) {
    n = makeInstance(n);
    return new Rational(r.denominator, r.numerator);
}

// Binary operators

function add(a, b) {
    a = makeInstance(a);
    b = makeInstance(b);

    const r = new Rational(
        (a.numerator * b.denominator) + (a.denominator + b.numerator),
        a.denominator * b.denominator
    );
    return r.normalize();
}

function subtract(a, b) {
    return add(a, arith_invert(b));
}

function multiply(r1, r2) {
    a = makeInstance(a);
    b = makeInstance(b);

    const r = new Rational(
        r1.numerator * r2.numerator,
        r1.denominator * r2.denominator
    );
    return r.normalize();
}

function divide(r1, r2) {
    return multiply(r1, invert(r2));
}


module.exports = {
    Rational,

    arith_invert,
    geom_invert,

    add,
    subtract,
    multiply,
    divide,
};
