<?php $this->load->view('defaults/footer_message'); ?>
		</div>
<?php

//stats
$this->load->view('defaults/stats');

//codemirror modes
if(isset($codemirror_modes)){
    echo '<div style="display: none;" id="codemirror_modes">' . json_encode($codemirror_modes) . '</div>';
}

//ace modes
if(isset($ace_modes)){
    echo '<div style="display: none;" id="ace_modes">' . json_encode($ace_modes) . '</div>';
}

//Javascript
$this->carabiner->js('jquery.js');
$this->carabiner->js('jquery.timers.js');
$this->carabiner->js('jquery-ui-selectable-combined.min.js');
$this->carabiner->js('bootstrap.bundle.min.js');
$this->carabiner->js('crypto-js/rollups/aes.js');
$this->carabiner->js('lz-string-1.3.3-min.js');
$this->carabiner->js('filereader.js');
$this->carabiner->js('linkify.min.js');
$this->carabiner->js('linkify-jquery.min.js');
if(config_item('js_editor') == 'codemirror') {
    $this->carabiner->js('codemirror/lib/codemirror.js');
}
if(config_item('js_editor') == 'ace') {
    $this->carabiner->js('ace/ace.js');
}
$this->carabiner->js('snip.js');

$this->carabiner->display('js');

?>

<!-- Light/Dark Theme Toggle -->
<div class="container my-3">
    <div class="d-flex justify-content-end">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="themeToggle">
            <label class="form-check-label" for="themeToggle"><?php echo lang('color_mode'); ?></label>
        </div>
    </div>
</div>

<!-- External GDPR JS Cookie Script https://cookie-bar.eu/ -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/cookie-bar/cookiebar-latest.min.js?theme=flying&always=1"></script>

	</body>
</html>
