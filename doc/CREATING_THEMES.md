How to create your own theme
----------------------------

1. Make a copy of the folder htdocs/themes/bootstrap5, and name it as you like.
2. Start customizing your files!
3. Delete everything that has not been changed.

For example: If you've only modified the main.css, create a folder named "css" in your theme folder, and put your main.css in there.
The theme engine will load your css, and falls back to files in the default theme that aren't in your theme folder.

Note: Image files need to reside in the /images folder and it can't contain sub-directories.

Examples:

* gabdark - a theme with only a modified main.css
* bootstrap5 - a full theme with custom html, css, js and images

*Please note that the best supported theme is bootstrap5, so you should base any new theme on this.*
