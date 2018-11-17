const {
    Rational,

    abs,
    add,
    subtract,
    multiply,
    divide,
} = require('../lib/rational-number.js');

class MalformedError extends Error {
    constructor(value) {
        super(`Malformed rational number string: ${value}`);
    }
}

function parse(str) {
    str = str.trim();

    let sign = 1;
    if (str.includes('-')) {
        if (str[0] == '-') {
            sign = -1;
            str = str.substr(1).trim();
        } else {
            throw new MalformedError(str);
        }
    }

    if (str.includes('/')) {
        const split = str.split('/');
        if (split.length > 2 || str.includes('.')) {
            throw new MalformedError(str);
        } else {
            const numerator = parseInt(split[0]);
            const denominator = parseInt(split[1]);
            return new Rational(numerator, denominator, sign);
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
                denominator,
                sign
            );
        }
    } else {
        return new Rational(parseInt(str), 1, sign);
    }

}

function r(strings, ...args) {
    args = args.map(a => a.toString()); // coerce in case any were Rationals
    let str = strings[0];
    for (let i = 0; i < args.length; i ++) {
        str += args[i] + strings[i + 1];
    }

    return parse(str);
}

function addMany(...operands) {
    return operands.reduce((acc, cur) => add(acc, cur), 0);
}

function mulMany(...operands) {
    return operands.reduce((acc, cur) => multiply(acc, cur), 1);
}

module.exports = {
    Rational,
    r,

    abs,
    add: addMany,
    sub: subtract,
    mul: mulMany,
    div: divide,
}

