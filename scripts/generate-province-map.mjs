import fs from 'node:fs';

// Source: lamngockhuong/vietnam-3d-map (MIT), public/provinces.json.
// Coordinates are simplified for the cultural game map, not navigation.
const source = JSON.parse(fs.readFileSync('output/map-provinces-source.json', 'utf8'));
const names = { '01':'hanoi','04':'caobang','08':'tuyenquang','11':'dienbien','12':'laichau','14':'sonla','15':'laocai','19':'thainguyen','20':'langson','22':'quangninh','24':'bacninh','25':'phutho','31':'haiphong','33':'hungyen','37':'ninhbinh','38':'thanhhoa','40':'nghean','42':'hatinh','44':'quangtri','46':'hue','48':'danang','51':'quangngai','52':'gialai','56':'khanhhoa','66':'daklak','68':'lamdong','75':'dongnai','79':'tphcm','80':'tayninh','82':'dongthap','86':'vinhlong','91':'angiang','92':'cantho','96':'camau' };
const project = ([lon, lat]) => [+(155 + (lon - 102) * 63).toFixed(1), +(45 + (23.5 - lat) * 63).toFixed(1)];
function area(ring) { return ring.reduce((sum, p, i) => { const q = ring[(i + 1) % ring.length]; return sum + p[0]*q[1]-q[0]*p[1]; }, 0)/2; }
function centroid(ring) {
  const a = area(ring); let x=0,y=0;
  ring.forEach((p,i) => {const q=ring[(i+1)%ring.length]; const c=p[0]*q[1]-q[0]*p[1];x+=(p[0]+q[0])*c;y+=(p[1]+q[1])*c;});
  return project([x/(6*a),y/(6*a)]);
}
const output = source.provinces.map(p => {
  // Offshore archipelagos have their own selectable game locations.
  const polygons = p.polygons.filter(r => r.every(([lon]) => lon < 110) && Math.abs(area(r)) > .00015);
  const largest = polygons.reduce((a,b) => Math.abs(area(a)) > Math.abs(area(b)) ? a : b);
  const d = polygons.map(r => r.map((p,i) => `${i?'L':'M'}${project(p).join(',')}`).join('')+'Z').join('');
  return {id:names[p.id], d, center:centroid(largest)};
});
fs.writeFileSync('src/data/provinceMap.json', JSON.stringify(output));
console.log(output.map(p => `${p.id}: [${p.center.join(', ')}]`).join('\n'));
