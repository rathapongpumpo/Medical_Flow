<?php
// PHP Front Controller for Medical Flow & Queue Management System Prototype

// Define base path
if (!defined('BASE_PATH')) {
    define('BASE_PATH', dirname(__DIR__));
}

// Route Map
$routes = [
    '/public-display' => [
        'view' => 'public-display',
        'title' => 'Public Display - Medical Flow',
        'css' => [],
        'js' => ['pages/public-display.js']
    ],
    '/' => [
        'view' => 'dashboard',
        'title' => 'Dashboard - Medical Flow',
        'css' => ['pages/dashboard.css'],
        'js' => ['pages/dashboard.js']
    ],
    '/check-in' => [
        'view' => 'check-in',
        'title' => 'Check-in - Medical Flow',
        'css' => ['pages/check-in.css'],
        'js' => ['pages/check-in.js']
    ],
    '/operations/board' => [
        'view' => 'operational-board',
        'title' => 'Operational Board - Medical Flow',
        'css' => ['pages/operational-board.css'],
        'js' => ['pages/operational-board.js']
    ],
    '/rooms' => [
        'view' => 'room-board',
        'title' => 'Room Board - Medical Flow',
        'css' => ['pages/room-board.css'],
        'js' => ['pages/room-board.js']
    ],
    '/reports' => [
        'view' => 'reports',
        'title' => 'Reports - Medical Flow',
        'css' => ['pages/reports.css'],
        'js' => ['pages/reports.js']
    ],
    '/manual' => [
        'view' => 'user-manual',
        'title' => 'คู่มือการใช้งานระบบ - Medical Flow',
        'css' => [],
        'js' => []
    ],
    '/settings/workflows' => [
        'view' => 'workflow-list',
        'title' => 'Workflows - Medical Flow',
        'css' => ['pages/workflow-list.css'],
        'js' => ['pages/workflow-list.js']
    ]
];

// Get current URI path
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
// Handle subdirectory deployment if necessary (e.g. localhost/medical-flow/public/...)
// Assuming running via php -S localhost:8000 for local dev
$path = rtrim($requestUri, '/') ?: '/';

// Resolve Route
$pageData = $routes[$path] ?? null;

if ($pageData) {
    $view = $pageData['view'];
    $pageMetadata = [
        'title' => $pageData['title'],
        'css' => $pageData['css'] ?? [],
        'js' => $pageData['js'] ?? []
    ];
    $viewFile = BASE_PATH . '/app/Views/pages/' . $view . '.php';
} else {
    // 404 Route
    http_response_code(404);
    $view = '404';
    $pageMetadata = [
        'title' => 'Page Not Found - Medical Flow',
        'css' => [],
        'js' => []
    ];
    $viewFile = BASE_PATH . '/app/Views/pages/404.php';
}

// Load main layout which will include the resolved view
require BASE_PATH . '/app/Views/layouts/main.php';
