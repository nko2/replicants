var $ = require('jquery-browserify');

$(window).ready(function () {
    if (!window.navigator.userAgent.match(/chrome|chromium/i)) {
        $('<div>')
            .addClass('alert')
            .append(
                $('<img>').attr('src', '/img/chrome.png'),
                $('<div>').text(
                    "You don't appear to be using chrome, "
                    + "so this app might not work."
                )
            )
            .prependTo(document.body)
            .hide()
            .slideDown(400)
        ;
    }

    var iframe = $('<iframe>')
        .attr({
            src : 'about:blank',
            width : 800,
            height : 300
        })
        .hide()
        .insertBefore($('#example0'))
    ;
    var loading = $('<div>')
        .addClass('loading')
        .text('loading')
        .hide()
        .insertBefore($('#example0'))
    ;
    
    var nko_button_appended = false;
    $('#run').click(function () {
        var src = $('#source').val();
        
        loading.fadeIn(100);
        var i = 0;
        var iv = setInterval(function () {
            loading.text('loading.' + Array(i++ % 3 + 1).join('.'))
        }, 500);
        
        iframe
            .attr('src', '/frame/' + escape(src))
            .attr('height', src.split('\n').length * 20 * 0.87 + 80)
            .slideDown(400)
            .load(function () {
                clearInterval(iv);
                loading.fadeOut(800);
            })
        ;

        if (nko_button_appended == false) {
            var nko_button = '<iframe src="http://nodeknockout.com/iframe/replicants" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';

            var div = $('<div>')
                .attr({ id : 'nko_button_sneaky'})
                .append(nko_button)
                .insertAfter(iframe)

            nko_button_appended = true;
        }
    });
});
