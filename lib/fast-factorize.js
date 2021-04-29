function fastFactorize(n) {
    const primeFactors = [];
    const sqrt = n == Infinity ? 0 : Math.floor(Math.sqrt(n));

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

