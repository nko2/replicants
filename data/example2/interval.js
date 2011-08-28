var i = 0;
var sum = 0;
var iv = setInterval(function () {
    sum += i;
    if (i++ === 10) {
        clearInterval(iv);
    }
}, 300);
