import React, { useState } from 'react';
import { Player, BoardSpace, ArtifactItem } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { Sparkles, ShoppingBag, RotateCcw, ShieldCheck, Flag, CheckCircle2, ArrowRight, Unlock, Mic } from 'lucide-react';

interface CornerStationModalProps {
  station: BoardSpace;
  player: Player;
  penalizedArtifactsAtStart: number;
  lostAndFoundList?: ArtifactItem[];
  onSelectOption: (option: 'fortune' | 'resource' | 'restore_skill' | 'safe_deposit' | 'reclaim_start', extraData?: any) => void;
  onGuideApproval?: () => Promise<boolean>;
  onClose: () => void;
  language: 'vi' | 'en';
}

export const CornerStationModal: React.FC<CornerStationModalProps> = ({
  station,
  player,
  penalizedArtifactsAtStart,
  lostAndFoundList = [],
  onSelectOption,
  onClose,
  onGuideApproval,
  language
}) => {
  const isStart = station.index === 0;
  const tokenDef = TOKENS[player.token];
  const [approvingGuide, setApprovingGuide] = useState(false);
  const finished = React.useRef(false);
  const [startQuizStep, setStartQuizStep] = useState<number>(0);
  const [startQuizScore, setStartQuizScore] = useState<number>(0);
  const [guidePresentationDone, setGuidePresentationDone] = useState<boolean>(false);
  const [selectedArtifactToDeposit, setSelectedArtifactToDeposit] = useState<string[]>([]);

  // Count unsealed artifacts during corner visit
  const sealedArtifactsCount = player.artifactItems.filter(a => a.isSealed).length;
  const pouchArtifacts = player.artifactItems.filter(a => a.storage === 'pouch' && !a.isSealed);

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

  const finishStart = (score: number) => {
    if (finished.current) return;
    finished.current = true;
    if (score === 2 && lostAndFoundList.length > 0) onSelectOption('reclaim_start');
    else if (score > 0) onSelectOption(score === 2 ? 'fortune' : 'resource');
    else onClose();
  };
  const handleAnswerStartQuiz = (optIndex: number) => {
    if (finished.current || approvingGuide) return;
    const correct = optIndex === startQuestions[startQuizStep].correct;
    const score = startQuizScore + (correct ? 1 : 0);
    setStartQuizScore(score);
    if (startQuizStep === 0) setStartQuizStep(1);
    else finishStart(score);
  };
  const handleGuideSubstitute = async () => {
    if (guidePresentationDone || approvingGuide || finished.current) return;
    setApprovingGuide(true);
    const approved = await onGuideApproval?.();
    setApprovingGuide(false);
    setGuidePresentationDone(true);
    const score = startQuizScore + (approved ? 1 : 0);
    setStartQuizScore(score);
    if (startQuizStep === 0) setStartQuizStep(1);
    else finishStart(score);
  };

  const handleToggleDeposit = (artId: string) => {
    if (selectedArtifactToDeposit.includes(artId)) {
      setSelectedArtifactToDeposit(selectedArtifactToDeposit.filter(id => id !== artId));
    } else {
      if (selectedArtifactToDeposit.length < 2) {
        setSelectedArtifactToDeposit([...selectedArtifactToDeposit, artId]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 brown-gradient-bg text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
              {isStart ? 'TRẠM KHỞI HÀNH & KHO THẤT LẠC' : 'TRẠM DỪNG CHÂN'}
            </span>
            <h2 className="font-serif-lacviet text-lg sm:text-xl font-bold flex items-center gap-2">
              {isStart ? <Flag size={20} className="text-[#C5A059]" /> : <span>🏛️</span>}
              <span>{station.name}</span>
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#C5A059] text-[#1E2538]">
            Ô #{station.index}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-xs text-gray-700 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30 leading-relaxed">
            {station.description}
          </p>

          {/* Auto unseal notification if any sealed artifact was released */}
          {sealedArtifactsCount > 0 && !isStart && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
              <Unlock size={16} className="text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Đã giải phóng!</strong> {sealedArtifactsCount} kỷ vật phong ấn đã mở khóa!
              </span>
            </div>
          )}

          {/* START Tile Special Flow */}
          {isStart ? (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-700" /> Trạm Khởi Hành (Câu {startQuizStep + 1}/2)
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Đúng: {startQuizScore}/2
                  </span>
                </div>

                <div className="font-semibold text-gray-900">
                  {startQuestions[startQuizStep].q}
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
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

                {/* Substitute with "Hướng dẫn viên" */}
                {!guidePresentationDone && (
                  <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-[11px] text-gray-600">Thuyết trình 30s:</span>
                    <button
                      disabled={approvingGuide}
                      onClick={handleGuideSubstitute}
                      className="px-2.5 py-1 bg-[#543310] hover:bg-[#6F441E] text-[#F5E5BE] font-bold rounded-lg text-[11px] flex items-center gap-1 shadow"
                    >
                      <Mic size={12} /> Hướng dẫn viên (+1 câu đúng)
                    </button>
                  </div>
                )}
              </div>

              {/* Kho thất lạc status at START */}
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-950">
                    📦 Kho Thất Lạc: {lostAndFoundList.length || penalizedArtifactsAtStart} Kỷ vật
                  </span>
                  <div className="text-[11px] text-emerald-700">
                    Đúng 2/2 câu hỏi để thu hồi 01 kỷ vật đưa về Tay nải!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 3 Corner Stations: Bac Bo, Trung Bo, Nam Bo */
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-gray-800 mb-1">
                Chọn 1 trong 4 đặc quyền tại Trạm Dừng Chân:
              </div>

              {/* Option 1: Fortune Card */}
              <button
                onClick={() => onSelectOption('fortune')}
                className="w-full p-2.5 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/60 hover:bg-amber-100/70 text-left transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-amber-950">
                      1. Nhận 01 Thẻ May Mắn
                    </div>
                    <div className="text-[10px] text-amber-800/80">
                      Áp dụng ngay hiệu lực thời vận tốt lành
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-amber-700" />
              </button>

              {/* Option 2: Resource Card */}
              <button
                onClick={() => onSelectOption('resource')}
                className="w-full p-2.5 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <ShoppingBag size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950">
                      2. Nhận 01 Thẻ Tài Nguyên
                    </div>
                    <div className="text-[10px] text-emerald-800/80">
                      Bốc lá chắn, ngựa trạm, nỏ thần hoặc cột mốc
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-emerald-700" />
              </button>

              {/* Option 3: Restore Token Skill */}
              <button
                onClick={() => onSelectOption('restore_skill')}
                className="w-full p-2.5 rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <RotateCcw size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-blue-950">
                      3. Hồi Phục Kỹ Năng Token [{tokenDef.name}]
                    </div>
                    <div className="text-[10px] text-blue-800/80">
                      Khôi phục trạng thái sẵn sàng sử dụng nội tại
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-blue-700" />
              </button>

              {/* Option 4: Ký gửi tối đa 2 kỷ vật */}
              <div className="p-2.5 rounded-xl border border-[#C5A059] bg-[#FAF6EE] text-left space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#543310]" />
                    <span className="font-bold text-xs text-[#543310]">
                      4. Ký Gửi Kỷ Vật (Tối đa 02)
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {selectedArtifactToDeposit.length}/2
                  </span>
                </div>

                <p className="text-[10px] text-gray-600">
                  Chuyển vào Hòm ký gửi (bảo vệ tuyệt đối).
                </p>

                {pouchArtifacts.length > 0 ? (
                  <div className="space-y-1 pt-1">
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {pouchArtifacts.map(art => (
                        <button
                          key={art.id}
                          onClick={() => handleToggleDeposit(art.id)}
                          className={`px-2 py-1 rounded text-[10px] border transition-all ${
                            selectedArtifactToDeposit.includes(art.id)
                              ? 'bg-[#543310] text-white font-bold border-[#543310]'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {art.name} ({art.province})
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={selectedArtifactToDeposit.length === 0}
                      onClick={() => onSelectOption('safe_deposit', selectedArtifactToDeposit)}
                      className="w-full mt-1.5 py-1.5 bg-[#543310] hover:bg-[#6F441E] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow"
                    >
                      Ký gửi ({selectedArtifactToDeposit.length})
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] italic text-gray-400">
                    Tay nải chưa có kỷ vật để ký gửi.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            disabled={isStart && !finished.current}
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
