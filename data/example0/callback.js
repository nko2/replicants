var sum = 0;

setInterval(function() {
    var x = sum % 10;
    var y = x * 3 + 2;
    sum += y;
}, 1000);
