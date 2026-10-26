"""Extract the supplied Word document using standard-library OOXML parsing."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
workspace = Path(__file__).resolve().parent.parent
with zipfile.ZipFile(args.source) as archive:
    document = ET.fromstring(archive.read('word/document.xml'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t', ns)) for p in document.findall('.//w:body//w:p', ns)]
target = workspace / '.qr-work' / 'question-paragraphs.json'
target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(paragraphs, ensure_ascii=False), encoding='utf-8')
print(json.dumps({'paragraphs': len(paragraphs), 'sha256': hashlib.sha256(args.source.read_bytes()).hexdigest()}))
