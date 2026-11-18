import { PHYSICAL_CARDS, physicalCardUrl } from '../../utils/physicalQR';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RULEBOOK_SECTIONS } from '../../data/rulebook';
import { BookOpen, Printer, QrCode, Award, Users, Recycle, X } from 'lucide-react';
import { generateQRCode } from '../../utils/qrcode';
import { CardLibraryPanel } from '../CardLibraryPanel';

interface RulebookTabProps {
  language: 'vi' | 'en';
}

export const RulebookTab: React.FC<RulebookTabProps> = ({ language }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const selectedSection = RULEBOOK_SECTIONS.find(section => section.id === selectedSectionId);
  const highlights = language === 'vi' ? selectedSection?.highlights : selectedSection?.enHighlights;
  const dialogRef = useRef<HTMLElement>(null);
  const [showQRPrinter, setShowQRPrinter] = useState<boolean>(false);
  const [generatedQRs, setGeneratedQRs] = useState<{ name: string; url: string; qrImg: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedSectionId) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedSectionId(null);
      }
      if (event.key === 'Tab') {
        // The close button is the only interactive element in this read-only dialog.
        event.preventDefault();
        dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    const keepFocusInDialog = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) {
        dialogRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', keepFocusInDialog);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', keepFocusInDialog);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [selectedSectionId]);

  // Generate QR batch for physical board tiles
  const handleGeneratePhysicalQRs = async () => {
    setIsGenerating(true);
    setShowQRPrinter(true);
    const list: { name: string; url: string; qrImg: string }[] = [];

    for (const card of PHYSICAL_CARDS) {
      const url = physicalCardUrl(card.kind);
      const qrImg = await generateQRCode(url);
      list.push({name:card.label,url,qrImg});
    }

    setGeneratedQRs(list);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#543310] flex items-center gap-1">
            <BookOpen size={13} className="text-[#C5A059]" />
            <span>{language === 'vi' ? 'CẨM NANG & LUẬT CHƠI' : 'GUIDEBOOK & RULES'}</span>
          </div>
          <h2 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#543310] mt-0.5">
            {language === 'vi' ? 'LUẬT CHƠI LẠC VIỆT' : 'LAC VIET RULEBOOK'}
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            {language === 'vi' 
              ? 'Quy định luật chơi, 4 bộ thẻ và kỹ năng token.' 
              : 'Official game rules, 4 card systems, and token abilities.'}
          </p>
        </div>

        {/* QR Printing button for Phygital set */}
        <button
          onClick={handleGeneratePhysicalQRs}
          className="px-3.5 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B89249] hover:to-[#C5A059] text-[#1E2538] font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95"
        >
          <QrCode size={15} />
          <span>{language === 'vi' ? 'Mã QR In Bộ Cờ' : 'Printable QR Cards'}</span>
        </button>
      </div>

      {/* 2. Rule Sections */}
      <details className="space-y-2"><summary className="cursor-pointer text-sm font-bold text-[#543310]">{language==='vi'?'Quản lý bộ thẻ chủ đề':'Manage topic card library'}</summary><CardLibraryPanel language={language}/></details>
      <div className="space-y-2.5">
        {RULEBOOK_SECTIONS.map((sec, idx) => {
          return (
            <div
              key={sec.id}
              style={{ animationDelay: `${idx * 45}ms` }}
              className="animate-stagger-item bg-white rounded-2xl border transition-all overflow-hidden border-gray-200 hover:border-gray-300"
            >
              {/* Rule detail trigger */}
              <button
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                aria-haspopup="dialog"
                className="w-full p-4 text-left flex items-center justify-between gap-3 select-none hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif-lacviet font-bold text-sm sm:text-base transition-colors text-gray-900">
                    {language === 'vi' ? sec.title : sec.enTitle}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {selectedSection && createPortal(
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade"
          onClick={event => {
            if (event.target === event.currentTarget) setSelectedSectionId(null);
          }}
        >
          <section
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rulebook-detail-title"
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden shadow-2xl border border-[#C5A059] animate-modal-pop"
          >
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-gray-100 flex-shrink-0">
              <h3 id="rulebook-detail-title" className="font-serif-lacviet font-bold text-sm sm:text-base text-[#543310]">
                {language === 'vi' ? selectedSection.title : selectedSection.enTitle}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedSectionId(null)}
                aria-label={language === 'vi' ? 'Đóng chi tiết luật' : 'Close rule details'}
                className="p-1 rounded-full text-gray-400 bg-gray-50 flex-shrink-0 hover:text-[#543310] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div key={selectedSection.id} className="p-4 sm:p-5 min-h-0 overflow-y-auto overscroll-contain text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3">
              <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#C5A059]/20 whitespace-pre-line text-xs font-normal">
                {language === 'vi' ? selectedSection.content : selectedSection.enContent}
              </div>
              {highlights && highlights.length > 0 && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 space-y-1">
                  <span className="font-bold text-xs text-amber-900 block mb-1">
                    {language === 'vi' ? '✨ Điểm cốt lõi cần nhớ:' : '✨ Key points to remember:'}
                  </span>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="text-[11px] text-amber-950 flex items-start gap-1.5">
                      <span className="text-[#C5A059] font-bold">•</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>,
        document.body
      )}

      {/* 3. Project Background & Circular Economy Info (Hồ Sơ Dự Án) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#C5A059]" />
          <h3 className="font-serif-lacviet font-bold text-base text-[#543310]">
            {language === 'vi' ? 'THÔNG TIN DỰ ÁN OLYMPIC KHỞI NGHIỆP 2026' : 'STARTUP OLYMPIAD 2026 PROJECT INFO'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#C5A059]/30 space-y-1.5">
            <span className="font-bold text-[#543310] flex items-center gap-1">
              <Users size={13} />
              <span>{language === 'vi' ? 'Đội Ngũ Thực Hiện & Cố Vấn:' : 'Team & Advisors:'}</span>
            </span>
            <ul className="space-y-1 text-gray-700 text-[11px]">
              <li>• <strong>{language === 'vi' ? 'Người hướng dẫn:' : 'Advisor:'}</strong> TS. Võ Thị Hồng Hạnh (ĐH Kinh tế Quốc dân)</li>
              <li>• <strong>Trần Lê Khanh:</strong> {language === 'vi' ? 'Trưởng nhóm, Điều phối chung (NEU)' : 'Team Leader, Coordinator (NEU)'}</li>
              <li>• <strong>Phạm Quỳnh Hương:</strong> {language === 'vi' ? 'Nghiên cứu nội dung & thị trường (FTU)' : 'Content & Market Research (FTU)'}</li>
              <li>• <strong>Trương Phương Thảo:</strong> {language === 'vi' ? 'Vận hành sản xuất & Thiết kế (NEU)' : 'Production & Design (NEU)'}</li>
              <li>• <strong>Trịnh Thị Ngân:</strong> {language === 'vi' ? 'Marketing, Tài chính - Vận hành (NEU)' : 'Marketing & Finance (NEU)'}</li>
              <li>• <strong>Lê Anh Tuấn:</strong> {language === 'vi' ? 'Kỹ thuật/Công nghệ & Phát triển App (HUST)' : 'Tech & App Development (HUST)'}</li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#C5A059]/30 space-y-1.5">
            <span className="font-bold text-[#543310] flex items-center gap-1">
              <Recycle size={13} />
              <span>{language === 'vi' ? 'Kinh Tế Tuần Hoàn & Vật Liệu Tái Chế:' : 'Circular Economy & Sustainable Materials:'}</span>
            </span>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              {language === 'vi'
                ? 'Dự án sử dụng bìa cứng và giấy tái chế gia công bàn cờ & 4 bộ thẻ bài, kết hợp sợi nhựa tái chế công nghệ in 3D cho 4 token biểu tượng văn hóa. Mô hình Phygital kết nối số hóa qua QR Code giúp cập nhật 305+ câu hỏi liên tục mà không cần in lại bộ cờ vật lý!'
                : 'The project utilizes recycled cardboard and paper for the board and card decks, with 3D-printed tokens using recycled polymer filament. The Phygital QR model dynamically connects over 305+ questions without re-printing physical assets!'}
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Batch Printing Modal */}
      {showQRPrinter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl border-4 border-[#C5A059] max-h-[85vh] flex flex-col animate-modal-pop">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="font-serif-lacviet text-lg font-bold text-[#543310]">
                  {language === 'vi' ? 'IN MÃ QR BỘ CỜ LẠC VIỆT' : 'PRINT LAC VIET QR CARDS'}
                </h3>
                <span className="text-xs text-gray-500">
                  {language === 'vi' ? 'Mã QR tương thích với bàn cờ và hệ thống thẻ bài vật lý' : 'QR codes matching the physical board and cards'}
                </span>
              </div>
              <button
                onClick={() => window.open('/qr/lac-viet-qr-cards-a4.pdf','_blank','noopener,noreferrer')}
                className="px-3 py-1.5 bg-[#543310] hover:bg-[#6F441E] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
              >
                <Printer size={13} />
                <span>{language === 'vi' ? 'Mở bản in PDF' : 'Open PDF Sheet'}</span>
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1">
              {isGenerating ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  {language === 'vi' ? 'Đang khởi tạo các mã QR chất lượng cao...' : 'Generating high-resolution QR codes...'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {generatedQRs.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center gap-1.5">
                      <img src={item.qrImg} alt={item.name} className="w-24 h-24 rounded shadow-sm border border-gray-300" />
                      <span className="font-bold text-[11px] text-gray-800 truncate w-full">{item.name}</span>
                      <a href={item.url} className="text-[10px] text-[#543310] hover:underline" target="_blank" rel="noopener noreferrer">
                        {language === 'vi' ? 'Mở thử' : 'Test link'}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {language === 'vi' ? 'Bốn mã dùng lại cho cả bàn, không phải một mã cho mỗi câu.' : '4 reusable cards for the entire match, not one QR per question.'}
            </p>
            <a href="/qr/lac-viet-qr-cards-a4.pdf" download className="px-3 py-1.5 bg-[#543310] hover:bg-[#6F441E] text-white rounded-xl text-xs font-bold flex items-center gap-1">
              {language === 'vi' ? 'Tải PDF 4 thẻ để in A4' : 'Download 4-Card A4 PDF'}
            </a>
            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowQRPrinter(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

