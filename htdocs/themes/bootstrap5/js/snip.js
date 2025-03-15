var ST = window.ST || {};

ST.show_embed = function () {
    $embed_field = $('#embed_field');
    var lang_showcode = $embed_field.data('lang-showcode');
    $embed_field.hide();
    $embed_field.after('<a id="show_code" href="#">' + lang_showcode + '</a>');
    $('#show_code').on('click', function (e) {
        e.preventDefault();
        $(this).hide();
        $embed_field.show().select();
    });
    $embed_field.on("blur", function () {
        $(this).hide();
        $('#show_code').show();
    });
};

ST.spamadmin = function () {
    if ($('.content h1').text() == 'Spamadmin') {
        $('.content .hidden').show();
        $('.content .quick_remove').live('click', function (ev) {
            var ip = $(ev.target).data('ip');
            if (confirm('Delete all pastes belonging to ' + ip + '?')) {
                $.post(base_url + 'spamadmin/' + ip, {
                    'confirm_remove': 'yes',
                    'block_ip': 1
                }, function () {
                    window.location.reload();
                });
            }
            return false;
        });
    }

    // needed by .selectable
    $.fn.addBack = function (selector) {
        return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }

    $('.selectable>tbody').selectable({
        filter: 'tr',
        cancel: 'a',
        stop: function () {
            var $deletestack = $(".paste_deletestack");
            var $input = $("input[name=pastes_to_delete]");
            $('.inv').show();
            $deletestack.empty();
            $input.empty();
            var res = [];
            $(".ui-selected").each(function (i, el) {
                var id = $('a', el).attr('href').split('view/')[1];
                res.push(id);
            });
            $deletestack.text(res.join(' '));
            $input.val(res.join(' '));
        }
    });
};

ST.line_highlighter = function () {
    var org_href = window.location.href.replace(/(.*?)#(.*)/, '$1');
    var first_line = false;
    var second_line = false;

    $('blockquote').on('mousedown', function (ev) {
        if (ev.which == 1) { // left mouse button has been clicked
            window.getSelection().removeAllRanges();
        }
    });

    $('blockquote').on('click', 'li', function (ev) {
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

ST.highlight_lines = function () {
    var wloc = window.location.href;
    if (wloc.indexOf('#') > -1) {
        $('.container .CodeMirror li').css('background', 'none');

        var lines = wloc.split('#')[1];
        if (lines.indexOf('-') > -1) {
            var start_line = parseInt(lines.split('-')[0].replace('L', ''), 10);
            var end_line = parseInt(lines.split('-')[1].replace('L', ''), 10);
            for (var i = start_line; i <= end_line; i++) {
                $('.container .CodeMirror li:nth-child(' + i + ')').css('background', '#F8EEC7');
            }
        } else {
            var re = new RegExp('^L[0-9].*?$');
            var r = lines.match(re);
            if (r) {
                var marked_line = lines.replace('L', '');
                $('.container .CodeMirror li:nth-child(' + marked_line + ')').css('background', '#F8EEC7');
            }
        }
    }
}

ST.crypto = function () {
    $('button[name=submit]').after('<button type="submit" id="create_encrypted" class="btn btn-success">' + '<i class="fa-solid fa-lock"></i> Create encrypted' + '</button>');
    $('#create_encrypted').on('click', function () {
        var $code = $('#code');
        var content = '';

        // Check if CodeMirror is enabled and initialized
        if (typeof ST.cm_editor !== 'undefined') {
            // Get content from CodeMirror editor
            content = ST.cm_editor.getValue();
        } else {
            // Fallback to regular textarea
            content = $code.val();
        }

        // Check if the Paste textarea or CodeMirror is empty
        if (content.trim() === '') {
            $code.css('border', '2px solid red'); // Highlight the Paste text field in red
            return false; // Prevent further execution if the textarea is empty
        }

        // The textarea has content, proceed with encryption
        var key = ST.crypto_generate_key(32);
        var plaintext = LZString.compressToBase64(content);
        var encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();

        // Linebreak after 100 chars for the encrypted output
        encrypted = encrypted.replace(/(.{100})/g, "$1\n");

        // Post request via JS
        $.post(base_url + 'post_encrypted', {
            'name': $('#name').val(),
            'title': $('#title').val(),
            'code': encrypted,
            'lang': $('#lang').val(),
            'expire': $('#expire').val(),
            'captcha': $('#captcha').val(),
            'reply': $('input[name=reply]').val()
        },
        function (redirect_url) {
            if (redirect_url.indexOf('E_CAPTCHA') > -1) {
                $('.container .message').remove();
                $('.container:eq(1)').prepend('<div class="message error"><div class="container">The captcha is incorrect.</div></div>');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' // Adds smooth scrolling
                });
            } else if (redirect_url.indexOf('invalid') > -1) {
                // Burn on read
                redirect_url = redirect_url.replace('" /><!-- behind you -->', '#' + key + '" />');
                $('#create_encrypted').parent().html('<p>' + redirect_url + '</p>');
            } else {
                window.location.href = base_url + redirect_url + '#' + key;
            }
        });

        return false;
    });

    // Decryption routine
    var w_href = window.location.href;
    if (w_href.indexOf('#') > -1) {
        var key = w_href.split('#')[1];
        var re = new RegExp('^L[0-9].*?$');
        var r = key.match(re);
        if (key.indexOf('-') > -1 || r) {
            // Line highlighter
        } else {
            try {
                var $code = $('#code');
                var encrypted = $code.text().replace(/[^A-Za-z0-9+\/=]/g, '');
                var decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
                decrypted = LZString.decompressFromBase64(decrypted);

                if (typeof ST.cm_editor !== 'undefined') {
                    // Set decrypted content to CodeMirror
                    ST.cm_editor.setValue(decrypted);
                } else {
                    // Set decrypted content to regular textarea
                    $code.val(decrypted);
                }

                // Add a breaking_space after 90 chars (for later)
                decrypted = decrypted.replace(/(.{90}.*?) /g, "$1{{{breaking_space}}}");

                // Remove HTML entities
                decrypted = decrypted
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/ /g, '&nbsp;')
                    .replace(/{{{breaking_space}}}/g, ' ')
                    .replace(/\n/g, '<br />');

                // Display decrypted content (for formatted output)
                $('.row .span12 .CodeMirror').html(decrypted);

                // Hide unnecessary elements
                $('.text_formatted').css('background', '#efe');
                $('.replies').hide();
                for (var i = 2; i <= 7; i++) {
                    $('.meta .detail:nth-child(' + i + ')').hide();
                }
                $('.meta .spacer:first').hide();
                $('.qr').hide();
            } catch (e) {
                console.error('Decryption failed: ', e);
            }
        }
    }
}

// generate a random key
ST.crypto_generate_key = function (len) {
    var index = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var key = '';
    for (var i = 0; i < len; i++) {
        key += index[Math.floor(Math.random() * index.length)]
    };
    return key;
}

ST.dragdrop = function () {
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
            loadend: function (e, file) {
                try {
                    var words = CryptoJS.enc.Base64.parse(e.target.result.split(',')[1]);
                    var utf8 = CryptoJS.enc.Utf8.stringify(words);
                    $('#code').val(utf8);
                } catch (err) {
                    console.error(err);
                    console.info('event: ', e);
                    console.info('file: ', file);
                };
            }
        }
    });
}

ST.ace_init = function () {
    // prepare the editor, needs to be a div
    var $code = $('#code');

    // exit if there is no #code textarea
    if ($code.length < 1) {
        return false;
    }

    if (typeof ace == 'undefined') {
        return false;
    }

    // replace textarea
    $code.after('<div id="editor" style="left: 0px; height: 379px;"></div>');
    $code.hide();

    // init modes
    ST.ace_modes = $.parseJSON($('#ace_modes').text());

    // init ace
    ace.config.set("basePath", base_url + "themes/default/js/ace");
    ST.ace_editor = ace.edit("editor");
    ST.ace_editor.setTheme("ace/theme/clouds");
    ST.ace_editor.getSession().setValue($code.val());
    ST.ace_editor.getSession().on('change', function (e) {
        $code.val(ST.ace_editor.getValue());
    });
    ST.ace_setlang();
    $('#lang').change(function () {
        ST.ace_setlang();
    });
}

ST.ace_setlang = function () {
    var lang = $('#lang').val();
    var mode = '';
    try {
        mode = ST.ace_modes[lang];
    } catch (undefined) {
        mode = 'text';
    }
    if (mode === undefined) {
        mode = 'text';
    }
    ST.ace_editor.getSession().setMode("ace/mode/" + mode);
}

ST.codemirror_init = function () {
    if (typeof CodeMirror == 'undefined') {
        return false;
    }
    ST.cm_modes = $.parseJSON($('#codemirror_modes').text());
    $('#lang').change(function () {
        ST.codemirror_setlang();
    });
    if (typeof ST.cm_editor == 'undefined') {
        ST.cm_editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            mode: "scheme",
            lineNumbers: true,
            lineWrapping: true,
            tabMode: "indent"
        });
    }
    ST.codemirror_setlang();
}

ST.codemirror_setlang = function () {
    var lang = $('#lang').val();
    var mode = ST.cm_modes[lang];

    $.get(base_url + 'main/get_cm_js/' + lang,
        function (data) {
            if (data != '') {
                ST.cm_editor.setOption('mode', mode);
            } else {
                ST.cm_editor.setOption('mode', null);
            }
        },
        'script');
}

ST.clickable_urls = function () {
    $('.container .row .span12').linkify();
}

ST.init = function () {
    ST.show_embed();
    ST.spamadmin();
    ST.line_highlighter();
    ST.crypto();
    ST.dragdrop();
    ST.clickable_urls();
    ST.codemirror_init();
    ST.ace_init();
};

$(document).ready(function () {
    ST.init();
});

document.addEventListener('DOMContentLoaded', function () {
    var themeToggle = document.getElementById('themeToggle');
    var nav = document.querySelector('nav.navbar');
    var table = document.querySelector('.recent.table');

    if (!themeToggle) return;

    // Function to apply the theme
    function applyTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);

        if (nav) {
            nav.classList.remove('navbar-light', 'bg-light', 'navbar-dark', 'bg-dark');
            nav.classList.add(isDark ? 'navbar-dark' : 'navbar-light');
            nav.classList.add(isDark ? 'bg-dark' : 'bg-light');
        }

        if (table) {
            table.classList.toggle('table-dark', isDark);
        }

        themeToggle.checked = isDark;
        localStorage.setItem('darkTheme', isDark ? 'true' : 'false');
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply initial theme
    if (savedTheme) {
        applyTheme(savedTheme === 'true');
    } else if (prefersDark) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        // Only apply system preference if no manual preference is saved
        if (!localStorage.getItem('darkTheme')) {
            applyTheme(event.matches);
        }
    });

    // Theme toggle event listener (for manual toggling)
    themeToggle.addEventListener('change', function () {
        applyTheme(this.checked);
    });
});
