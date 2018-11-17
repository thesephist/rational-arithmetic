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

        // normalize signs before diving into complexity
        const prod = numerator * denominator * sign;
        sign = prod / Math.abs(prod);
        numerator = Math.abs(numerator);
        denominator = Math.abs(denominator);

        // take care of infinities
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
        if (numerator === Infinity) {
            denominator = 1;
        } else if (numerator == 0) {
            if (denominator == 0) {
                numerator = Infinity;
            } else {
                numerator = 0;
            }
            denominator = 1;
        } else if (denominator === Infinity) {
            numerator = 0;
            denominator = 1;
        } else if (denominator == 0) {
            numerator = Infinity;
            denominator = 1;
        }

        // take care of double floating points
        if (numerator != ~~numerator || denominator != ~~denominator) {
            const [nn, nd] = floatToIntegerPair(numerator);
            const [dn, dd] = floatToIntegerPair(denominator);

            return divide(
                new Rational(nn, nd),
                new Rational(dn, dd)
            );
        }

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
        if (this.numerator == 0) {
            this.denominator = 1;
        } else {
            const nFactors = fastFactorize(this.numerator);
            const dFactors = fastFactorize(this.denominator);
            const common = fastIntersect(nFactors, dFactors).reduce((acc, cur) => acc * cur, 1);

            this.numerator /= common;
            this.denominator /= common;
        }

        return this;
    }

    valueOf() {
        return this.sign * this.numerator / this.denominator;
    }

    toString() {
        let str = '';
        if (this.sign < 0) {
            str += '-';
        }
        str += this.numerator;
        if (this.denominator != 1) {
            str += this.denominator;
        }

        return str;
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
    } else {
        return n;
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
        (a.numerator * b.denominator) + (a.denominator * b.numerator),
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

