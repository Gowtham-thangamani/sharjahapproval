<?php
/**
 * Email Configuration for Sharjah Approval Contact Form
 *
 * IMPORTANT: Update these settings with your cPanel email details
 */

// =================================================
// EMAIL SETTINGS - UPDATE THESE!
// =================================================

// Admin email - where contact form submissions are sent
define('ADMIN_EMAIL', 'info@sharjahapproval.com');

// Sender email - the "From" address (must be a valid email on your domain)
// This should be an email created in your cPanel (e.g., noreply@sharjahapproval.com)
define('SENDER_EMAIL', 'noreply@sharjahapproval.com');

// Sender name
define('SENDER_NAME', 'Sharjah Approval Contact Form');

// Send confirmation email to customer? (true/false)
define('SEND_CONFIRMATION', true);

// =================================================
// SETUP INSTRUCTIONS
// =================================================

/*
 * HOW TO SET UP:
 *
 * 1. CREATE EMAIL IN CPANEL:
 *    - Login to cPanel
 *    - Go to "Email Accounts"
 *    - Create new email: noreply@sharjahapproval.com
 *    - Set any password (you don't need to remember it)
 *
 * 2. UPDATE THIS FILE:
 *    - Change ADMIN_EMAIL to your actual email address
 *    - Change SENDER_EMAIL to the email you created in step 1
 *
 * 3. UPLOAD FILES:
 *    - Upload contact-handler.php
 *    - Upload this file (email-config.php)
 *    - Make sure they're in the same directory
 *
 * 4. TEST:
 *    - Use test-email.html to test email functionality
 *    - Submit a test form
 *    - Check your ADMIN_EMAIL inbox
 *
 * TROUBLESHOOTING:
 *
 * - Emails not arriving?
 *   → Check spam/junk folder
 *   → Verify SENDER_EMAIL exists in cPanel
 *   → Contact your hosting provider
 *
 * - Getting errors?
 *   → Check file permissions (644 for .php files)
 *   → Enable error reporting in PHP
 *   → Check cPanel error logs
 */

// =================================================
// ADVANCED SETTINGS (Optional)
// =================================================

// Enable error reporting (set to false in production)
define('DEBUG_MODE', false);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone (optional)
date_default_timezone_set('Asia/Dubai');

?>
