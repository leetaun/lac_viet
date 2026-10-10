import React, { useState, useEffect } from 'react';
import { GameCard, KnowledgeCard, ChallengeCard, ResourceCard, FortuneCard, Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { generateQRCode } from '../../utils/qrcode';
import { Sparkles, Trophy, AlertTriangle, ShieldCheck, QrCode, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface CardDrawModalProps {
  card: GameCard;
  player: Player;
  onResolve: (result: {
    success: boolean;
    rewardArtifact?: boolean;
    penalizeArtifact?: boolean;
    drawCard?: GameCard;
    extraRoll?: boolean;
    moveDelta?: number;
    logMessage: string;
  }) => void;
  language: 'vi' | 'en';
}

export const CardDrawModal: React.FC<CardDrawModalProps> = ({
  card,
  player,
  onResolve,
  language
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [actionDone, setActionDone] = useState<boolean>(false);

  // Check if player holds a knowledge card that matches this challenge keyword
  const matchingKnowledgeCard = card.type === 'challenge'
    ? player.cards.knowledge.find(k => 
        k.title.toLowerCase().includes(card.relatedKnowledgeKeyword.toLowerCase()) ||
        k.province.toLowerCase().includes(card.province.toLowerCase())
      )
    : undefined;

  useEffect(() => {
    soundManager.playCardDraw();
    
    // Generate QR code if card has URL or text
    const qrText = (card as KnowledgeCard).qrContent || `https://lacviet.edu.vn/card/${card.id}`;
    generateQRCode(qrText).then(url => setQrDataUrl(url));

    // Timer for action challenges
    if (card.type === 'challenge' && card.challengeType === 'action') {
      const initialTime = card.timeLimitSeconds || 25;
      setTimer(initialTime);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [card]);

  // Handle Quiz answer click
  const handleAnswer = (index: number) => {
    if (answered || card.type !== 'challenge') return;
    const challenge = card as ChallengeCard;
    setSelectedOption(index);
    setAnswered(true);

    const correct = challenge.correctAnswer === index;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
    } else {
      soundManager.playPenalty();
    }
  };

  // Skip question using held Knowledge Card
  const handleUseKnowledgeCardBypass = () => {
    if (!matchingKnowledgeCard) return;
    soundManager.playSuccess();
    onResolve({
      success: true,
      rewardArtifact: true,
      logMessage: `${player.name} đã dùng Thẻ Kiến Thức [${matchingKnowledgeCard.title}] để vượt qua câu hỏi và nhận 1 Kỷ vật văn hóa!`
    });
  };

  // Complete Resolution
  const handleComplete = (customSuccess?: boolean) => {
    if (card.type === 'knowledge') {
      onResolve({
        success: true,
        drawCard: card,
        logMessage: `${player.name} nhận được Thẻ Kiến Thức: ${card.title} (${card.province})`
      });
    } else if (card.type === 'resource') {
      onResolve({
        success: true,
        drawCard: card,
        logMessage: `${player.name} nhận được Thẻ Tài Nguyên: ${card.name}`
      });
    } else if (card.type === 'fortune') {
      const fortune = card as FortuneCard;
      onResolve({
        success: true,
        drawCard: card,
        extraRoll: fortune.extraTurn,
        moveDelta: fortune.moveDelta,
        logMessage: `${player.name} bốc Thẻ May Mắn: [${fortune.name}] - ${fortune.effectText}`
      });
    } else if (card.type === 'challenge') {
      const success = customSuccess !== undefined ? customSuccess : isCorrect;
      if (success) {
        onResolve({
          success: true,
          rewardArtifact: true,
          logMessage: `${player.name} hoàn thành xuất sắc thử thách ${card.province} và nhận được Kỷ vật: [${card.rewardArtifact}]!`
        });
      } else {
        // Penalty check
        const immuneByNonLa = player.token === 'non_la' && player.tokenSkillAvailable;
        onResolve({
          success: false,
          penalizeArtifact: !immuneByNonLa,
          logMessage: immuneByNonLa
            ? `${player.name} thất bại thử thách nhưng nhờ nội tại NÓN LÁ đã miễn nhiễm mất kỷ vật!`
            : `${player.name} thất bại thử thách, bị phạt mất 1 Kỷ vật gửi về ô START!`
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] flex flex-col max-h-[90vh] animate-modal-pop">
        
        {/* Modal Header */}
        <div className={`p-4 text-white flex items-center justify-between ${
          card.type === 'knowledge' ? 'bg-gradient-to-r from-blue-700 to-blue-900' :
          card.type === 'festival' || card.type === 'fortune' ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
          card.type === 'market' || card.type === 'resource' ? 'bg-gradient-to-r from-emerald-700 to-emerald-900' :
          'bg-gradient-to-r from-red-700 to-red-900'
        }`}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F5E5BE]">
              {card.type === 'knowledge' ? 'Thẻ Kiến Thức' :
               card.type === 'fortune' ? 'Thẻ May Mắn (Lễ Hội)' :
               card.type === 'resource' ? 'Thẻ Tài Nguyên (Thị Trường)' :
               'Thẻ Thử Thách Địa Phương'}
            </div>
            <h2 className="font-serif-lacviet text-lg sm:text-xl font-bold">
              {'title' in card ? card.title : card.name}
            </h2>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
            title="Quét hoặc xem QR"
          >
            <QrCode size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* QR Code view toggle */}
          {showQR && qrDataUrl && (
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border-2 border-[#C5A059] text-center flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-[#7E121D]">MÃ QR KẾT NỐI SỐ HÓA</span>
              <img src={qrDataUrl} alt="QR Code" className="w-36 h-36 rounded-lg shadow-sm border border-gray-200" />
              <span className="text-[11px] text-gray-500">
                Quét mã này bằng điện thoại để xem dữ liệu văn hóa mở rộng!
              </span>
            </div>
          )}

          {/* 1. THẺ KIẾN THỨC BODY */}
          {card.type === 'knowledge' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
                <div className="text-xs font-bold text-blue-900 mb-1">
                  🏛️ {card.heritageName}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="bg-[#FAF6EE] border border-[#C5A059]/40 p-3 rounded-xl text-xs text-gray-700">
                <span className="font-bold text-[#7E121D]">Ý nghĩa văn hóa: </span>
                {card.culturalSignificance}
              </div>

              <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>
                  Thẻ này sẽ được lưu vào Túi của bạn. Khi gặp câu hỏi liên quan đến {card.province}, bạn có thể dùng thẻ này để vượt qua ngay lập tức!
                </span>
              </div>
            </div>
          )}

          {/* 2. THẺ TÀI NGUYÊN BODY */}
          {card.type === 'resource' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <div className="text-xs font-bold text-emerald-900 mb-1">
                  📦 Phân loại: {card.category.toUpperCase()}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
                  {card.description}
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-bold">
                  ✨ Hiệu ứng: {card.effect}
                </div>
              </div>

              <div className="text-[11px] text-gray-500">
                Thẻ Tài Nguyên được dùng để chiếm đất, cướp kỷ vật khi đỗ cùng ô với đối thủ hoặc bảo vệ kỷ vật của bạn.
              </div>
            </div>
          )}

          {/* 3. THẺ MAY MẮN BODY */}
          {card.type === 'fortune' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div className="text-xs font-bold text-amber-900 mb-1">
                  🌾 Thời vận & Biến cố
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                  {card.description}
                </p>
                <div className="bg-amber-100 text-amber-950 p-3 rounded-xl font-bold text-xs sm:text-sm border border-amber-300 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-700 flex-shrink-0" />
                  <span>{card.effectText}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. THẺ THỬ THÁCH BODY */}
          {card.type === 'challenge' && (
            <div className="space-y-3">
              {/* Bypass button with held Knowledge Card */}
              {matchingKnowledgeCard && !answered && (
                <div className="bg-gradient-to-r from-blue-50 to-amber-50 border-2 border-blue-400 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-sm">
                  <div className="text-xs text-blue-900">
                    <span className="font-bold">✨ Quyền năng Thẻ Kiến Thức!</span>
                    <div className="text-[11px] text-blue-700">
                      Bạn đang giữ thẻ: <strong>{matchingKnowledgeCard.title}</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleUseKnowledgeCardBypass}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex-shrink-0"
                  >
                    Bỏ qua & Nhận Kỷ vật
                  </button>
                </div>
              )}

              {/* Quiz question or Action challenge */}
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#C5A059]/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#7E121D]">
                    {card.challengeType === 'quiz' ? 'CÂU HỎI TRẮC NGHIỆM' : 'THỬ THÁCH HÀNH ĐỘNG'}
                  </span>
                  {card.challengeType === 'action' && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      timer <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-100 text-amber-900'
                    }`}>
                      ⏳ {timer}s
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-gray-900 leading-snug">
                  {card.question}
                </div>

                {card.actionPrompt && (
                  <div className="mt-2 text-xs italic text-[#7E121D] font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                    👉 {card.actionPrompt}
                  </div>
                )}
              </div>

              {/* Quiz Options */}
              {card.challengeType === 'quiz' && card.options && (
                <div className="space-y-2">
                  {card.options.map((option, idx) => {
                    let optionStyle = 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800';
                    if (answered) {
                      if (idx === card.correctAnswer) {
                        optionStyle = 'bg-green-100 border-green-500 text-green-900 font-bold';
                      } else if (idx === selectedOption) {
                        optionStyle = 'bg-red-100 border-red-500 text-red-900 line-through';
                      } else {
                        optionStyle = 'bg-gray-50 text-gray-400 border-gray-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={answered}
                        onClick={() => handleAnswer(idx)}
                        style={{ animationDelay: `${120 + idx * 50}ms` }}
                        className={`animate-stagger-item w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-2 shadow-sm ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {answered && idx === card.correctAnswer && (
                          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        )}
                        {answered && idx === selectedOption && idx !== card.correctAnswer && (
                          <XCircle size={16} className="text-red-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Challenge Result Toggle */}
              {card.challengeType === 'action' && !answered && (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActionDone(true);
                      setAnswered(true);
                      setIsCorrect(true);
                      soundManager.playSuccess();
                    }}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    <span>Hoàn thành tốt! (Nhận Kỷ vật)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActionDone(false);
                      setAnswered(true);
                      setIsCorrect(false);
                      soundManager.playPenalty();
                    }}
                    className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold text-xs transition-all"
                  >
                    Bỏ cuộc / Thất bại
                  </button>
                </div>
              )}

              {/* Explanation & Result feedback */}
              {answered && (
                <div className={`p-3.5 rounded-2xl border text-xs animate-fade-in ${
                  isCorrect ? 'bg-green-50 border-green-300 text-green-900' : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-sm">
                    {isCorrect ? (
                      <>
                        <Trophy size={16} className="text-amber-600" />
                        <span>CHÍNH XÁC! Nhận 1 Kỷ vật: [{card.rewardArtifact}]</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} className="text-red-600" />
                        <span>
                          {player.token === 'non_la' && player.tokenSkillAvailable
                            ? 'SAI RỒI! Nhưng được Nón Lá bảo vệ miễn phạt!'
                            : 'SAI RỒI! Bị phạt mất 1 Kỷ vật về ô START!'}
                        </span>
                      </>
                    )}
                  </div>
                  {card.explanation && (
                    <p className="text-gray-700 leading-relaxed mt-1">
                      {card.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
          {card.type !== 'challenge' ? (
            <button
              onClick={() => handleComplete()}
              className="px-5 py-2.5 crimson-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2"
            >
              <span>{card.type === 'knowledge' ? 'Giữ vào tay thẻ' : 'Xác nhận hiệu ứng'}</span>
              <ArrowRight size={15} />
            </button>
          ) : answered ? (
            <button
              onClick={() => handleComplete()}
              className="px-5 py-2.5 crimson-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2"
            >
              <span>Tiếp tục hành trình</span>
              <ArrowRight size={15} />
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
};

