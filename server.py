import argparse
import base64
import io
import json
import re
import zipfile
from collections import OrderedDict
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import xml.etree.ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
LABEL_CLEAN_RE = re.compile(r"[^A-Z0-9]+")

DIRECT_FIELD_MAP = OrderedDict([
    ("NAMEINFULL", ("legalName", "Legal full name")),
    ("CONTACTNO", ("phone", "Phone number")),
    ("EMERGENCYCONTACTNO", ("emergencyContact", "Emergency contact number")),
    ("BLOODGROUP", ("bloodGroup", "Blood group")),
    ("DATEOFBIRTH", ("dateOfBirth", "Date of birth")),
    ("PERSONALMAILID", ("personalMailId", "Personal mail ID")),
    ("MARITALSTATUS", ("maritalStatus", "Marital status")),
    ("NOOFCHILDRENIFAPPLICABLE", ("numberOfChildren", "No. of children")),
    ("NAMEOFSPOUSEIFAPPLICABLE", ("spouseName", "Name of spouse")),
    ("FATHERSNAME", ("fatherName", "Father's name")),
    ("MOTHERSNAME", ("motherName", "Mother's name")),
    ("HUSBANDGUARDIANNAME", ("husbandGuardianName", "Husband/Guardian name")),
    ("NAMEOFFATHERHUSBANDGUARDIANNAME", ("husbandGuardianName", "Father/Husband/Guardian name")),
    ("MOTHERSMAIDENNAME", ("motherName", "Mother's maiden name")),
    ("PASSPORTNOIFAPPLICABLE", ("passportNo", "Passport no.")),
    ("PANNOATTACHMENTBOX", ("pan", "PAN no.")),
    ("ADHARNOATTACHMENTBOX", ("adharNo", "Aadhar no.")),
    ("EXPERIENCEDFRESHER", ("experienceType", "Experienced/Fresher")),
    ("PFNOAVIABLENOT", ("pfAvailable", "PF available")),
    ("PFNOIFAPPLICABLE", ("pfNo", "PF no.")),
    ("UANNOIFAPPLICABLE", ("uanNo", "UAN no.")),
    ("NAMEOFBANK", ("bankName", "Bank name")),
    ("ACCOUNTNUMBER", ("accountNumber", "Account number")),
    ("BRANCH", ("bankBranch", "Branch")),
    ("TYPEOFACCOUNT", ("accountType", "Type of account")),
    ("IFSCCODE", ("ifsc", "IFSC code")),
    ("BANKDETAILSATTACHMENTCANCELCHEQUEPASSBOOKFRONTPAGE", ("bankDetailsAttachment", "Bank details attachment")),
])

ADDRESS_KEYS = [
    ("ADDRESSLINE1", "addressLine1", "Address line 1"),
    ("ADDRESSLINE2", "addressLine2", "Address line 2"),
    ("POSTOFFICE", "postOffice", "Post office"),
    ("POLICESTATION", "policeStation", "Police station"),
    ("DIST", "district", "District"),
    ("STATE", "state", "State"),
    ("PIN", "pin", "PIN"),
]


def normalize_label(text: str) -> str:
    return LABEL_CLEAN_RE.sub("", (text or "").upper().replace("?", "")).strip()


def slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", " ", text or "").strip().lower()
    parts = [p for p in cleaned.split() if p]
    if not parts:
        return "field"
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


def clean_value(text: str) -> str:
    value = re.sub(r"\s+", " ", (text or "").replace("\xa0", " ")).strip(" :-\t\r\n")
    return value.strip()


def paragraph_texts(cell) -> list[str]:
    paras = []
    for p in cell.findall('./w:p', NS):
        texts = ''.join(t.text or '' for t in p.findall('.//w:t', NS))
        if texts and texts.strip():
            paras.append(texts.strip())
    return paras


def read_tables(doc_bytes: bytes):
    with zipfile.ZipFile(io.BytesIO(doc_bytes)) as zf:
        xml = zf.read('word/document.xml')
    root = ET.fromstring(xml)
    tables = []
    for tbl in root.findall('.//w:tbl', NS):
        rows = []
        for tr in tbl.findall('./w:tr', NS):
            cells = [paragraph_texts(tc) for tc in tr.findall('./w:tc', NS)]
            rows.append(cells)
        tables.append(rows)
    return tables


def extract_inline_value(label: str, paragraphs: list[str], stop_labels: list[str] | None = None) -> str:
    if not paragraphs:
        return ""
    normalized_label = normalize_label(label)
    stop_set = {normalize_label(item) for item in (stop_labels or []) if item}
    collected = []
    after_label = False
    for para in paragraphs:
        raw = para.strip()
        if not raw:
            continue
        compact = normalize_label(raw)
        if normalized_label and compact == normalized_label:
            after_label = True
            continue
        if normalized_label and compact.startswith(normalized_label):
            suffix = clean_value(raw[len(label):])
            suffix = clean_value(re.sub(r'^[*:\-\s]+', '', suffix))
            if suffix and normalize_label(suffix) not in stop_set:
                collected.append(suffix)
            after_label = True
            continue
        if after_label:
            if compact in stop_set or any(compact.startswith(stop) for stop in stop_set):
                break
            collected.append(clean_value(raw))
    result = clean_value(' '.join(v for v in collected if v))
    return '' if normalize_label(result) in stop_set else result

def set_field(fields, labels, key, label, value):
    cleaned = clean_value(value)
    if not cleaned:
        return
    fields[key] = cleaned
    labels[key] = label


def address_label_pattern(marker: str) -> str:
    patterns = {
        'ADDRESSLINE1': r'ADDRESS\s*LINE\s*1',
        'ADDRESSLINE2': r'ADDRESS\s*LINE\s*2',
        'POSTOFFICE': r'POST\s*-?\s*OFFICE',
        'POLICESTATION': r'POLICE\s*-?\s*STATION',
        'DIST': r'DIST',
        'STATE': r'STATE',
        'PIN': r'PIN',
    }
    return patterns.get(marker, re.escape(marker))


def extract_address_value(joined: str, marker: str, stop_markers: list[str]) -> str:
    stop_pattern = '|'.join(address_label_pattern(item) for item in stop_markers if item != marker)
    lookahead = rf'(?=\s*(?:{stop_pattern})[:*\s-]*|$)' if stop_pattern else r'$'
    pattern = address_label_pattern(marker) + r'[:*\s-]*(.*?)' + lookahead
    match = re.search(pattern, joined, re.IGNORECASE)
    return clean_value(match.group(1)) if match else ''


def parse_address_block(prefix: str, paragraphs: list[str], fields, labels):
    if not paragraphs:
        return
    joined = ' '.join(paragraphs)
    markers = [item[0] for item in ADDRESS_KEYS]
    for marker, key_suffix, label_suffix in ADDRESS_KEYS:
        value = extract_address_value(joined, marker, markers)
        set_field(fields, labels, f'{prefix}{key_suffix[0].upper()}{key_suffix[1:]}', f'{prefix} {label_suffix}', value)


def is_header_like_row(values, labels_row):
    normalized_values = [normalize_label(value) for value in values]
    normalized_labels = [normalize_label(label) for label in labels_row]
    comparable = [(value, label) for value, label in zip(normalized_values, normalized_labels) if value or label]
    return bool(comparable) and all(value == label or value.startswith(label) or label.startswith(value) for value, label in comparable)


def parse_tabular_entries(rows, start_index, count, labels_row, entry_prefix, fields, labels):
    entries = []
    for row in rows[start_index:start_index + count]:
        values = [clean_value(' '.join(cell)) for cell in row]
        if not any(values) or is_header_like_row(values, labels_row):
            continue
        pairs = [f'{label}: {value}' for label, value in zip(labels_row, values) if value]
        if pairs:
            entries.append('; '.join(pairs))
    if entries:
        key = slugify(entry_prefix)
        fields[key] = '\n'.join(entries)
        labels[key] = entry_prefix

def parse_employee_docx(doc_bytes: bytes):
    tables = read_tables(doc_bytes)
    if not tables:
        return {"fields": {}, "labels": {}}
    fields = OrderedDict()
    labels = OrderedDict()
    main_rows = tables[0]
    office_use_reached = False
    for row_index, row in enumerate(main_rows, 1):
        first = clean_value(' '.join(row[0])) if row else ''
        if normalize_label(first) == 'FOROFFICEUSEONLY':
            office_use_reached = True
            break
        if row_index in {1, 20, 27, 38, 45}:
            continue
        if row_index in {28, 29}:
            continue
        if row_index == 30 and len(row) >= 2:
            parse_address_block('Present', row[0], fields, labels)
            parse_address_block('Permanent', row[1], fields, labels)
            present_keys = ['PresentAddressLine1', 'PresentAddressLine2', 'PresentPostOffice', 'PresentPoliceStation', 'PresentDistrict', 'PresentState', 'PresentPin']
            permanent_keys = ['PermanentAddressLine1', 'PermanentAddressLine2', 'PermanentPostOffice', 'PermanentPoliceStation', 'PermanentDistrict', 'PermanentState', 'PermanentPin']
            if any(fields.get(k) for k in present_keys) and not any(fields.get(k) for k in permanent_keys):
                for present_key, permanent_key in zip(present_keys, permanent_keys):
                    if fields.get(present_key):
                        set_field(fields, labels, permanent_key, labels.get(present_key, present_key).replace('Present', 'Permanent', 1), fields.get(present_key))
            present_parts = [fields.get(k) for k in present_keys if fields.get(k)]
            if present_parts:
                set_field(fields, labels, 'address', 'Current address', ', '.join(present_parts))
            continue
        if row_index == 31:
            continue
        if 32 <= row_index <= 37:
            continue
        if row_index == 39:
            continue
        if 40 <= row_index <= 44:
            continue
        if row_index >= 46:
            continue
        label_text = clean_value(' '.join(row[0])) if row else ''
        label_key = normalize_label(label_text)
        if label_key in {'CHECKBOX', 'YN', 'BANKDETAILS', 'ADDRESSDETAILS'}:
            continue
        mapped = DIRECT_FIELD_MAP.get(label_key)
        if not mapped:
            continue
        field_key, display_label = mapped
        second_cell = clean_value(' '.join(row[1])) if len(row) > 1 else ''
        if normalize_label(second_cell) in {'CHECKBOX', 'YN'}:
            second_cell = ''
        value = second_cell or extract_inline_value(label_text, row[0])
        set_field(fields, labels, field_key, display_label, value)

    education_headers = ['Degree / PG / Diploma', 'Marks obtained', 'University', 'City', 'Year of passing']
    parse_tabular_entries(main_rows, 32, 6, education_headers, 'Educational details', fields, labels)
    prev_headers = ['Name', 'Address', 'Designation', 'Reporting', 'Contact details']
    parse_tabular_entries(main_rows, 40, 5, prev_headers, 'Previous company details', fields, labels)
    return {"fields": fields, "labels": labels}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def do_POST(self):
        if self.path != '/api/parse-employee-docx':
            self.send_error(404, 'Not Found')
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
            encoded = payload.get('contentBase64', '')
            if not encoded:
                raise ValueError('Missing DOCX content.')
            doc_bytes = base64.b64decode(encoded)
            result = parse_employee_docx(doc_bytes)
            body = json.dumps(result).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            body = json.dumps({'error': str(exc)}).encode('utf-8')
            self.send_response(400)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4173)
    parser.add_argument('--host', default='127.0.0.1')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    server = ThreadingHTTPServer((args.host, args.port), partial(Handler, directory=str(root)))
    print(f'Server started on http://{args.host}:{args.port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()

