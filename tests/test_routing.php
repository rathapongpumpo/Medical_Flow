<?php
// tests/test_routing.php

// Simulate $_SERVER for public/index.php
$_SERVER['REQUEST_URI'] = '/';
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Capture output
ob_start();
require __DIR__ . '/../public/index.php';
$output = ob_get_clean();

$pass = true;

// TC-FND-001: Route หลักเปิดได้
if (strpos($output, 'data-route-id="dashboard"') !== false) {
    echo "TC-FND-001 / Main Route (/) check: PASS\n";
} else {
    echo "TC-FND-001 / Main Route (/) check: FAIL\n";
    $pass = false;
}

// TC-FND-001: Unknown Route คืน 404
$_SERVER['REQUEST_URI'] = '/unknown-page-route';
ob_start();
require __DIR__ . '/../public/index.php';
$output404 = ob_get_clean();

if (strpos($output404, 'data-route-id="404"') !== false) {
    echo "TC-FND-001 / Unknown Route (404) check: PASS\n";
} else {
    echo "TC-FND-001 / Unknown Route (404) check: FAIL\n";
    $pass = false;
}

// TC-FND-002: PHP Page Source ไม่มี Transaction Data
// Ensure no business logic or transaction data is embedded in the HTML
$hasTransactionData = preg_match('/(window\.appData|var\s+data\s*=|queueTickets|patients)/i', $output);
if (!$hasTransactionData) {
    echo "TC-FND-002 / PHP Page Source (No Transaction Data) check: PASS\n";
} else {
    echo "TC-FND-002 / PHP Page Source (No Transaction Data) check: FAIL\n";
    $pass = false;
}

if (!$pass) {
    exit(1);
}
