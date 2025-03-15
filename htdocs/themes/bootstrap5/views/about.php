<?php $this->load->view("defaults/header");?>

<div class="row">
	<div class="span12">
		<div class="page-header mb-4">
			<h1>About</h1>
		</div>
	</div>
	<div class="span12">
	<p>SNIP is an Open-Source PHP Pastebin, with the aim of keeping a simple and easy to use user interface.</p>
    <p>SNIP allows you to easily share code with anyone you wish. Here are some features:</p>

    <ul>
        <li>Easy setup</li>
        <li>Syntax highlighting for many languages, including live syntax highlighting with CodeMirror</li>
        <li>Paste replies</li>
        <li>Diff view between the original paste and the reply</li>
        <li>An API</li>
        <li>File upload and preview</li>
        <li>Trending pastes</li>
        <li>Anti-Spam features</li>
        <li>Themes support</li>
        <li>Multilanguage support</li>
        <li>And many more... Visit the <a href="<?php echo proj_url(); ?>">GitHub Repo</a></li>
    </ul>
	</div>
</div>

<?php $this->load->view("defaults/footer");?>
