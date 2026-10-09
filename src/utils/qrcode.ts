import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#7E121D', // Màu đỏ trầm Lạc Việt quý phái
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

