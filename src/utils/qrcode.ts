import QRCode from 'qrcode';

export async function generateQRCode(text: string, options: {width?:number; margin?:number} = {}): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width ?? 280,
      margin: options.margin ?? 2,
      color: {
        dark: '#543310', // Màu nâu trầm hoàng gia Lạc Việt
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

