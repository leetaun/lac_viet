import fs from 'node:fs';
import QRCode from 'qrcode';
import { PHYSICAL_CARDS, physicalCardUrl, PRINT_SITE_URL } from '../src/utils/physicalQR.ts';

fs.mkdirSync('output/qr',{recursive:true});fs.mkdirSync('public/qr',{recursive:true});
const cards=[];
for(const card of PHYSICAL_CARDS){
  const url=physicalCardUrl(card.kind);
  const options={errorCorrectionLevel:'Q',margin:4,width:1200,color:{dark:'#1E2538',light:'#FFFFFF'}};
  const svg=await QRCode.toString(url,{...options,type:'svg'});
  const png=await QRCode.toBuffer(url,{...options,type:'png'});
  for(const directory of ['output/qr','public/qr']){
    fs.writeFileSync(`${directory}/${card.kind}.svg`,svg);fs.writeFileSync(`${directory}/${card.kind}.png`,png);
  }
  const matrix=QRCode.create(url,{errorCorrectionLevel:'Q'}).modules;
  cards.push({...card,url,moduleCount:matrix.size,matrix:Array.from(matrix.data)});
}
const manifest={site:PRINT_SITE_URL,cardWidthMm:63,cardHeightMm:88,quietZoneModules:4,errorCorrection:'Q',cards};
fs.writeFileSync('output/qr/manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('public/qr/manifest.json',JSON.stringify({...manifest,cards:cards.map(({matrix,...card})=>card)},null,2)+'\n');
console.log(cards.map(card=>`${card.label}: ${card.url}`).join('\n'));
