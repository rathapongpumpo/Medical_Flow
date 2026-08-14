<!DOCTYPE html>
<html lang="th" data-theme="default">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageMetadata['title'] ?? 'Medical Flow') ?></title>
    
    <!-- Google Fonts: Roboto (MD3 standard) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Foundation: Bootstrap 5.3 Grid, Utility, Accessibility -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
    <!-- Professional Icons: Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <!-- Design System CSS -->
    <link rel="stylesheet" href="/assets/css/tokens.css">
    <link rel="stylesheet" href="/assets/css/base.css">
    <link rel="stylesheet" href="/assets/css/layout.css">
    <link rel="stylesheet" href="/assets/css/utilities.css">
    <link rel="stylesheet" href="/assets/css/components.css">
    <link rel="stylesheet" href="/assets/css/pages/pages.css">
    
    <!-- Page Specific CSS -->
    <?php foreach (($pageMetadata['css'] ?? []) as $cssFile): ?>
        <link rel="stylesheet" href="/assets/css/<?= htmlspecialchars($cssFile) ?>">
    <?php endforeach; ?>
</head>
<body>
    <div id="app-root">
        <!-- App Header Container -->
        <div id="mf-header-container"></div>
        
        <div class="mf-app-shell">
            <!-- Sidebar Navigation Container -->
            <aside id="mf-sidebar-container" class="mf-sidebar"></aside>

            <!-- Main Content Area -->
            <div class="mf-main-wrapper">
                <main class="mf-main-content">
                    <?php
                        if (isset($viewFile) && file_exists($viewFile)) {
                            require $viewFile;
                        } else {
                            echo "<p>View file not found: " . htmlspecialchars($view ?? 'unknown') . "</p>";
                        }
                    ?>
                </main>
                <footer style="text-align: center; padding: 16px; color: var(--md-sys-color-on-surface-variant); font-size: 13px; border-top: 1px solid var(--md-sys-color-outline-variant); margin-top: 24px;">
                    <strong>Notice:</strong> นี่เป็นเพียงระบบ Demo สำหรับการทดสอบ (Medical Flow & Queue Management)
                </footer>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Foundation -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>

    <!-- Global App Bootstrap (Story 0003) -->
    <script type="module" src="/assets/js/bootstrap-app.js"></script>

    <!-- Page Specific JS -->
    <?php foreach (($pageMetadata['js'] ?? []) as $jsFile): ?>
        <!-- <script type="module" src="/assets/js/<?= htmlspecialchars($jsFile) ?>"></script> -->
    <?php endforeach; ?>
</body>
</html>
