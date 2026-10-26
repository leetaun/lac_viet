from pathlib import Path
import json
import sys
from PIL import Image
from pypdf import PdfReader

root=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(root/'.qr-work/validation'))
import zxingcpp

manifest=json.loads((root/'output/qr/manifest.json').read_text(encoding='utf-8'))
image=Image.open(root/'tmp/pdfs/qr-cards.png').convert('RGB')
decoded=zxingcpp.read_barcodes(image)
actual={item.text for item in decoded}
expected={card['url'] for card in manifest['cards']}
if actual!=expected:
    raise RuntimeError(f'PDF QR mismatch: {actual ^ expected}')
pdf=PdfReader(root/'output/pdf/lac-viet-qr-cards-a4.pdf')
assert len(pdf.pages)==1
links={item.get_object().get('/A',{}).get('/URI') for item in pdf.pages[0].get('/Annots',[])}
assert links==expected
for card in manifest['cards']:
    raw=zxingcpp.read_barcode(Image.open(root/f"output/qr/{card['kind']}.png"))
    assert raw and raw.text==card['url']
report={'pdfPages':1,'cardSizeMm':[63,88],'decodedPdfCodes':len(decoded),'allPdfAndPngCodesMatch':True,'links':sorted(expected)}
(root/'output/qr/verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
