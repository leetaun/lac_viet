export const PRINT_SITE_URL = 'https://lac-viet.vercel.app/';
export const PHYSICAL_CARDS = [
  {kind:'knowledge',label:'Kiến thức',group:'knowledge',description:'Đến ô Kiến thức · Mở câu hỏi và chọn tỉnh'},
  {kind:'challenge',label:'Thử thách',group:'challenge',description:'Đến ô Thử thách · Chọn tỉnh và vượt ải'},
  {kind:'resource',label:'Tài nguyên',group:'market',description:'Đến ô Thị trường · Nhận thẻ và trả giá'},
  {kind:'fortune',label:'May mắn',group:'festival',description:'Đến ô Lễ hội · Mở thẻ và thực hiện hiệu lực'},
] as const;
export type PhysicalCardKind = typeof PHYSICAL_CARDS[number]['kind'];
export const isPhysicalKind = (value: unknown): value is PhysicalCardKind => PHYSICAL_CARDS.some(c=>c.kind===value);
export function physicalCardUrl(kind: PhysicalCardKind, base = PRINT_SITE_URL): string {
  const url=new URL(base);
  if(!isPhysicalKind(kind)||url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw new Error('Cần địa chỉ HTTPS chính thức, không kèm tài khoản, tham số hoặc mã tạm.');
  if(url.hostname==='localhost'||url.hostname.endsWith('.localhost')||/^(127\.|192\.168\.|10\.)/.test(url.hostname))throw new Error('Không tạo mã in từ địa chỉ máy cục bộ.');
  url.hash=`card=${kind}`;
  return url.toString();
}
export function readPhysicalCard(hash: string): PhysicalCardKind | null {
  const params=new URLSearchParams(hash.replace(/^#/,''));
  const value=params.get('card');return isPhysicalKind(value)?value:null;
}
