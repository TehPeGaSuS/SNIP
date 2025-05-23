var ST = window.ST || {}

ST.show_embed = function() {
    $embed_field = $('#embed_field');
    var lang_showcode = $embed_field.data('lang-showcode');
    $embed_field.hide();
    $embed_field.after('<a id="show_code" href="#">' + lang_showcode + '</a>');
    $('#show_code').live('click',
        function() {
            $(this).hide();
            $embed_field.show().select();
            return false;
        });
};

ST.expand = function() {
    $('.expander').show();
    $('.expand').click(function() {
        if ($('.paste').hasClass('full')) {
            return false;
        }
        var window_width = $(window).width();
        var spacer = 20;
        if (window_width < 900) {
            window_width = 900;
            spacer = 0;
        }
        var new_width = (window_width - (spacer * 3));
        $('.text_formatted').animate({
                'width': new_width + 'px',
                'left': '-' + (((window_width - 900) / 2 - spacer)) + 'px'
            },
            200);
        return false;
    });
};

ST.spamadmin = function() {
    if ($('.content h1').text() == 'Spamadmin') {
        $('.content .hidden').show();
        $('.content .quick_remove').live('click', function(ev) {
            var ip = $(ev.target).data('ip');
            if (confirm('Delete all pastes belonging to ' + ip + '?')) {
                $.post(base_url + 'spamadmin/' + ip, {
                    'confirm_remove': 'yes',
                    'block_ip': 1
                }, function() {
                    window.location.reload();
                });
            }
            return false;
        });
    }
};

ST.line_highlighter = function() {
    var org_href = window.location.href.replace(/(.*?)#(.*)/, '$1');
    var first_line = false;
    var second_line = false;

    $('.text_formatted').on('mousedown', function(ev) {
        if (ev.which == 1) { // left mouse button has been clicked
            window.getSelection().removeAllRanges();
        }
    });

    $('.text_formatted').on('click', 'li', function(ev) {
        var $this = $(this);
        var li_num = ($this.index() + 1);
        if (ev.shiftKey == 1) {
            second_line = li_num;
        } else {
            first_line = li_num;
            second_line = false;
        }

        if (second_line) {
            // determine mark
            if (first_line < second_line) {
                sel_start = first_line;
                sel_end = second_line;
            } else {
                sel_start = second_line;
                sel_end = first_line;
            }
            window.location.href = org_href + '#L' + sel_start + '-L' + sel_end;
        } else {
            window.location.href = org_href + '#L' + first_line;
        }

        ST.highlight_lines();
    });
    ST.highlight_lines();
}

ST.highlight_lines = function() {
    var wloc = window.location.href;
    if (wloc.indexOf('#') > -1) {
        $('.text_formatted .container li').css('background', 'none');

        var lines = wloc.split('#')[1];
        if (lines.indexOf('-') > -1) {
            var start_line = parseInt(lines.split('-')[0].replace('L', ''), 10);
            var end_line = parseInt(lines.split('-')[1].replace('L', ''), 10);
            for (var i = start_line; i <= end_line; i++) {
                $('.text_formatted .container li:nth-child(' + i + ')').css('background', '#F8EEC7');
            }
        } else {
            var re = new RegExp('^L[0-9].*?$');
            var r = lines.match(re);
            if (r) {
                var marked_line = lines.replace('L', '');
                $('.text_formatted .container li:nth-child(' + marked_line + ')').css('background', '#F8EEC7');
            }
        }
    }
}

ST.crypto = function() {
    $('button[name=submit]').after(' <button id="create_encrypted" class="btn btn-large btn-success"><i class="fa fa-lock"></i> Create encrypted</button>');
    $('#create_encrypted').on('click', function() {
        var $code = $('#code');

        // Check if the Paste textarea is empty
        if ($code.val().trim() === '') {
            $code.css('border', '2px solid red'); // Highlight the Paste text field in red
            return false; // Prevent further execution if the textarea is empty
        }

        // The textarea has content, proceed with encryption
        var key = ST.crypto_generate_key(32);
        var plaintext = $code.val();
        plaintext = LZString.compressToBase64(plaintext);
        var encrypted = CryptoJS.AES.encrypt(plaintext, key) + '';

        // linebreak after 100 chars
        encrypted = encrypted.replace(/(.{100})/g, "$1\n");

        // post request via JS
        $.post(base_url + 'post_encrypted', {
                'name': $('#name').val(),
                'title': $('#title').val(),
                'code': encrypted,
                'lang': $('#lang').val(),
                'expire': $('#expire').val(),
                'captcha': $('#captcha').val(),
                'reply': $('input[name=reply]').val()
            },
            function(redirect_url) {
                if (redirect_url.indexOf('E_CAPTCHA') > -1) {
                    $('.container .message').remove();
                    $('.container:eq(1)').prepend('<div class="message error"><div class="container">The captcha is incorrect.</div></div>');
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth' // Adds smooth scrolling
                    });
                } else if (redirect_url.indexOf('invalid') > -1) {
                    $('#create_encrypted').parent().html('<p>' + redirect_url + '#' + key + '</p>');
                } else {
                    window.location.href = base_url + redirect_url + '#' + key;
                }
            });

        return false;
    });

    // decryption routine
    w_href = window.location.href;
    if (w_href.indexOf('#') > -1) {
        key = w_href.split('#')[1];
        var re = new RegExp('^L[0-9].*?$');
        var r = key.match(re);
        if (key.indexOf('-') > -1 || r) {
            // line highlighter
        } else {
            try {
                var $code = $('#code');
                var encrypted = $code.text().replace(/\n/g, '');
                var decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8) + '';
                decrypted = LZString.decompressFromBase64(decrypted);
                $code.val(decrypted);

                // add a breaking_space after 90 chars (for later)
                decrypted = decrypted.replace(/(.{90}.*?) /g, "$1{{{breaking_space}}}");

                // remove html entities
                decrypted = decrypted
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/ /g, '&nbsp;')
                    .replace(/{{{breaking_space}}}/g, ' ')
                    .replace(/\n/g, '<br />')

                $('.text_formatted .container div').html(decrypted);

                // kick out potential dangerous and unnecessary stuff
                $('.text_formatted').css('background', '#efe');
                $('.replies').hide();
                for (var i = 2; i <= 7; i++) {
                    $('.meta .detail:nth-child(' + i + ')').hide();
                }
                $('.meta .spacer:first').hide();
                $('.qr').hide();
            } catch (e) {}
        }
    }
}

// generate a random key
ST.crypto_generate_key = function(len) {
    var index = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var key = '';
    for (var i = 0; i < len; i++) {
        key += index[Math.floor(Math.random() * index.length)]
    };
    return key;
}

ST.filereader = function() {
    $("#code").fileReaderJS({
        // CSS Class to add to the drop element when a drag is active
        dragClass: "drag",

        // A string to match MIME types, for instance
        accept: false,

        // An object specifying how to read certain MIME types
        // For example: {
        //  'image/*': 'DataURL',
        //  'data/*': 'ArrayBuffer',
        //  'text/*' : 'Text'
        // }
        readAsMap: {},

        // How to read any files not specified by readAsMap
        readAsDefault: 'DataURL',
        on: {
            beforestart: function(e, file) {
                // return false if you want to skip this file
            },
            loadstart: function(e, file) { /* Native ProgressEvent */ },
            progress: function(e, file) { /* Native ProgressEvent */ },
            load: function(e, file) { /* Native ProgressEvent */ },
            error: function(e, file) { /* Native ProgressEvent */ },
            loadend: function(e, file) {
                try {
                    var words = CryptoJS.enc.Base64.parse(e.target.result.split(',')[1]);
                    var utf8 = CryptoJS.enc.Utf8.stringify(words);
                    $('#code').val(utf8);
                } catch (err) {
                    console.error(err);
                    console.info('event: ', e);
                    console.info('file: ', file);
                };
            },
            abort: function(e, file) { /* Native ProgressEvent */ },
            skip: function(e, file) {
                // Called when a file is skipped.  This happens when:
                //  1) A file doesn't match the accept option
                //  2) false is returned in the beforestart callback
            },
            groupstart: function(group) {
                // Called when a 'group' (a single drop / copy / select that may
                // contain multiple files) is receieved.
                // You can ignore this event if you don't care about groups
            },
            groupend: function(group) {
                // Called when a 'group' is finished.
                // You can ignore this event if you don't care about groups
            }
        }
    });
}

ST.init = function() {
    ST.expand();
    ST.show_embed();
    ST.spamadmin();
    ST.line_highlighter();
    ST.crypto();
    ST.filereader();
};

$(document).ready(function() {
    ST.init();
});

// Enable the usage of tabs in the default paste textarea
const textarea = document.getElementById('code');
textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end   = this.selectionEnd;

        // insert a tab character at the cursor position
        this.value = this.value.substring(0, start)
                    + '\t'
                    + this.value.substring(end);

        // move the cursor after the inserted tab
        this.selectionStart = this.selectionEnd = start + 1;
    }
});
