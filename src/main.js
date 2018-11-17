const Rational = require('../lib/rational-number.js');

class MalformedError extends Error {
    constructor(value) {
        super(`Malformed rational number string: ${value}`);
    }
}

function parse(str) {
    // template string processor to turn template literals
    //  into rationals, like r`3/2`.

    if (str.includes('/')) {
        const split = str.split('/');
        if (split.length > 2 || str.includes('.')) {
            throw new MalformedError(str);
        } else {
            const numerator = parseInt(split[0]);
            const denominator = parseInt(split[1]);
            return new Rational(numerator, denominator);
        }
    } else if (str.includes('.')){
        const split = str.split('.');

        if (split.length > 2 || str.includes('/')) {
            throw new MalformedError(str);
        } else {
            const integerPart = parseInt(split[0]);
            const fractionPart = parseInt(split[1]);
            const denominator = Math.pow(10, split[1].length);

            return new Rational(
                integerPart * denominator + fractionPart,
                denominator
            );
        }
    } else {
        return new Rational(parseInt(str));
    }

}

function r(strings, ...args) {
    args = args.map(a => a.toString()); // coerce in case any were Rationals
    let str = strings[0];
    for (let i = 0; i < args.length; i ++) {
        str += args[i] + strings[i];
    }

    return parse(str);
}

module.exports = {
    Rational,
    r,
}

