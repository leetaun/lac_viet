import React, { useState } from 'react';
import { Player, BoardSpace } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { Sparkles, ShoppingBag, RotateCcw, ShieldCheck, Flag, CheckCircle2, ArrowRight } from 'lucide-react';

interface CornerStationModalProps {
  station: BoardSpace;
  player: Player;
  penalizedArtifactsAtStart: number;
  onSelectOption: (option: 'fortune' | 'resource' | 'restore_skill' | 'safe_deposit' | 'reclaim_start') => void;
  onClose: () => void;
  language: 'vi' | 'en';
}

export const CornerStationModal: React.FC<CornerStationModalProps> = ({
  station,
  player,
  penalizedArtifactsAtStart,
  onSelectOption,
  onClose,
  language
}) => {
  const isStart = station.index === 0;
  const tokenDef = TOKENS[player.token];
  const [startQuizStep, setStartQuizStep] = useState<number>(0);

  // START 2 Questions
  const startQuestions = [
    {
      q: 'Quốc hiệu đầu tiên của nước ta thời các vua Hùng dựng nước là gì?',
      opts: ['Văn Lang', 'Âu Lạc', 'Đại Cồ Việt', 'Vạn Xuân'],
      correct: 0
    },
    {
      q: 'Hình tượng chim Lạc trên Trống đồng Đông Sơn thể hiện điều gì?',
      opts: ['Khát vọng vươn lên và tín ngưỡng sùng bái tự nhiên', 'Biểu tượng chiến tranh chinh phạt', 'Thần tài lộc trong buôn bán', 'Lễ nghi tang lễ cổ'],
      correct: 0
    }
  ];

  const handleAnswerStartQuiz = (optIndex: number) => {
    if (optIndex === startQuestions[startQuizStep].correct) {
      soundManager.playSuccess();
      if (startQuizStep < 1) {
        setStartQuizStep(1);
      } else {
        // Finished both questions successfully!
        onSelectOption('fortune');
      }
    } else {
      soundManager.playPenalty();
      alert('Chưa chính xác! Bạn đã bỏ lỡ cơ hội nhận Thẻ May Mắn tại START.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#941B26] via-[#7E121D] to-[#5C0D15] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
              {isStart ? 'Ô ĐẶC BIỆT' : 'TRẠM DỪNG CHÂN'}
            </span>
            <h2 className="font-serif-lacviet text-lg sm:text-xl font-bold flex items-center gap-2">
              {isStart ? <Flag size={20} className="text-[#C5A059]" /> : <span>🏛️</span>}
              <span>{station.name}</span>
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#C5A059] text-[#1E2538]">
            Ô #{station.index}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-xs sm:text-sm text-gray-700 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30 leading-relaxed">
            {station.description}
          </p>

          {/* START Tile Special Flow */}
          {isStart ? (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs text-amber-900">
                <div className="font-bold mb-1 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-700" />
                  <span>Vượt qua START: Trả lời 2 câu hỏi để nhận Thẻ May Mắn!</span>
                </div>
                <div className="font-semibold text-gray-800 mt-2">
                  Câu hỏi {startQuizStep + 1}/2: {startQuestions[startQuizStep].q}
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {startQuestions[startQuizStep].opts.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerStartQuiz(i)}
                      className="p-2 text-left bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-medium text-gray-800 transition-colors shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reclaim Penalized Artifact at START if any */}
              {penalizedArtifactsAtStart > 0 && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between gap-2">
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold">✨ Có {penalizedArtifactsAtStart} Kỷ vật bị phạt tại đây!</span>
                    <div className="text-[11px] text-emerald-700">Giải cứu 1 kỷ vật về túi của bạn ngay.</div>
                  </div>
                  <button
                    onClick={() => onSelectOption('reclaim_start')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex-shrink-0"
                  >
                    Chiếm lại Kỷ vật
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 3 Corner Stations: Bac Bo, Trung Bo, Nam Bo */
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-gray-800 mb-1">
                Chọn 1 quyền lợi tại Trạm Dừng Chân:
              </div>

              {/* Option A: Fortune Card */}
              <button
                onClick={() => onSelectOption('fortune')}
                className="w-full p-3 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-amber-950">
                      Rút 1 Thẻ May Mắn
                    </div>
                    <div className="text-[11px] text-amber-800/80">
                      Nhận các thời vận (đổ thêm xúc xắc, đón gió lành...)
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-amber-700" />
              </button>

              {/* Option B: Resource Card */}
              <button
                onClick={() => onSelectOption('resource')}
                className="w-full p-3 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-emerald-950">
                      Rút 1 Thẻ Tài Nguyên
                    </div>
                    <div className="text-[11px] text-emerald-800/80">
                      Nhận lá chắn bảo hộ, đất đai hoặc vật phẩm đổi chác
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-emerald-700" />
              </button>

              {/* Option C: Restore Token Skill */}
              <button
                onClick={() => onSelectOption('restore_skill')}
                className="w-full p-3 rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
                    <RotateCcw size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-blue-950">
                      Hồi Phục Kỹ Năng Token [{tokenDef.name}]
                    </div>
                    <div className="text-[11px] text-blue-800/80">
                      Khôi phục 1 lần sử dụng nội tại token cho vòng này
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-blue-700" />
              </button>

              {/* Option D: Safe deposit artifacts */}
              {player.artifacts > 0 && (
                <button
                  onClick={() => onSelectOption('safe_deposit')}
                  className="w-full p-3 rounded-xl border border-[#C5A059] bg-[#FAF6EE] hover:bg-[#F5E5BE]/50 text-left transition-all flex items-center justify-between group mt-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#C5A059]/20 text-[#7E121D] group-hover:scale-110 transition-transform">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#7E121D]">
                        Gửi An Toàn {player.artifacts} Kỷ Vật Tại Trạm
                      </div>
                      <div className="text-[11px] text-gray-600">
                        Bảo vệ kỷ vật khỏi bị đối thủ cướp khi tiếp tục hành trình!
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-[#7E121D]" />
                </button>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

