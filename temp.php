<?php
$_SERVER['REQUEST_URI']='/unknown-page-route';
$_SERVER['SCRIPT_NAME']='/index.php';
ob_start();
require 'public/index.php';
echo strpos(ob_get_clean(), 'data-route-id="404"') !== false ? 'PASS' : 'FAIL';
