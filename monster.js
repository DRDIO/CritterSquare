var srand = require('srand')
  , prefix = ['dali', 'pika', 'laga', 'sora', 'jorn']
  , suffix = ['mon', 'digi', 'frag', 'kron', 'alba']
;

exports.random = function(min, max) {
    return Math.floor(srand.random() * (max - min + 1)) + min;    
}

exports.getName = function() {
    return prefix[exports.random(0, prefix.length - 1)]
        + suffix[exports.random(0, suffix.length - 1)];
}

exports.getPower = function(checkinCount, userCount) {
    return Math.floor(10 * (1 - Math.exp(-userCount / 1000)));
}

exports.create = function(seed, type, checkinCount, userCount) {
    var intSeed = Math.floor(parseInt(seed, 16) / 137438953536);
    srand.seed(intSeed);
    
    console.log(seed + ' ' + intSeed + ' ' + srand.random());
    
    return {
        name: exports.getName(),
        type: type,
        body: {
            head: exports.random(1, 5),
            core: exports.random(1, 5),
            back: exports.random(1, 5),
            arms: exports.random(1, 5),
            legs: exports.random(1, 5)
        },
        power: exports.getPower(checkinCount, userCount)
    }
};