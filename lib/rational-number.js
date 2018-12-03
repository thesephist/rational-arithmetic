const fastFactorize = require('./fast-factorize.js');
const fastIntersect = require('./fast-intersect.js');

// TODO: for 0/0 and Inf/Inf, implement NaN

function getSign(val) {
    if (val == 0) {
        return 1;
    } else if (val === Infinity) {
        return 1;
    } else if (val === -Infinity) {
        return -1;
    } else {
        return val / Math.abs(val);
    }
}

function floatToIntegerPair(n) {
    const sign = getSign(n);
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
        const prod = numerator * denominator * getSign(sign);
        if (prod == 0) {
            if (numerator == 0) {
                sign = getSign(denominator * getSign(sign));
            } else {
                sign = getSign(numerator * getSign(sign));
            }
        } else {
            sign = getSign(prod);
        }
        numerator = Math.abs(numerator);
        denominator = Math.abs(denominator);

        // take care of infinities
        //  - when numerator is Infinity:
        //      - if denominator is Infinity, return NaN
        //      - else, return Infinity
        //  - when numerator is zero
        //      - if denominator is zero, return NaN
        //      - else, return zero
        //  - when denominator is Infinity
        //      - numerator must be nonzero finite, so return 0
        //  - when denominator is zero
        //      - numerator must be nonzero finite, so return Infinity
        if (numerator === Infinity) {
            if (denominator == Infinity) {
                numerator = NaN;
                denominator = NaN;
            } else {
                denominator = 1;
            }
        } else if (numerator == 0) {
            if (denominator == 0) {
                numerator = NaN;
                denominator = NaN;
            } else {
                numerator = 0;
                denominator = 1;
            }
        } else if (denominator === Infinity) {
            numerator = 0;
            denominator = 1;
        } else if (denominator == 0) {
            numerator = Infinity;
            denominator = 1;
        }

        // take care of double floating points
        const nIsFloat = numerator != ~~numerator && numerator !== Infinity && !isNaN(numerator);
        const dIsFloat = denominator != ~~denominator && denominator !== Infinity && !isNaN(denominator);
        if (nIsFloat || dIsFloat) {
            const [nn, nd] = nIsFloat ? floatToIntegerPair(numerator) : [numerator, 1];
            const [dn, dd] = dIsFloat ? floatToIntegerPair(denominator) : [denominator, 1];

            const result = divide(
                new Rational(nn, nd),
                new Rational(dn, dd)
            );
            numerator = result.numerator;
            denominator = result.denominator;
        }

        this.sign = sign;
        this.numerator = numerator;
        this.denominator = denominator;

        this.normalize();
    }

    normalize() {
        if (this._containsNaN()) {
            this.sign = 1;
            this.numerator = NaN;
            this.denominator = NaN;
        } else {
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
        }
        return this;
    }

    _containsNaN() {
        return (isNaN(this.numerator) || isNaN(this.denominator));
    }

    valueOf() {
        if (this._containsNaN()) {
            return NaN;
        } else {
            return this.sign * this.numerator / this.denominator;
        }
    }

    toString() {
        if (this._containsNaN()) {
            return `NaN`;
        } else {
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
    }

    equal(r) {
        const a = this.normalize(),
            b = r.normalize();

        return (
            a.sign == b.sign
            && a.numerator == b.numerator
            && a.denominator == b.denominator
        );
    }

    clone() {
        return new Rational(
            this.numerator,
            this.denominator,
            this.sign,
        );
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
        (a.numerator * a.sign * b.denominator) + (a.denominator * b.numerator * b.sign),
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
        a.denominator * b.denominator,
        a.sign * b.sign
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

