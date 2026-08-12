<?php
/**
 * HRMS Portal API - PHP Implementation
 * Replaces the Python FastAPI backend for seamless Plesk integration.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

set_exception_handler(function($e) {
    http_response_code(500);
    echo json_encode(["error" => "PHP Crash", "message" => $e->getMessage(), "file" => $e->getFile(), "line" => $e->getLine()]);
    exit;
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$route = $_GET['route'] ?? '';

// === CONFIGURATION ===
$is_localhost = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']);

if ($is_localhost) {
    $db_host = '127.0.0.1';
    $db_port = '3306';
    $db_name = 'hrms0';
    $db_user = 'root';
    $db_pass = '';
} else {
    $db_host = '127.0.0.1';
    $db_port = '3306';
    $db_name = 'admin_hrms0';
    $db_user = 'hrms_avanzar';
    $db_pass = 'wa65FgJZdtyzhdj'; // Replace this before deploying!
}

function getDbConnection() {
    global $db_host, $db_port, $db_name, $db_user, $db_pass;
    try {
        $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["configured" => false, "message" => "Database connection failed"]);
        exit;
    }
}

// === STATE MANAGEMENT ===
function handleState() {
    global $is_localhost;
    if ($is_localhost) {
        $local_file = 'local_state.json';
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $state = null;
            if (file_exists($local_file)) {
                $state = json_decode(file_get_contents($local_file), true);
            }
            echo json_encode(["configured" => true, "source" => "json", "state" => $state]);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['state'])) {
                http_response_code(400);
                echo json_encode(["detail" => "Missing state payload"]);
                return;
            }
            file_put_contents($local_file, json_encode($input['state']));
            echo json_encode(["ok" => true]);
        }
        return;
    }

    $pdo = getDbConnection();
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS hrms_portal_state (
        app_key VARCHAR(255) PRIMARY KEY,
        payload LONGTEXT NOT NULL,
        updated_at DATETIME NOT NULL
    )");

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare("SELECT payload FROM hrms_portal_state WHERE app_key = 'default'");
        $stmt->execute();
        $row = $stmt->fetch();
        
        $state = null;
        if ($row && isset($row['payload'])) {
            $state = json_decode($row['payload'], true);
        }
        echo json_encode(["configured" => true, "source" => "mysql", "state" => $state]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['state'])) {
            http_response_code(400);
            echo json_encode(["ok" => false, "message" => "Missing state payload"]);
            return;
        }
        
        $payload_json = json_encode($input['state']);
        $stmt = $pdo->prepare("
            INSERT INTO hrms_portal_state (app_key, payload, updated_at) 
            VALUES ('default', :payload, NOW())
            ON DUPLICATE KEY UPDATE 
                payload = VALUES(payload), 
                updated_at = NOW()
        ");
        $stmt->execute(['payload' => $payload_json]);
        echo json_encode(["ok" => true]);
    }
}

// === FEEDBACK MANAGEMENT ===
function handleFeedback() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $message = trim($input['message'] ?? '');
        if (!$message) {
            http_response_code(400);
            echo json_encode(["detail" => "Feedback message is required."]);
            return;
        }
        
        $created_at = date('d-m-Y h:i:s A');
        $sender = $input['sender'] ?? [];
        $attachments = $input['attachments'] ?? [];
        
        $dir = __DIR__ . '/feedback-attachments';
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        
        $stamp = date('Ymd-His');
        $saved_attachments = [];
        
        foreach ($attachments as $index => $item) {
            $encoded = $item['contentBase64'] ?? '';
            if (!$encoded) continue;
            
            $idx = $index + 1;
            $base = basename($item['filename'] ?? "attachment-{$idx}");
            $cleaned = preg_replace('/[^a-zA-Z0-9._-]+/', '_', $base);
            $filename = trim($cleaned, '._') ?: 'attachment';
            
            $saved_name = "{$stamp}-{$idx}-{$filename}";
            $target = $dir . '/' . $saved_name;
            
            file_put_contents($target, base64_decode($encoded));
            $size_kb = max(1, round(filesize($target) / 1024));
            $content_type = $item['contentType'] ?? '-';
            
            $saved_attachments[] = "{$target} | Original: {$filename} | Type: {$content_type} | Size: {$size_kb} KB";
        }
        
        $log_lines = [
            str_repeat('-', 72),
            "Date/Time: {$created_at}",
            "Sender: " . ($sender['name'] ?? 'Unknown'),
            "Role: " . ($sender['role'] ?? 'Unknown'),
            "Email: " . ($sender['email'] ?? '-'),
            "Employee/User ID: " . ($sender['employeeId'] ?? '-'),
            "Page: " . ($input['pageName'] ?? '-'),
            "Type: " . ($input['feedbackType'] ?? 'Other'),
            "Message:",
            $message,
            "Attachments:",
            implode("\n", $saved_attachments ?: ['None']),
            ""
        ];
        
        $log_path = __DIR__ . '/feedback-log.txt';
        file_put_contents($log_path, implode("\n", $log_lines) . "\n", FILE_APPEND);
        
        echo json_encode(["ok" => true, "savedAttachments" => $saved_attachments, "logFile" => basename($log_path)]);
    }
}

// === DOCX PARSER ===
$DIRECT_FIELD_MAP = [
    "NAMEINFULL" => ["legalName", "Legal full name"],
    "CONTACTNO" => ["phone", "Phone number"],
    "EMERGENCYCONTACTNO" => ["emergencyContact", "Emergency contact number"],
    "BLOODGROUP" => ["bloodGroup", "Blood group"],
    "DATEOFBIRTH" => ["dateOfBirth", "Date of birth"],
    "PERSONALMAILID" => ["personalMailId", "Personal mail ID"],
    "MARITALSTATUS" => ["maritalStatus", "Marital status"],
    "NOOFCHILDRENIFAPPLICABLE" => ["numberOfChildren", "No. of children"],
    "NAMEOFSPOUSEIFAPPLICABLE" => ["spouseName", "Name of spouse"],
    "FATHERSNAME" => ["fatherName", "Father's name"],
    "MOTHERSNAME" => ["motherName", "Mother's name"],
    "HUSBANDGUARDIANNAME" => ["husbandGuardianName", "Husband/Guardian name"],
    "NAMEOFFATHERHUSBANDGUARDIANNAME" => ["husbandGuardianName", "Father/Husband/Guardian name"],
    "MOTHERSMAIDENNAME" => ["motherName", "Mother's maiden name"],
    "PASSPORTNOIFAPPLICABLE" => ["passportNo", "Passport no."],
    "PANNOATTACHMENTBOX" => ["pan", "PAN no."],
    "ADHARNOATTACHMENTBOX" => ["adharNo", "Aadhar no."],
    "EXPERIENCEDFRESHER" => ["experienceType", "Experienced/Fresher"],
    "PFNOAVIABLENOT" => ["pfAvailable", "PF available"],
    "PFNOIFAPPLICABLE" => ["pfNo", "PF no."],
    "UANNOIFAPPLICABLE" => ["uanNo", "UAN no."],
    "NAMEOFBANK" => ["bankName", "Bank name"],
    "ACCOUNTNUMBER" => ["accountNumber", "Account number"],
    "BRANCH" => ["bankBranch", "Branch"],
    "TYPEOFACCOUNT" => ["accountType", "Type of account"],
    "IFSCCODE" => ["ifsc", "IFSC code"],
    "BANKDETAILSATTACHMENTCANCELCHEQUEPASSBOOKFRONTPAGE" => ["bankDetailsAttachment", "Bank details attachment"],
];

$ADDRESS_KEYS = [
    ["ADDRESSLINE1", "addressLine1", "Address line 1"],
    ["ADDRESSLINE2", "addressLine2", "Address line 2"],
    ["POSTOFFICE", "postOffice", "Post office"],
    ["POLICESTATION", "policeStation", "Police station"],
    ["DIST", "district", "District"],
    ["STATE", "state", "State"],
    ["PIN", "pin", "PIN"],
];

function normalize_label($text) {
    return trim(preg_replace('/[^A-Z0-9]+/', '', strtoupper(str_replace('?', '', $text ?? ''))));
}

function clean_value($text) {
    return trim(trim(preg_replace('/\s+/', ' ', str_replace("\xc2\xa0", ' ', $text ?? ''))), " :-\t\r\n");
}

function slugify($text) {
    $cleaned = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', ' ', $text ?? '')));
    $parts = array_filter(explode(' ', $cleaned));
    if (!$parts) return "field";
    $parts = array_values($parts);
    $res = $parts[0];
    for ($i=1; $i<count($parts); $i++) {
        $res .= ucfirst($parts[$i]);
    }
    return $res;
}

function paragraph_texts($tc) {
    $tc->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
    $paras = [];
    foreach ($tc->xpath('.//w:p') as $p) {
        $p->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        $texts = '';
        foreach ($p->xpath('.//w:t') as $t) {
            $texts .= (string)$t;
        }
        $texts = trim($texts);
        if ($texts) $paras[] = $texts;
    }
    return $paras;
}

function extract_inline_value($label, $paragraphs, $stop_labels = []) {
    if (!$paragraphs) return "";
    $normalized_label = normalize_label($label);
    $stop_set = array_map('normalize_label', array_filter($stop_labels));
    $collected = [];
    $after_label = false;
    
    foreach ($paragraphs as $para) {
        $raw = trim($para);
        if (!$raw) continue;
        $compact = normalize_label($raw);
        
        if ($normalized_label && $compact === $normalized_label) {
            $after_label = true;
            continue;
        }
        if ($normalized_label && str_starts_with($compact, $normalized_label)) {
            $suffix = clean_value(substr($raw, strlen($label)));
            $suffix = clean_value(preg_replace('/^[*:\-\s]+/', '', $suffix));
            if ($suffix && !in_array(normalize_label($suffix), $stop_set)) {
                $collected[] = $suffix;
            }
            $after_label = true;
            continue;
        }
        if ($after_label) {
            $stop = false;
            foreach ($stop_set as $s) {
                if ($compact === $s || str_starts_with($compact, $s)) { $stop = true; break; }
            }
            if ($stop) break;
            $collected[] = clean_value($raw);
        }
    }
    $result = clean_value(implode(' ', array_filter($collected)));
    return in_array(normalize_label($result), $stop_set) ? '' : $result;
}

function address_label_pattern($marker) {
    $patterns = [
        'ADDRESSLINE1' => 'ADDRESS\s*LINE\s*1',
        'ADDRESSLINE2' => 'ADDRESS\s*LINE\s*2',
        'POSTOFFICE' => 'POST\s*-?\s*OFFICE',
        'POLICESTATION' => 'POLICE\s*-?\s*STATION',
        'DIST' => 'DIST',
        'STATE' => 'STATE',
        'PIN' => 'PIN',
    ];
    return $patterns[$marker] ?? preg_quote($marker, '/');
}

function extract_address_value($joined, $marker, $stop_markers) {
    $stops = [];
    foreach ($stop_markers as $sm) {
        if ($sm !== $marker) $stops[] = address_label_pattern($sm);
    }
    $stop_pattern = implode('|', $stops);
    $lookahead = $stop_pattern ? '(?=\s*(?:' . $stop_pattern . ')[:*\s-]*|$)' : '$';
    $pattern = '/' . address_label_pattern($marker) . '[:*\s-]*(.*?)' . $lookahead . '/i';
    
    if (preg_match($pattern, $joined, $matches)) {
        return clean_value($matches[1]);
    }
    return '';
}

function set_field(&$fields, &$labels, $key, $label, $value) {
    $cleaned = clean_value($value);
    if (!$cleaned) return;
    $fields[$key] = $cleaned;
    $labels[$key] = $label;
}

function parse_address_block($prefix, $paragraphs, &$fields, &$labels) {
    global $ADDRESS_KEYS;
    if (!$paragraphs) return;
    $joined = implode(' ', $paragraphs);
    $markers = array_column($ADDRESS_KEYS, 0);
    
    foreach ($ADDRESS_KEYS as $item) {
        $marker = $item[0];
        $key_suffix = $item[1];
        $label_suffix = $item[2];
        $value = extract_address_value($joined, $marker, $markers);
        $k = $prefix . ucfirst($key_suffix);
        set_field($fields, $labels, $k, "$prefix $label_suffix", $value);
    }
}

function is_header_like_row($values, $labels_row) {
    $normalized_values = array_map('normalize_label', $values);
    $normalized_labels = array_map('normalize_label', $labels_row);
    $comparable = [];
    for ($i=0; $i<min(count($normalized_values), count($normalized_labels)); $i++) {
        if ($normalized_values[$i] || $normalized_labels[$i]) {
            $comparable[] = [$normalized_values[$i], $normalized_labels[$i]];
        }
    }
    if (!$comparable) return false;
    foreach ($comparable as $pair) {
        $v = $pair[0]; $l = $pair[1];
        if (!($v === $l || str_starts_with($v, $l) || str_starts_with($l, $v))) {
            return false;
        }
    }
    return true;
}

function parse_tabular_entries($rows, $start_index, $count, $labels_row, $entry_prefix, &$fields, &$labels) {
    $entries = [];
    for ($i = $start_index; $i < $start_index + $count; $i++) {
        if (!isset($rows[$i])) break;
        $row = $rows[$i];
        $values = [];
        foreach ($row as $cell) {
            $values[] = clean_value(implode(' ', $cell));
        }
        if (!array_filter($values) || is_header_like_row($values, $labels_row)) continue;
        
        $pairs = [];
        for ($j=0; $j<min(count($labels_row), count($values)); $j++) {
            if ($values[$j]) $pairs[] = $labels_row[$j] . ': ' . $values[$j];
        }
        if ($pairs) $entries[] = implode('; ', $pairs);
    }
    if ($entries) {
        $key = slugify($entry_prefix);
        $fields[$key] = implode("\n", $entries);
        $labels[$key] = $entry_prefix;
    }
}

function handleParseDocx() {
    global $DIRECT_FIELD_MAP;
    $input = json_decode(file_get_contents('php://input'), true);
    $base64 = $input['contentBase64'] ?? '';
    if (!$base64) {
        http_response_code(400);
        echo json_encode(["detail" => "Missing DOCX content."]);
        return;
    }
    
    $tempFile = tempnam(sys_get_temp_dir(), 'docx');
    file_put_contents($tempFile, base64_decode($base64));
    
    $zip = new ZipArchive;
    $res = $zip->open($tempFile);
    if ($res !== TRUE) {
        unlink($tempFile);
        http_response_code(400);
        echo json_encode(["detail" => "Failed to unzip DOCX"]);
        return;
    }
    
    $xmlContent = $zip->getFromName('word/document.xml');
    $zip->close();
    unlink($tempFile);
    
    if (!$xmlContent) {
        echo json_encode(["fields" => [], "labels" => []]);
        return;
    }
    
    $xml = simplexml_load_string($xmlContent);
    $xml->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
    $tables = [];
    foreach ($xml->xpath('.//w:tbl') as $tbl) {
        $tbl->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
        $rows = [];
        foreach ($tbl->xpath('.//w:tr') as $tr) {
            $tr->registerXPathNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
            $cells = [];
            foreach ($tr->xpath('.//w:tc') as $tc) {
                $cells[] = paragraph_texts($tc);
            }
            $rows[] = $cells;
        }
        $tables[] = $rows;
    }
    
    $fields = [];
    $labels = [];
    if (!$tables) {
        echo json_encode(["fields" => $fields, "labels" => $labels]);
        return;
    }
    
    $main_rows = $tables[0];
    foreach ($main_rows as $row_index => $row) {
        $idx = $row_index + 1; // 1-indexed to match python
        $first = $row ? clean_value(implode(' ', $row[0])) : '';
        if (normalize_label($first) === 'FOROFFICEUSEONLY') break;
        
        if (in_array($idx, [1, 20, 27, 38, 45, 28, 29, 31, 39]) || ($idx >= 32 && $idx <= 37) || ($idx >= 40 && $idx <= 44) || $idx >= 46) {
            continue;
        }
        
        if ($idx === 30 && count($row) >= 2) {
            parse_address_block('Present', $row[0], $fields, $labels);
            parse_address_block('Permanent', $row[1], $fields, $labels);
            
            $present_keys = ['PresentAddressLine1', 'PresentAddressLine2', 'PresentPostOffice', 'PresentPoliceStation', 'PresentDistrict', 'PresentState', 'PresentPin'];
            $permanent_keys = ['PermanentAddressLine1', 'PermanentAddressLine2', 'PermanentPostOffice', 'PermanentPoliceStation', 'PermanentDistrict', 'PermanentState', 'PermanentPin'];
            
            $has_present = false; foreach($present_keys as $k) { if(isset($fields[$k])) $has_present = true; }
            $has_permanent = false; foreach($permanent_keys as $k) { if(isset($fields[$k])) $has_permanent = true; }
            
            if ($has_present && !$has_permanent) {
                for ($i=0; $i<count($present_keys); $i++) {
                    $pk = $present_keys[$i];
                    $pmk = $permanent_keys[$i];
                    if (isset($fields[$pk])) {
                        $l = $labels[$pk] ?? $pk;
                        set_field($fields, $labels, $pmk, preg_replace('/Present/', 'Permanent', $l, 1), $fields[$pk]);
                    }
                }
            }
            
            $present_parts = [];
            foreach ($present_keys as $k) { if (isset($fields[$k])) $present_parts[] = $fields[$k]; }
            if ($present_parts) {
                set_field($fields, $labels, 'address', 'Current address', implode(', ', $present_parts));
            }
            continue;
        }
        
        $label_text = $row ? clean_value(implode(' ', $row[0])) : '';
        $label_key = normalize_label($label_text);
        if (in_array($label_key, ['CHECKBOX', 'YN', 'BANKDETAILS', 'ADDRESSDETAILS'])) continue;
        
        if (!isset($DIRECT_FIELD_MAP[$label_key])) continue;
        
        $field_key = $DIRECT_FIELD_MAP[$label_key][0];
        $display_label = $DIRECT_FIELD_MAP[$label_key][1];
        
        $second_cell = count($row) > 1 ? clean_value(implode(' ', $row[1])) : '';
        if (in_array(normalize_label($second_cell), ['CHECKBOX', 'YN'])) $second_cell = '';
        
        $value = $second_cell ?: extract_inline_value($label_text, $row[0]);
        set_field($fields, $labels, $field_key, $display_label, $value);
    }
    
    $education_headers = ['Degree / PG / Diploma', 'Marks obtained', 'University', 'City', 'Year of passing'];
    parse_tabular_entries($main_rows, 32 - 1, 6, $education_headers, 'Educational details', $fields, $labels); // -1 because 0-indexed in PHP array
    
    $prev_headers = ['Name', 'Address', 'Designation', 'Reporting', 'Contact details'];
    parse_tabular_entries($main_rows, 40 - 1, 5, $prev_headers, 'Previous company details', $fields, $labels);
    
    echo json_encode(["fields" => $fields, "labels" => $labels]);
}

// === ROUTER ===
switch($route) {
    case 'state':
        handleState();
        break;
    case 'feedback':
        handleFeedback();
        break;
    case 'parse-employee-docx':
        handleParseDocx();
        break;
    case 'upload':
    case 'analytics':
        // Analytics placeholders - migrating away from Vercel Blob
        // For now returning OK so frontend does not crash.
        // If full attendance analytics tracking in MySQL is needed, it can be implemented here.
        echo json_encode(["ok" => true, "status" => "Analytics routed through PHP"]);
        break;
    default:
        http_response_code(404);
        echo json_encode(["detail" => "Not found"]);
}
