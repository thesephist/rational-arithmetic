function fastIntersect(a, b) {
    // intersection of two SORTED lists, a and b

    a = a.slice();
    b = b.slice();
    const intersection = [];

    const shorter = a.length < b.length ? a : b;
    const longer = a === shorter ? b : a;
    const len = shorter.length;

    for (const val of shorter) {
        const pos = longer.indexOf(val);
        if (pos > -1) {
            intersection.push(val);
            longer.splice(pos, 1);
        }
    }

    return intersection;
}

module.exports = fastIntersect;

