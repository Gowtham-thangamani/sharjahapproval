<?php
/**
 * Messages API for Sharjah Approval Admin Panel
 * Handles reading, marking as read, and deleting messages
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');

$data_dir = dirname(__DIR__) . '/data';
$file_path = $data_dir . '/messages.json';

// Ensure data directory exists
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0755, true);
}

// Read messages from file
function get_messages($file_path) {
    if (!file_exists($file_path)) {
        return [];
    }
    $content = file_get_contents($file_path);
    if (!$content) return [];
    $messages = json_decode($content, true);
    return is_array($messages) ? $messages : [];
}

// Save messages to file
function save_messages($file_path, $messages) {
    file_put_contents($file_path, json_encode($messages, JSON_PRETTY_PRINT));
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';

switch ($action) {
    case 'list':
        // Return all messages
        $messages = get_messages($file_path);
        $unread = 0;
        foreach ($messages as $msg) {
            if (empty($msg['read'])) $unread++;
        }
        echo json_encode([
            'success' => true,
            'total' => count($messages),
            'unread' => $unread,
            'messages' => $messages
        ]);
        break;

    case 'count':
        // Return only counts (lightweight)
        $messages = get_messages($file_path);
        $unread = 0;
        foreach ($messages as $msg) {
            if (empty($msg['read'])) $unread++;
        }
        echo json_encode([
            'success' => true,
            'total' => count($messages),
            'unread' => $unread
        ]);
        break;

    case 'read':
        // Mark message as read
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (empty($id)) {
            echo json_encode(['success' => false, 'error' => 'Missing message ID']);
            break;
        }
        $messages = get_messages($file_path);
        foreach ($messages as &$msg) {
            if ($msg['id'] === $id) {
                $msg['read'] = true;
                break;
            }
        }
        save_messages($file_path, $messages);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        // Delete a message
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (empty($id)) {
            echo json_encode(['success' => false, 'error' => 'Missing message ID']);
            break;
        }
        $messages = get_messages($file_path);
        $filtered = array_values(array_filter($messages, function($msg) use ($id) {
            return $msg['id'] !== $id;
        }));
        save_messages($file_path, $filtered);
        echo json_encode(['success' => true]);
        break;

    case 'mark_all_read':
        // Mark all messages as read
        $messages = get_messages($file_path);
        foreach ($messages as &$msg) {
            $msg['read'] = true;
        }
        save_messages($file_path, $messages);
        echo json_encode(['success' => true]);
        break;

    case 'debug':
        // Temporary debug - remove after fixing
        echo json_encode([
            'data_dir' => $data_dir,
            'file_path' => $file_path,
            'file_exists' => file_exists($file_path),
            'dir_exists' => is_dir($data_dir),
            'dir_contents' => is_dir($data_dir) ? scandir($data_dir) : 'dir not found',
            'php_dir' => __DIR__,
            'parent_dir' => dirname(__DIR__)
        ]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>
