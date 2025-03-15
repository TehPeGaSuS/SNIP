<!DOCTYPE html>
<?php
$page_title = '';
if(isset($title))
{
    $page_title .= $title . ' - ';
}
$page_title .= $this->config->item('site_name');

$page_description = '';
if(isset($description))
{
    $page_description .= $description . ' - ';
}
$page_description .= $this->config->item('site_description');
?>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo $page_title; ?></title>
		<meta name="description" content="<?php echo $page_description; ?>">
		<link rel="shortcut icon" href="<?php echo base_url() . 'favicon.ico'; ?>" />
<?php

// Carabiner configuration
$this->carabiner->config(array(
    'script_dir' => 'themes/bootstrap5/js/',
    'style_dir'  => 'themes/bootstrap5/css/',
    'cache_dir'  => 'static/asset/',
    'base_uri'   => base_url(),
    'combine'    => true,
    'dev'        => !$this->config->item('combine_assets'),
));

$this->carabiner->css('bootstrap.min.css');
$this->carabiner->css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
$this->carabiner->css('style.css');
$this->carabiner->css('codemirror.css');

$this->carabiner->display('css'); 

$searchparams = ($this->input->get('search') ? '?search=' . $this->input->get('search') : '');
?>
	<script type="text/javascript">
		var base_url = '<?php echo base_url(); ?>';
	</script>
	</head>
	<body>
		<header>
			<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top custom-navbar">
				<div class="container">
					<a class="navbar-brand" href="<?php echo base_url(); ?>"><?php echo $this->config->item('site_name'); ?></a>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
					        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarNav">
						<ul class="navbar-nav">
							<?php $l = $this->uri->segment(1); ?>
							<?php if($this->config->item('enable_adminlink')) { ?>
								<li class="nav-item">
									<a class="nav-link <?php if($l == 'spamadmin') echo 'active'; ?>" href="<?php echo base_url() . 'spamadmin'; ?>" title="<?php echo lang('menu_admin'); ?>"><?php echo lang('menu_admin'); ?></a>
								</li>
							<?php } ?>
							<li class="nav-item">
								<a class="nav-link <?php if($l == "") { echo 'active'; } ?>" href="<?php echo base_url(); ?>" title="<?php echo lang('menu_create_title'); ?>"><?php echo lang('menu_create'); ?></a>
							</li>
							<?php if(!$this->config->item('private_only') && !$this->config->item('disable_recent')) { ?>
								<li class="nav-item">
									<a class="nav-link <?php if($l == "lists" || ($l == "view" && $this->uri->segment(2) != "options")) { echo 'active'; } ?>" href="<?php echo site_url('lists'); ?>" title="<?php echo lang('menu_recent_title'); ?>"><?php echo lang('menu_recent'); ?></a>
								</li>
							<?php } ?>
							<?php if(!$this->config->item('private_only') && !$this->config->item('disable_trends')) { ?>
								<li class="nav-item">
									<a class="nav-link <?php if($l == "trends") { echo 'active'; } ?>" href="<?php echo site_url('trends'); ?>" title="<?php echo lang('menu_trending_title'); ?>"><?php echo lang('menu_trending'); ?></a>
								</li>
							<?php } ?>
							<?php if(!$this->config->item('disable_api')) { ?>
								<li class="nav-item">
									<a class="nav-link <?php if($l == "api") { echo 'active'; } ?>" href="<?php echo site_url('api'); ?>" title="<?php echo lang('menu_api'); ?>"><?php echo lang('menu_api'); ?></a>
								</li>
							<?php } ?>
							<?php if(!$this->config->item('disable_about')) { ?>
								<li class="nav-item">
									<a class="nav-link <?php if($l == "about") { echo 'active'; } ?>" href="<?php echo site_url('about'); ?>" title="<?php echo lang('menu_about'); ?>"><?php echo lang('menu_about'); ?></a>
								</li>
							<?php } ?>
						</ul>
					</div>
				</div>
			</nav>
		</header>

		<?php if ($this->config->item('alert_banner')) { ?>
			<!-- Alert Banner -->
			<div class="container mt-5 mt-md-4 pt-4">
				<div class="alert alert-banner" role="alert">
					<h5><?php echo lang('alert_banner'); ?></h5>
				</div>
			</div>
		<?php } ?>

		<div class="container mt-5 mt-md-4 pt-4">
			<?php if(isset($status_message)) { ?>
				<div class="alert alert-success" role="alert">
					<?php echo $status_message; ?>
				</div>
			<?php } ?>
