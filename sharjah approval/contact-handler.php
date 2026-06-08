<?php
/**
 * Contact Form Email Handler for Sharjah Approval
 * This script processes contact form submissions and sends emails via cPanel mail server
 */

// Start session for rate limiting
session_start();

// Load configuration
require_once 'email-config.php';

// Set headers to prevent caching
header('Content-Type: text/html; charset=utf-8');

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email address
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Rate limiting - prevent spam (max 3 submissions per hour)
 */
function check_rate_limit() {
    if (!isset($_SESSION['form_submissions'])) {
        $_SESSION['form_submissions'] = [];
    }

    // Remove submissions older than 1 hour
    $current_time = time();
    $_SESSION['form_submissions'] = array_filter($_SESSION['form_submissions'], function($timestamp) use ($current_time) {
        return ($current_time - $timestamp) < 3600; // 1 hour
    });

    // Check if limit exceeded
    if (count($_SESSION['form_submissions']) >= 3) {
        return false;
    }

    // Add current submission
    $_SESSION['form_submissions'][] = $current_time;
    return true;
}

/**
 * Simple honeypot check (spam protection)
 */
function check_honeypot() {
    // If honeypot field is filled, it's a bot
    return empty($_POST['website']);
}

/**
 * Save message to JSON file for admin panel
 */
function save_message_to_file($name, $email, $phone, $service, $message) {
    $data_dir = __DIR__ . '/admin/data';
    $file_path = $data_dir . '/messages.json';

    // Create data directory if it doesn't exist
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }

    // Read existing messages
    $messages = [];
    if (file_exists($file_path)) {
        $content = file_get_contents($file_path);
        if ($content) {
            $messages = json_decode($content, true);
            if (!is_array($messages)) {
                $messages = [];
            }
        }
    }

    // Add new message
    $new_message = [
        'id' => 'msg_' . time() . '_' . mt_rand(1000, 9999),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'service' => $service,
        'message' => $message,
        'read' => false,
        'createdAt' => date('c'),
        'ip' => $_SERVER['REMOTE_ADDR']
    ];

    // Add to beginning of array (newest first)
    array_unshift($messages, $new_message);

    // Keep only last 500 messages
    $messages = array_slice($messages, 0, 500);

    // Save to file
    file_put_contents($file_path, json_encode($messages, JSON_PRETTY_PRINT));
}

// Initialize error and success messages
$errors = [];
$success = false;

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check honeypot
    if (!check_honeypot()) {
        // Silent fail for bots
        header("Location: thank-you.html");
        exit();
    }

    // Check rate limit
    if (!check_rate_limit()) {
        $errors[] = "Too many submissions. Please try again later.";
    } else {
        // Get and sanitize form data
        $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
        $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
        $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
        $service = isset($_POST['service']) ? sanitize_input($_POST['service']) : 'General Inquiry';
        $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

        // Validate required fields
        if (empty($name)) {
            $errors[] = "Name is required.";
        }

        if (empty($email)) {
            $errors[] = "Email is required.";
        } elseif (!validate_email($email)) {
            $errors[] = "Invalid email format.";
        }

        if (empty($phone)) {
            $errors[] = "Phone number is required.";
        }

        if (empty($message)) {
            $errors[] = "Message is required.";
        }

        // If no errors, send email and save message
        if (empty($errors)) {
            // Save message to JSON file for admin panel
            save_message_to_file($name, $email, $phone, $service, $message);

            // Email to admin
            $to = ADMIN_EMAIL;
            $subject = "New Contact Form Submission - Sharjah Approval";

            // Create email body
            $email_body = "
=================================================
NEW CONTACT FORM SUBMISSION
=================================================

Name:        $name
Email:       $email
Phone:       $phone
Service:     $service

Message:
-------------------------------------------------
$message
-------------------------------------------------

Submitted:   " . date('Y-m-d H:i:s') . "
IP Address:  " . $_SERVER['REMOTE_ADDR'] . "

=================================================
";

            // Email headers
            $headers = "From: " . SENDER_NAME . " <" . SENDER_EMAIL . ">\r\n";
            $headers .= "Reply-To: $name <$email>\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

            // Send email
            if (mail($to, $subject, $email_body, $headers)) {
                // Send confirmation email to customer (optional)
                if (SEND_CONFIRMATION) {
                    $customer_subject = "Thank You for Contacting Sharjah Approval";
                    $customer_body = "
Dear $name,

Thank you for contacting Sharjah Approval. We have received your inquiry and one of our consultants will get back to you within 24 hours.

Your Message:
-------------------------------------------------
$message
-------------------------------------------------

If you have any urgent matters, please feel free to call us at +971 6 561 0096 or WhatsApp us at +971 54 232 3854.

Best regards,
Sharjah Approval Team

---
Office: 10th Floor, City Gate Tower, Al Ittihad Street, Sharjah, UAE
Phone: +971 6 561 0096
Email: info@sharjahapproval.com
Website: https://sharjahapproval.com
";

                    $customer_headers = "From: " . SENDER_NAME . " <" . SENDER_EMAIL . ">\r\n";
                    $customer_headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
                    $customer_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
                    $customer_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

                    mail($email, $customer_subject, $customer_body, $customer_headers);
                }

                // Redirect to thank you page
                header("Location: thank-you.html?success=1");
                exit();
            } else {
                $errors[] = "Failed to send email. Please try again or contact us directly at " . ADMIN_EMAIL;
            }
        }
    }
}

// If there are errors, display them
if (!empty($errors)) {
    echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Form Error - Sharjah Approval</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #f8f9fa; padding: 50px 20px; }
        .error-container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .error-icon { font-size: 50px; color: #dc3545; text-align: center; margin-bottom: 20px; }
        h1 { color: #dc3545; text-align: center; margin-bottom: 20px; font-size: 1.8rem; }
        .error-list { background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
        .error-list ul { margin-left: 20px; }
        .error-list li { color: #856404; margin-bottom: 10px; font-size: 1.05rem; }
        .button-group { text-align: center; }
        .btn { display: inline-block; padding: 14px 32px; background: #0a6e4f; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 5px; transition: all 0.3s ease; }
        .btn:hover { background: #064a35; transform: translateY(-2px); }
        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #5a6268; }
        .contact-info { margin-top: 30px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center; color: #666; }
        .contact-info a { color: #0a6e4f; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class='error-container'>
        <div class='error-icon'>⚠️</div>
        <h1>Form Submission Error</h1>
        <div class='error-list'>
            <ul>";

    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error) . "</li>";
    }

    echo "      </ul>
        </div>
        <div class='button-group'>
            <a href='javascript:history.back()' class='btn'>Go Back</a>
            <a href='contact.html' class='btn btn-secondary'>Contact Page</a>
        </div>
        <div class='contact-info'>
            <p>Need immediate assistance?</p>
            <p>Call us: <a href='tel:+97165610096'>+971 6 561 0096</a></p>
            <p>Email: <a href='mailto:info@sharjahapproval.com'>info@sharjahapproval.com</a></p>
            <p>WhatsApp: <a href='https://wa.me/971542323854' target='_blank'>+971 54 232 3854</a></p>
        </div>
    </div>
</body>
</html>";
    exit();
}

// If accessed directly without POST, redirect to contact page
header("Location: contact.html");
exit();
?>
