const fastFactorize = require('./fast-factorize.js');
const fastIntersect = require('./fast-intersect.js');

function floatToIntegerPair(n) {
    const sign = n / Math.abs(n);
    n = Math.abs(n);

    let str = n.toString();
    str = str.trim();

    const split = str.split('.');
    const integerPart = parseInt(split[0]);
    const fractionPart = parseInt(split[1]);
    const denominator = Math.pow(10, split[1].length);

    return [
        sign * (integerPart * denominator + fractionPart),
        denominator
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
        const nIsFloat = numerator != ~~numerator;
        const dIsFloat = denominator != ~~denominator;
        if (nIsFloat || dIsFloat) {
            const [nn, nd] = nIsFloat ? floatToIntegerPair(numerator) : [numerator, 1];
            const [dn, dd] = dIsFloat ? floatToIntegerPair(denominator) : [denominator, 1];

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
            str += '/' + this.denominator;
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
    return new Rational(n.denominator, n.numerator);
}

function abs(n) {
    n = makeInstance(n);
    if (n < 0) {
        return arith_invert(n);
    } else {
        return n;
    }
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

function multiply(a, b) {
    a = makeInstance(a);
    b = makeInstance(b);

    const r = new Rational(
        a.numerator * b.numerator,
        a.denominator * b.denominator
    );
    return r.normalize();
}

function divide(a, b) {
    return multiply(a, geom_invert(b));
}


module.exports = {
    Rational,

    abs,
    add,
    subtract,
    multiply,
    divide,
};

