var $ = require('jquery-browserify');

$(window).ready(function () {
    if (!window.navigator.userAgent.match(/chrome|chromium/i)) {
        $('<div>')
            .addClass('alert')
            .append(
                $('<img>').attr('src', '/img/chrome.png'),
                $('<div>').text(
                    'You don\'t seem to be using chrome, '
                    + 'so this app might not work very well.'
                )
            )
            .prependTo(document.body)
            .hide()
            .slideDown(400)
        ;
    }
    
    var iframe = $('<iframe>').attr('src', 'about:blank')
        .hide()
        .insertBefore($('#example0'))
    ;
    var loading = $('<div>')
        .addClass('loading')
        .text('loading')
        .hide()
        .insertBefore($('#example0'))
    ;
    
    $('#run').click(function () {
        var src = $('#source').val();
        
        loading.fadeIn(100);
        var i = 0;
        var iv = setInterval(function () {
            loading.text('loading.' + Array(i++ % 3 + 1).join('.'))
        }, 500);
        
        iframe
            .attr('src', '/frame/' + escape(src))
            .height(src.split('\n').length * 20 * 0.87 + 80)
            .slideDown(400)
            .load(function () {
                clearInterval(iv);
                loading.fadeOut(800);
            })
        ;
    });
});
