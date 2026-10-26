"""Create four vector QR cards on A4 using the website's exact fonts."""
from pathlib import Path
import json
import shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'output/qr/manifest.json').read_text(encoding='utf-8'))
fonts = root / '.qr-work/fonts'
for name, file in [('BeVietnam','BeVietnamPro-Regular.ttf'),('BeVietnamSemi','BeVietnamPro-SemiBold.ttf'),('BeVietnamBold','BeVietnamPro-Bold.ttf'),('Playfair','PlayfairDisplay-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(fonts / file)))
output = root / 'output/pdf/lac-viet-qr-cards-a4.pdf'
output.parent.mkdir(parents=True,exist_ok=True)
pdf = canvas.Canvas(str(output),pagesize=A4)
pdf.setTitle('Bộ bốn thẻ QR Lạc Việt')
pdf.setAuthor('Lạc Việt')
red=colors.HexColor('#7E121D');gold=colors.HexColor('#C5A059');ink=colors.HexColor('#1E2538')
width,height=A4

def center(text,x,y,font='BeVietnam',size=7,color=ink):
    pdf.setFillColor(color);pdf.setFont(font,size);pdf.drawCentredString(x,y,text)

center('BỘ THẺ QR LẠC VIỆT',width/2,280*mm,'Playfair',21,red)
center('4 thẻ dùng chung cho bàn chơi · 63 × 88 mm',width/2,270*mm,'BeVietnam',9)
positions=[]
for index, card in enumerate(manifest['cards']):
    x=(37 + (index%2)*73)*mm;y=(165-(index//2)*98)*mm
    positions.append((x,y))
    cw,ch=63*mm,88*mm
    pdf.setStrokeColor(gold);pdf.setLineWidth(1)
    pdf.setFillColor(colors.white);pdf.roundRect(x,y,cw,ch,3*mm,stroke=1,fill=1)
    pdf.saveState();clip=pdf.beginPath();clip.roundRect(x,y,cw,ch,3*mm);pdf.clipPath(clip,stroke=0)
    pdf.setFillColor(red);pdf.rect(x,y+72*mm,cw,16*mm,stroke=0,fill=1);pdf.restoreState()
    center('BOARDGAME LẠC VIỆT',x+cw/2,y+82.5*mm,'BeVietnamSemi',6.4,colors.HexColor('#F5E5BE'))
    center(card['label'],x+cw/2,y+75.8*mm,'Playfair',16,colors.white)
    target={'knowledge':'Kiến thức','challenge':'Thử thách','resource':'Thị trường','fortune':'Lễ hội'}[card['kind']]
    center(f'Dùng tại ô {target}',x+cw/2,y+66*mm,'BeVietnamSemi',8,red)
    # Vector modules with four completely white quiet-zone modules on every edge.
    size=34*mm;left=x+(cw-size)/2;bottom=y+27*mm
    n=card['moduleCount'];q=manifest['quietZoneModules'];unit=size/(n+q*2)
    pdf.setFillColor(colors.white);pdf.rect(left,bottom,size,size,fill=1,stroke=0)
    pdf.setFillColor(ink)
    for row in range(n):
        for col in range(n):
            if card['matrix'][row*n+col]:
                pdf.rect(left+(col+q)*unit,bottom+(n+q-row-1)*unit,unit,unit,fill=1,stroke=0)
    pdf.linkURL(card['url'],(left,bottom,left+size,bottom+size),relative=0,thickness=0)
    center('Quét bằng điện thoại chung',x+cw/2,y+21*mm,'BeVietnamSemi',7)
    center('Chọn tỉnh và mở nhiệm vụ trên web',x+cw/2,y+15.5*mm,'BeVietnam',6.5)
    center('lac-viet.vercel.app',x+cw/2,y+9*mm,'BeVietnamSemi',7,red)
    center('Không cần in riêng từng câu hỏi',x+cw/2,y+4.5*mm,'BeVietnam',5.8)
    pdf.setStrokeColor(colors.HexColor('#9CA3AF'));pdf.setLineWidth(.35)
    for corner_x,sign_x in [(x,-1),(x+cw,1)]:
        for corner_y,sign_y in [(y,-1),(y+ch,1)]:
            pdf.line(corner_x+sign_x*1.2*mm,corner_y,corner_x+sign_x*4*mm,corner_y)
            pdf.line(corner_x,corner_y+sign_y*1.2*mm,corner_x,corner_y+sign_y*4*mm)

center('HƯỚNG DẪN IN',width/2,45*mm,'BeVietnamBold',9,red)
center('In A4 ở tỷ lệ 100% / Actual size, không chọn Fit to page.',width/2,38*mm,'BeVietnam',8)
center('Cắt theo dấu góc. Mỗi thẻ thành phẩm có kích thước 63 × 88 mm.',width/2,32*mm,'BeVietnam',8)
center('Bộ thẻ cần phiên bản web đã cập nhật chức năng QR để hoạt động.',width/2,21*mm,'BeVietnam',7)
pdf.save()
shutil.copy2(output,root / 'public/qr/lac-viet-qr-cards-a4.pdf')
(root / 'output/qr/pdf-card-regions.json').write_text(json.dumps({'pageWidthPt':width,'pageHeightPt':height,'cards':[{'kind':card['kind'],'x':x,'y':y,'width':63*mm,'height':88*mm} for card,(x,y) in zip(manifest['cards'],positions)]},indent=2),encoding='utf-8')
print(output)
