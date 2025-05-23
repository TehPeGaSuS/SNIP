<?php $this->load->view("defaults/header"); ?>

<div class="row">
	<div class="col-12">
		<div class="page-header mb-4">
			<h1>API</h1>
		</div>
	</div>
	<div class="col-12">
	    <p class="explain border">Create pastes from the commandline</p>

        <?php if (config_item('private_only')) { echo "<p class='explain'><font style='color:red;font-weight:bold;'>NOTICE: Private mode is active. Some API endpoints are unavailable.</font></p>"; } ?>

        <h2>API URL</h2>
        <p class="explain"><code><?php echo site_url('api'); ?></code></p>

        <h2>Get paste</h2>
        <p class="explain"><code><?php echo site_url('api/paste/[pasteid]'); ?></code></p>

        <h2><?php if (config_item('private_only')) { echo "<strike>"; } ?>Get random paste<?php if (config_item('private_only')) { echo "</strike>"; } ?></h2>
        <p class="explain"><code><?php echo site_url('api/random'); ?></code></p>

        <h2><?php if (config_item('private_only')) { echo "<strike>"; } ?>Get recent pastes<?php if (config_item('private_only')) { echo "</strike>"; } ?></h2>
        <p class="explain"><code><?php echo site_url('api/recent'); ?></code></p>

        <h2><?php if (config_item('private_only')) { echo "<strike>"; } ?>Get trending pastes<?php if (config_item('private_only')) { echo "</strike>"; } ?></h2>
        <p class="explain"><code><?php echo site_url('api/trending'); ?></code></p>

        <h2>List available languages</h2>
        <p class="explain"><code><?php echo site_url('api/langs'); ?></code></p>

        <h2>Create a paste</h2>
        <p class="explain"><code><?php echo site_url('api/create'); ?></code></p>

		<h3>POST parameters</h3>
		<code>text=[your paste text]</code>
	    <p class="explain">The paste content. Required.</p>

		<code>title=[title]</code>
	    <p class="explain">Title for the paste.</p>

		<code>name=[name]</code>
	    <p class="explain">The author's name.</p>

		<code>private=1</code>
	    <p class="explain">Make paste private.</p>

		<code>lang=[language]</code>
	    <p class="explain">
		Use alternative syntax highlighting.<br />
		Possible values: <?php echo str_replace(", 0,", ",", $languages); ?>
	    </p>

		<code>expire=[minutes]</code>
	    <p class="explain">Set paste expiration.</p>

		<code>reply=[pasteid]</code>
	    <p class="explain">Reply to existing paste.</p>

		<h3>Return values</h3>
	    <p class="explain">
		On success, the API returns the paste URL: <code>{"url":"<?php echo site_url('view/[pasteid]'); ?>"}</code><br />
		On error, the API returns the error message: <code>{"error":"Missing paste text"}</code>
	    </p>

		<h2>EXAMPLES</h2>
		<h3>Create paste</h3>
		<code>curl -d text='this is my text' <?php echo site_url('api/create'); ?></code>
	    <p class="explain">Create a paste with the text 'this is my text'.</p>

		<h3>Create paste from a file</h3>
		<code>curl -d private=1 -d name=Herbert --data-urlencode text@/etc/passwd <?php echo site_url('api/create'); ?></code>
	    <p class="explain">Create a private paste with the author 'Herbert' and the contents of '/etc/passwd'.</p>

		<h3>Create paste from a php file</h3>
		<code>curl -d lang=php --data-urlencode text@main.php <?php echo site_url('api/create'); ?></code>
	    <p class="explain">Create a paste with PHP syntax highlighting.</p>

		<h3>Create paste via a pipe</h3>
		<code>echo foo | curl --data-urlencode text@- <?php echo site_url('api/create'); ?></code>
	    <p class="explain">Create a paste based on standard output of a command.</p>

		<h3>Create paste via a pipe with sudo, text format, setting the author and a 30 minute expiry</h3>
		<code>sudo dmesg | curl -d private=1 -d lang=text -d name=`whoami` -d expire=30 --data-urlencode text@- <?php echo site_url('api/create'); ?></code>
		<p class="explain">Create a paste based capturing sudo dmesg and showing how to employ optional parameters to the paste creation.</p>

		<h3>Get paste ;-)</h3>
		<code>curl <?php echo site_url('view/raw/[pasteid]'); ?></code>
	    <p class="explain">Display paste.</p>
	</div>
</div>

<?php $this->load->view("defaults/footer"); ?>
