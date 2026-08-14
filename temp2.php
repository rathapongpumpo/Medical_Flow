<?php
$_SERVER['REQUEST_URI']='/unknown-page-route';
$_SERVER['SCRIPT_NAME']='/index.php';
ob_start();
require 'public/index.php';
echo ob_get_clean();
