import React, { useState } from 'react';
import { RULEBOOK_SECTIONS } from '../../data/rulebook';
import { BookOpen, ChevronDown, ChevronUp, Printer, QrCode, ExternalLink, Award, Users, Recycle } from 'lucide-react';
import { BOARD_SPACES } from '../../data/boardData';
import { generateQRCode } from '../../utils/qrcode';

interface RulebookTabProps {
  language: 'vi' | 'en';
}

export const RulebookTab: React.FC<RulebookTabProps> = ({ language }) => {
  const [openSectionId, setOpenSectionId] = useState<string>('overview');
  const [showQRPrinter, setShowQRPrinter] = useState<boolean>(false);
  const [generatedQRs, setGeneratedQRs] = useState<{ name: string; url: string; qrImg: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const toggleSection = (id: string) => {
    setOpenSectionId(openSectionId === id ? '' : id);
  };

  // Generate QR batch for physical board tiles
  const handleGeneratePhysicalQRs = async () => {
    setIsGenerating(true);
    setShowQRPrinter(true);
    const list: { name: string; url: string; qrImg: string }[] = [];

    // Take representative spaces
    const sampleSpaces = BOARD_SPACES.filter(s => s.type !== 'corner' || s.index === 0).slice(0, 16);
    for (const space of sampleSpaces) {
      const url = `https://lacviet.edu.vn/space/${space.index}-${space.name.toLowerCase().replace(/\s+/g, '-')}`;
      const qrImg = await generateQRCode(url);
      list.push({ name: `${space.name} (#${space.index})`, url, qrImg });
    }

    setGeneratedQRs(list);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7E121D] flex items-center gap-1">
            <BookOpen size={13} className="text-[#C5A059]" />
            <span>CẨM NANG & LUẬT CHƠI TOÀN TẬP</span>
          </div>
          <h2 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#7E121D] mt-0.5">
            LUẬT CHƠI BOARDGAME LẠC VIỆT
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Tra cứu toàn bộ quy định luật chơi, 4 bộ thẻ, cơ chế cướp & phạt, và kỹ năng token.
          </p>
        </div>

        {/* QR Printing button for Phygital set */}
        <button
          onClick={handleGeneratePhysicalQRs}
          className="px-3.5 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B89249] hover:to-[#C5A059] text-[#1E2538] font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95"
        >
          <QrCode size={15} />
          <span>Tạo Mã QR In Bộ Cờ Vật Lý</span>
        </button>
      </div>

      {/* 2. Accordion Sections (Matching Slide 10) */}
      <div className="space-y-2.5">
        {RULEBOOK_SECTIONS.map((sec) => {
          const isOpen = openSectionId === sec.id;

          return (
            <div
              key={sec.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif-lacviet font-bold text-sm sm:text-base text-gray-900">
                    {language === 'vi' ? sec.title : sec.enTitle}
                  </span>
                </div>
                <div className="p-1 rounded-full text-gray-400 bg-gray-50 flex-shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 animate-in fade-in duration-150">
                  <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#C5A059]/20 whitespace-pre-line text-xs font-normal">
                    {language === 'vi' ? sec.content : sec.enContent}
                  </div>

                  {sec.highlights && sec.highlights.length > 0 && (
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1">
                      <span className="font-bold text-xs text-amber-900 block mb-1">
                        ✨ Điểm cốt lõi cần nhớ:
                      </span>
                      {sec.highlights.map((h, i) => (
                        <div key={i} className="text-[11px] text-amber-950 flex items-start gap-1.5">
                          <span className="text-[#C5A059] font-bold">•</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Project Background & Circular Economy Info (Hồ Sơ Dự Án) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#C5A059]" />
          <h3 className="font-serif-lacviet font-bold text-base text-[#7E121D]">
            THÔNG TIN DỰ ÁN OLYMPIC KHỞI NGHIỆP 2026
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#C5A059]/30 space-y-1.5">
            <span className="font-bold text-[#7E121D] flex items-center gap-1">
              <Users size={13} />
              <span>Đội Ngũ Thực Hiện & Cố Vấn:</span>
            </span>
            <ul className="space-y-1 text-gray-700 text-[11px]">
              <li>• <strong>Người hướng dẫn:</strong> TS. Võ Thị Hồng Hạnh (ĐH Kinh tế Quốc dân)</li>
              <li>• <strong>Trần Lê Khanh:</strong> Trưởng nhóm, Điều phối chung (NEU)</li>
              <li>• <strong>Phạm Quỳnh Hương:</strong> Nghiên cứu nội dung & thị trường (FTU)</li>
              <li>• <strong>Trương Phương Thảo:</strong> Vận hành sản xuất & Thiết kế (NEU)</li>
              <li>• <strong>Trịnh Thị Ngân:</strong> Marketing, Tài chính - Vận hành (NEU)</li>
              <li>• <strong>Lê Anh Tuấn:</strong> Kỹ thuật/Công nghệ & Phát triển App (HUST)</li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#C5A059]/30 space-y-1.5">
            <span className="font-bold text-[#7E121D] flex items-center gap-1">
              <Recycle size={13} />
              <span>Kinh Tế Tuần Hoàn & Vật Liệu Tái Chế:</span>
            </span>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Dự án sử dụng bìa cứng và giấy tái chế gia công bàn cờ & 4 bộ thẻ bài, kết hợp sợi nhựa tái chế công nghệ in 3D cho 4 token biểu tượng văn hóa. Mô hình Phygital kết nối số hóa qua QR Code giúp cập nhật 305+ câu hỏi liên tục mà không cần in lại bộ cờ vật lý!
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Batch Printing Modal */}
      {showQRPrinter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border-4 border-[#C5A059] max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="font-serif-lacviet text-lg font-bold text-[#7E121D]">
                  TRUNG TÂM IN MÃ QR BỘ CỜ LẠC VIỆT
                </h3>
                <span className="text-xs text-gray-500">
                  Mã QR tương thích với bàn cờ và hệ thống thẻ bài vật lý ngoài đời
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-[#7E121D] text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Printer size={13} />
                <span>In trang</span>
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1">
              {isGenerating ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  Đang khởi tạo các mã QR chất lượng cao...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {generatedQRs.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center gap-1.5">
                      <img src={item.qrImg} alt={item.name} className="w-24 h-24 rounded shadow-sm border border-gray-300" />
                      <span className="font-bold text-[11px] text-gray-800 truncate w-full">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowQRPrinter(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs"
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

