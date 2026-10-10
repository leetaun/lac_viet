import React, { useState } from 'react';
import { PROVINCES_DATA, ProvinceInfo } from '../../data/provinces';
import { generateQRCode } from '../../utils/qrcode';
import { Search, MapPin, Sparkles, BookOpen, ShoppingBag, Swords, QrCode, X, Filter } from 'lucide-react';

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
        <h2 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#7E121D] flex items-center gap-2">
          <span>🗺️</span>
          <span>BẢN ĐỒ HÀNH TRÌNH VĂN HÓA VIỆT NAM</span>
        </h2>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Khám phá 34 tỉnh/thành tiêu biểu qua 3 miền Bắc - Trung - Nam với 4 phân loại ô chức năng: Kiến thức, Lễ hội, Thị trường và Thử thách.
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
              placeholder="Tìm kiếm tỉnh thành, di sản (Hà Nội, Huế, Sa Pa...)"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'all' ? 'bg-[#7E121D] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả (34)
            </button>
            <button
              onClick={() => setSelectedRegion('bac_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'bac_bo' ? 'bg-[#7E121D] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bắc Bộ (15)
            </button>
            <button
              onClick={() => setSelectedRegion('trung_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'trung_bo' ? 'bg-[#7E121D] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trung Bộ (11)
            </button>
            <button
              onClick={() => setSelectedRegion('nam_bo')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                selectedRegion === 'nam_bo' ? 'bg-[#7E121D] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nam Bộ (8)
            </button>
          </div>
        </div>

        {/* Tile Type Quick Filters */}
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap text-[11px]">
          <span className="text-gray-400 font-medium">Lọc theo ô:</span>
          {['all', 'Kiến thức', 'Lễ hội', 'Thị trường', 'Thử thách'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-0.5 rounded-full border transition-all duration-200 active:scale-95 ${
                selectedType === type
                  ? 'bg-gray-800 text-white border-gray-800 font-bold shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'Tất cả loại ô' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Provinces Grid matching Slide 9 */}
      <div key={`${selectedRegion}-${selectedType}-${searchQuery}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {filteredProvinces.map((prov, idx) => (
          <div
            key={prov.id}
            onClick={() => handleSelectProvince(prov)}
            style={{ animationDelay: `${Math.min(idx * 30, 450)}ms` }}
            className="animate-stagger-item bg-white rounded-2xl p-3.5 border border-gray-200 hover:border-[#C5A059] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-98"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-gray-900 group-hover:text-[#7E121D] transition-colors">
                  {prov.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTileBadgeStyle(prov.tileType)}`}>
                  {prov.tileType}
                </span>
              </div>

              <div className="text-[11px] text-[#C5A059] font-medium flex items-center gap-1 mb-1 truncate">
                <MapPin size={11} className="flex-shrink-0" />
                <span className="truncate">{prov.heritage}</span>
              </div>

              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {prov.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-[10px] text-gray-400">
              <span>{prov.regionName}</span>
              <span className="text-[#7E121D] font-bold group-hover:underline flex items-center gap-0.5">
                Xem di sản & QR →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Province Detail Modal */}
      {selectedProvince && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#941B26] via-[#7E121D] to-[#5C0D15] text-white flex items-center justify-between">
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

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
              
              {/* Heritage highlight */}
              <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C5A059]/30">
                <div className="text-xs font-bold text-[#7E121D] mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#C5A059]" />
                  <span>Di sản & Danh lam tiêu biểu:</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-800">
                  {selectedProvince.heritage}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {selectedProvince.description}
              </div>

              {/* Special food & festivals */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-800 block mb-0.5">🍜 Đặc sản trứ danh:</span>
                  <span className="text-gray-600 text-[11px]">{selectedProvince.specialty}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-800 block mb-0.5">🎋 Lễ hội truyền thống:</span>
                  <span className="text-gray-600 text-[11px]">{selectedProvince.festivals.join(', ')}</span>
                </div>
              </div>

              {/* QR Code Section */}
              {qrCodeUrl && (
                <div className="bg-gradient-to-br from-[#FAF6EE] to-[#FFFDF9] p-3.5 rounded-2xl border border-[#C5A059]/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#7E121D] block">
                      MÃ QR KẾT NỐI VĂN HÓA SỐ
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Quét bằng điện thoại để tra cứu kho tư liệu lịch sử, bản đồ 3D và câu hỏi mở rộng.
                    </p>
                  </div>
                  <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 rounded-lg shadow-sm border border-gray-200 flex-shrink-0" />
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedProvince(null)}
                className="px-5 py-2 bg-[#7E121D] text-white font-bold rounded-xl text-xs hover:bg-[#941B26]"
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

