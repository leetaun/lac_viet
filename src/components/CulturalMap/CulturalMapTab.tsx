import React, { useState } from 'react';
import { PROVINCES_DATA, ProvinceInfo } from '../../data/provinces';
import { generateQRCode } from '../../utils/qrcode';
import { Search, MapPin, Sparkles, BookOpen, ShoppingBag, Swords, QrCode, X, Filter, Trophy } from 'lucide-react';

interface CulturalMapTabProps {
  language: 'vi' | 'en';
}

export const CulturalMapTab: React.FC<CulturalMapTabProps> = ({ language }) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'bac_bo' | 'trung_bo' | 'nam_bo'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceInfo | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Filter provinces
  const filteredProvinces = PROVINCES_DATA.filter(p => {
    const matchesRegion = selectedRegion === 'all' || p.region === selectedRegion;
    const matchesType = selectedType === 'all' || p.tileType === selectedType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.heritage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  const countBac = PROVINCES_DATA.filter(p => p.region === 'bac_bo').length;
  const countTrung = PROVINCES_DATA.filter(p => p.region === 'trung_bo').length;
  const countNam = PROVINCES_DATA.filter(p => p.region === 'nam_bo').length;

  const handleSelectProvince = async (province: ProvinceInfo) => {
    setSelectedProvince(province);
    const qr = await generateQRCode(province.qrCodeUrl);
    setQrCodeUrl(qr);
  };

  const getTileBadgeStyle = (type: string) => {
    switch (type) {
      case 'Kiến thức':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lễ hội':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Thị trường':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Thử thách':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm">
        <h2 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#543310] flex items-center gap-2">
          <span>🗺️</span>
          <span>BẢN ĐỒ 36 ĐỊA PHƯƠNG</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          36 địa phương trên 3 miền: 15 Bắc Bộ · 13 Trung Bộ · 8 Nam Bộ.
        </p>

        {/* Search & Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {/* Search box */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tỉnh thành, di sản..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'all' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả (36)
            </button>
            <button
              onClick={() => setSelectedRegion('bac_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'bac_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bắc Bộ ({countBac})
            </button>
            <button
              onClick={() => setSelectedRegion('trung_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'trung_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trung Bộ ({countTrung})
            </button>
            <button
              onClick={() => setSelectedRegion('nam_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'nam_bo' ? 'bg-[#543310] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nam Bộ ({countNam})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Provinces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProvinces.map((province, idx) => (
          <div
            key={province.id}
            onClick={() => handleSelectProvince(province)}
            style={{ animationDelay: `${(idx % 12) * 40}ms` }}
            className="animate-stagger-item bg-white p-3.5 rounded-2xl border border-gray-200 hover:border-[#C5A059] shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif-lacviet font-bold text-gray-900 text-sm group-hover:text-[#543310] transition-colors">
                {province.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTileBadgeStyle(province.tileType)}`}>
                {province.tileType}
              </span>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {province.heritage}
            </p>

            <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="truncate max-w-[170px]">
                🌾 {province.specialty.split(',')[0]}
              </span>
              <span className="text-[#543310] font-bold group-hover:underline">
                Chi tiết →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Province Detail Modal with Artifacts, Market Quiz, Festivals */}
      {selectedProvince && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] max-h-[90vh] flex flex-col animate-modal-pop">
            
            {/* Modal Header */}
            <div className="p-4 brown-gradient-bg text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
                  {selectedProvince.regionName} · Ô {selectedProvince.tileType}
                </span>
                <h3 className="font-serif-lacviet text-xl font-bold">
                  {selectedProvince.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProvince(null)}
                className="p-1 rounded-full text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-gray-700">
              
              {/* Heritage Description */}
              <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 leading-relaxed">
                <span className="font-bold text-[#543310] block mb-1">🏛️ Di sản tiêu biểu:</span>
                <p className="text-gray-800">{selectedProvince.heritage}</p>
                <p className="text-gray-600 mt-1">{selectedProvince.description}</p>
              </div>

              {/* 3 Digital Artifacts (2 regular, 1 treasure) */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 space-y-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Trophy size={14} className="text-amber-700" /> KHO KỶ VẬT CỦA TỈNH:
                </span>
                <div className="space-y-1">
                  {selectedProvince.artifacts.regular.map((art, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-gray-800 bg-white p-1.5 rounded-lg border border-amber-100">
                      <span>• {art}</span>
                      <span className="text-[10px] text-gray-400">(Kỷ vật thường)</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-amber-950 font-bold bg-amber-100/70 p-1.5 rounded-lg border border-amber-300">
                    <span>⭐ {selectedProvince.artifacts.treasure}</span>
                    <span className="text-[10px] bg-amber-200 px-1 rounded font-bold">BẢO VẬT</span>
                  </div>
                </div>
              </div>

              {/* Specialty & Market Quiz */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <ShoppingBag size={14} className="text-emerald-700" /> ĐẶC SẢN & PHIÊN CHỢ:
                </span>
                <p className="text-gray-700">{selectedProvince.specialty}</p>
                <div className="text-[11px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-200 mt-1">
                  <strong>Đặc sản đấu giá: </strong> {selectedProvince.marketQuiz.item}
                  <div className="text-gray-500 italic mt-0.5">{selectedProvince.marketQuiz.marketHint}</div>
                </div>
              </div>

              {/* Festivals */}
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70 space-y-1">
                <span className="font-bold text-rose-950 flex items-center gap-1">
                  <Sparkles size={14} className="text-rose-700" /> LỄ HỘI TRUYỀN THỐNG:
                </span>
                <p className="text-gray-700">{selectedProvince.festivals.join(' • ')}</p>
              </div>

              {/* QR Code Deep Dive */}
              {qrCodeUrl && (
                <div className="text-center pt-2 border-t border-gray-100">
                  <img src={qrCodeUrl} alt="QR" className="w-24 h-24 mx-auto rounded-lg border border-gray-200" />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Quét QR trên điện thoại để xem dữ liệu văn hóa mở rộng
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
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
