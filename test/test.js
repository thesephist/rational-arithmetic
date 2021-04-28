const should = require('chai').should();

const {
    r,
    Rational,

    abs,
    add,
    sub,
    mul,
    div,
} = require('../src/main.js');

describe('Rational', () => {

    describe('#constructor', () => {
        it('should correctly compute floating-point value', () => {
            new Rational(12, 5).valueOf().should.equal(2.4);
        });

        it('should correctly stringify rationals', () => {
            new Rational(12, 5).toString().should.equal('12/5');
        });

        it('should correctly normalize fractional values in operands', () => {
            new Rational(3.5, 10.5).equal(new Rational(1, 3)).should.be.true;
        });

        it('should handle large numerator & denumerator', () => {
            new Rational(10000000000, 10000000000).valueOf().should.equal(1);
        });

        describe('Infinities', () => {
            it('should correctly accept JavaScript primitive Infinity as numerator', () => {
                new Rational(Infinity).valueOf().should.equal(Infinity);
            });

            it('should correctly accept JavaScript primitive Infinity as denominator', () => {
                new Rational(10, Infinity).valueOf().should.be.a('number');
            });
        });

    });

    describe('#normalize', () => {
        it('should return itself', () => {
            const n = new Rational(12, 36);
            n.normalize().should.equal(n);
        });

        it('should reduce fractions to lowest number values', () => {
            const n = new Rational(24, 36);
            n.normalize();

            n.numerator.should.equal(2);
            n.denominator.should.equal(3);
        });

        it('should canonicalize signs so neither numerator nor denominator is negative, and abs(sign) is 1', () => {
            const n = new Rational(-24, -36, -2);
            n.normalize();

            n.numerator.should.equal(2);
            n.denominator.should.equal(3);
            n.sign.should.equal(-1);
        });
    });

    describe('#equal', () => {
        it('should return true on equal values', () => {
            new Rational(12, 5).equal(new Rational(24, 10)).should.be.true;
        });

        it('should return false on inequal values', () => {
            new Rational(3, 2).equal(new Rational(2)).should.be.false;
        })
    });

    describe('#clone', () => {
        it('should return a Rational with the same properties as itself', () => {
            const n = new Rational(24, 13, 1);
            const clone = n.clone();

            clone.numerator.should.equal(24);
            clone.denominator.should.equal(13);
            clone.sign.should.equal(1);
        });
    });

});

describe('r (template function)', () => {

    describe('parser', () => {
        it('should correctly rationalize fractions', () => {
            r`12/5`.equal(new Rational(12, 5)).should.be.true;
        });

        it('should correctly rationalize floats', () => {
            r`2.5`.equal(new Rational(5, 2)).should.be.true;
        });

        it('should account for negative numbers', () => {
            r`-89.123`.equal(new Rational(89123, 1000, -1)).should.be.true;
        });

        it('should understand and remove sensible whitespaces', () => {
            r` 24 /   36`.equal(new Rational(2, 3)).should.be.true;
        });
    });

});

describe('Arithmetic', () => {

    describe('abs', () => {
        it('should not mutate the operand', () => {
            const n = new Rational(2, 3, -1);
            const n2 = abs(n);
            n.equal(n).should.be.true;
        });

        it('should return the absolute value of a positive Rational', () => {
            const n = new Rational(2, 3, 1);
            const n2 = abs(n);
            n2.equal(new Rational(2, 3)).should.be.true;
        });

        it('should return the absolute value of a negative Rational', () => {
            const n = new Rational(2, 3, -1);
            const n2 = abs(n);
            n2.equal(new Rational(2, 3)).should.be.true;
        });
    });

    describe('add', () => {
        it('should return the sum of two rationals', () => {
            add(new Rational(2, 3), new Rational(2, 3)).equal(new Rational(4, 3)).should.be.true;
        });

        it('should accept 0 operands (and return 0)', () => {
            add().should.equal(0);
        });

        it('should accept an arbitrary number of operands', () => {
            add(
                new Rational(1, 3),
                new Rational(2, 3),
                new Rational(3, 3),
                new Rational(4, 3)
            ).equal(new Rational(10, 3)).should.be.true;
        });

        it('should deal with negative numbers', () => {
            add(new Rational(10, 7), new Rational(13, 7, -1)).equal(new Rational(3, 7, -1)).should.be.true;
        })

        it('should accept primitive number types as operands', () => {
            add(1, 2, 3, 4, 5.57).valueOf().should.equal(15.57);
        });
    });

    describe('sub', () => {
        it('should return the difference of two rationals', () => {
            sub(new Rational(10, 3), new Rational(7, 3)).equal(new Rational(1, 1)).should.be.true;
        });

        it('should accept primitive number types as operands', () => {
            sub(3, new Rational(3, 2)).equal(new Rational(3, 2));
        });

        it('should correctly deal with negative numbers', () => {
            sub(3, new Rational(3, 2, -1)).equal(new Rational(9, 2));
        });
    });

    describe('mul', () => {
        it('should return the product of two rationals', () => {
            mul(new Rational(2, 3), new Rational(1, 3)).equal(new Rational(2, 9)).should.be.true;
        });

        it('should accept 0 operands (and return 1)', () => {
            mul().should.equal(1);
        });

        it('should accept an arbitrary number of operands', () => {
            mul(
                new Rational(3, 2),
                new Rational(2, 3, -1),
                new Rational(4, 3)
            ).equal(new Rational(4, 3, -1)).should.be.true;
        });

        it('should accept primitive number types as operands', () => {
            mul(1, 2, 3, new Rational(1, 3)).equal(new Rational(2, 1)).should.be.true;
        });
    });

    describe('div', () => {
        it('should return the quotient of two rationals', () => {
            div(
                new Rational(5, 2),
                new Rational(10, 3)
            ).equal(new Rational(3, 4)).should.be.true;
        });

        it('should return the correct quotient for negative operands', () => {
            div(
                new Rational(5, 2),
                new Rational(10, 3, -1)
            ).equal(new Rational(3, 4, -1)).should.be.true;
            div(
                new Rational(5, 2, -1),
                new Rational(10, 3, -1)
            ).equal(new Rational(3, 4)).should.be.true;
        });

        it('should accept primitive number types as operands', () => {
            div(-3, 2).equal(new Rational(3, 2, -1)).should.be.true;
        });

        describe('Infinities', () => {
            it('should evaluate Inf/Inf to NaN', () => {
                div(Infinity, Infinity).valueOf().should.be.NaN;
            });

            it('should evaluate Inf/0 to Inf', () => {
                div(Infinity, 0).valueOf().should.equal(Infinity);
            });

            it('should evaluate 0/Inf to 0', () => {
                div(0, Infinity).valueOf().should.equal(0);
            });

            it('should evaluate 0/0 to NaN', () => {
                div(0, 0).valueOf().should.be.NaN;
            });

            it('should evaluate Inf/<finite number> to Inf', () => {
                div(Infinity, 3).valueOf().should.equal(Infinity);
            });

            it('should evaluate <finite number>/Inf to 0', () => {
                div(3, Infinity).valueOf().should.equal(0);
            });

            it('should correctly carry through negative numbers', () => {
                div(-Infinity, 1).valueOf().should.equal(-Infinity);
            });
        });
    });

});

