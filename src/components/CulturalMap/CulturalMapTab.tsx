import React, { useEffect, useState } from 'react';
import { VietnamProvinceMap } from './VietnamProvinceMap';
import { PROVINCES_DATA, ProvinceInfo } from '../../data/provinces';
import { getProvinceData, getArtifactName } from '../../data/culturalTranslations';
import { generateQRCode } from '../../utils/qrcode';
import { Sparkles, ShoppingBag, X, Trophy } from 'lucide-react';

interface CulturalMapTabProps {
  language: 'vi' | 'en';
}

export const CulturalMapTab: React.FC<CulturalMapTabProps> = ({ language }) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'bac_bo' | 'trung_bo' | 'nam_bo'>('all');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceInfo | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Filter provinces
  const filteredProvinces = PROVINCES_DATA.filter(p => selectedRegion === 'all' || p.region === selectedRegion);

  const countBac = PROVINCES_DATA.filter(p => p.region === 'bac_bo').length;
  const countTrung = PROVINCES_DATA.filter(p => p.region === 'trung_bo').length;
  const countNam = PROVINCES_DATA.filter(p => p.region === 'nam_bo').length;

  const handleSelectProvince = (province: ProvinceInfo) => setSelectedProvince(province);

  useEffect(() => {
    setQrCodeUrl('');
    if (!selectedProvince) return;
    let active = true;
    generateQRCode(selectedProvince.qrCodeUrl).then(qr => { if (active) setQrCodeUrl(qr); }).catch(() => {});
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedProvince(null); };
    window.addEventListener('keydown', onKey);
    return () => { active = false; window.removeEventListener('keydown', onKey); };
  }, [selectedProvince]);

  const getTileBadgeLabel = (type: string) => {
    if (language === 'vi') return type;
    switch (type) {
      case 'Kiến thức':
        return 'Knowledge';
      case 'Lễ hội':
        return 'Festival';
      case 'Thị trường':
        return 'Market';
      case 'Thử thách':
        return 'Challenge';
      default:
        return type;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm">
        <h2 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#543310] flex items-center gap-2">
          <span>🗺️</span>
          <span>{language === 'vi' ? 'BẢN ĐỒ 36 ĐỊA PHƯƠNG' : 'MAP OF 36 PROVINCES'}</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          {language === 'vi' 
            ? '36 địa phương trên 3 miền: 15 Bắc Bộ · 13 Trung Bộ · 8 Nam Bộ.' 
            : '36 provinces across 3 regions: 15 North · 13 Central · 8 South.'}
        </p>

        {/* Region Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'all' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'vi' ? 'Tất cả' : 'All'} (36)
            </button>
            <button
              onClick={() => setSelectedRegion('bac_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'bac_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'vi' ? 'Bắc Bộ' : 'North'} ({countBac})
            </button>
            <button
              onClick={() => setSelectedRegion('trung_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'trung_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'vi' ? 'Trung Bộ' : 'Central'} ({countTrung})
            </button>
            <button
              onClick={() => setSelectedRegion('nam_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'nam_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'vi' ? 'Nam Bộ' : 'South'} ({countNam})
            </button>
          </div>
        </div>
      </div>

      <VietnamProvinceMap language={language} visibleProvinces={filteredProvinces} onSelect={handleSelectProvince} />

      {/* Province Detail Modal with Artifacts, Market Quiz, Festivals */}
      {selectedProvince && (() => {
        const pData = getProvinceData(selectedProvince, language);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
            <div role="dialog" aria-modal="true" aria-labelledby="province-detail-title" className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] max-h-[90vh] flex flex-col animate-modal-pop">
              
              {/* Modal Header */}
              <div className="p-4 brown-gradient-bg text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
                    {pData.regionName} · {language === 'vi' ? `Ô ${selectedProvince.tileType}` : `${getTileBadgeLabel(selectedProvince.tileType)} Space`}
                  </span>
                  <h3 id="province-detail-title" className="font-serif-lacviet text-xl font-bold">
                    {pData.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProvince(null)}
                  aria-label={language === 'vi' ? 'Đóng' : 'Close'}
                  className="p-1 rounded-full text-white/70 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-gray-700">
                
                {/* Heritage Description */}
                <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 leading-relaxed">
                  <span className="font-bold text-[#543310] block mb-1">
                    {language === 'vi' ? '🏛️ Di sản tiêu biểu:' : '🏛️ Notable Heritage:'}
                  </span>
                  <p className="text-gray-800">{pData.heritage}</p>
                  <p className="text-gray-600 mt-1">{pData.description}</p>
                </div>

                {/* 3 Digital Artifacts (2 regular, 1 treasure) */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 space-y-1.5">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <Trophy size={14} className="text-amber-700" /> 
                    {language === 'vi' ? 'KHO KỶ VẬT CỦA TỈNH:' : 'PROVINCIAL ARTIFACT VAULT:'}
                  </span>
                  <div className="space-y-1">
                    {selectedProvince.artifacts.regular.map((art, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-gray-800 bg-white p-1.5 rounded-lg border border-amber-100">
                        <span>• {getArtifactName(art, language)}</span>
                        <span className="text-[10px] text-gray-400">
                          {language === 'vi' ? '(Kỷ vật thường)' : '(Common Artifact)'}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-amber-950 font-bold bg-amber-100/70 p-1.5 rounded-lg border border-amber-300">
                      <span>⭐ {getArtifactName(selectedProvince.artifacts.treasure, language)}</span>
                      <span className="text-[10px] bg-amber-200 px-1 rounded font-bold">
                        {language === 'vi' ? 'BẢO VẬT' : 'TREASURE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialty & Market Quiz */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-1">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <ShoppingBag size={14} className="text-emerald-700" /> 
                    {language === 'vi' ? 'ĐẶC SẢN & PHIÊN CHỢ:' : 'SPECIALTY & MARKET AUCTION:'}
                  </span>
                  <p className="text-gray-700">{pData.specialty}</p>
                  <div className="text-[11px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-200 mt-1">
                    <strong>{language === 'vi' ? 'Đặc sản đấu giá:' : 'Auction item:'} </strong> {pData.marketItem}
                    <div className="text-gray-500 italic mt-0.5">{pData.marketHint}</div>
                  </div>
                </div>

                {/* Festivals */}
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70 space-y-1">
                  <span className="font-bold text-rose-950 flex items-center gap-1">
                    <Sparkles size={14} className="text-rose-700" /> 
                    {language === 'vi' ? 'LỄ HỘI TRUYỀN THỐNG:' : 'TRADITIONAL FESTIVALS:'}
                  </span>
                  <p className="text-gray-700">{pData.festivals.join(' • ')}</p>
                </div>

                {/* QR Code Deep Dive */}
                {qrCodeUrl && (
                  <div className="text-center pt-2 border-t border-gray-100">
                    <img src={qrCodeUrl} alt="QR" className="w-24 h-24 mx-auto rounded-lg border border-gray-200" />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {language === 'vi' 
                        ? 'Quét QR trên điện thoại để xem dữ liệu văn hóa mở rộng' 
                        : 'Scan QR on phone to explore digital heritage archives'}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
