<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/userguide3/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'main';
$route['404_override'] = 'main/error_404';
$route['translate_uri_dashes'] = FALSE;

$route['scaffolding_trigger'] = '';

$route['cron/:any'] = 'main/cron';
$route['post_encrypted'] = 'main/post_encrypted';

$route['view/raw/:any'] = 'main/raw';
$route['view/rss/:any'] = 'main/rss';
$route['view/embed/:any'] = 'main/embed';
$route['view/qr/:any'] = 'main/qr';
$route['view/download/:any'] = 'main/download';
$route['view/captcha'] = 'main/captcha';
$route['view/:any'] = 'main/view';
$route['view/:any/:num'] = 'main/view';
$route['view/:any/diff'] = 'main/view';
$route['lists'] = 'main/lists';
$route['lists/rss'] = 'main/lists/rss';
$route['lists/:num'] = 'main/lists/$1';
$route['trends'] = 'main/trends';
$route['trends/:any'] = 'main/trends/$1';
$route['spamadmin/:num'] = 'spamadmin/index';
$route['spamadmin/del/(:any)'] = 'spamadmin/del/$1';
$route['spamadmin/blacklist'] = 'spamadmin/blacklist';
$route['spamadmin/blacklist/(:num)'] = 'spamadmin/blacklist';
$route['spamadmin/blacklist/unblock/(:any)'] = 'spamadmin/unblock_ip';
$route['spamadmin/:any'] = 'spamadmin/spam_detail';
$route['about'] = 'main/about';

$route['iphone/:num'] = 'iphone';
$route['iphone/view/:any'] = 'iphone/view';

$route['robots.txt'] = 'main/robots_txt';

$route['themes/:any/css/.+'] = 'theme_assets/css';
$route['themes/:any/images/.+'] = 'theme_assets/images';
$route['themes/:any/img/.+'] = 'theme_assets/images';
$route['themes/:any/js/.+'] = 'theme_assets/js';
$route['themes/:any/fonts/.+'] = 'theme_assets/fonts';
