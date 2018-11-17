function fastFactorize(n) {
    const primeFactors = [];
    const sqrt = ~~Math.sqrt(n);

    let i = 2; // smallest prime
    while (i <= sqrt && n != 1) {
        if (n % i == 0) {
            primeFactors.push(i);
            n /= i;
        } else {
            i ++;
        }
    }

    if (n != 1) {
        primeFactors.push(n);
    }

    return primeFactors;
}

module.exports = fastFactorize;

