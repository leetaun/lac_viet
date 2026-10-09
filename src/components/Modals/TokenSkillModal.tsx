import React, { useState } from 'react';
import { Player, GameCard } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { CHALLENGE_CARDS } from '../../data/cardDecks';
import { soundManager } from '../../utils/sound';
import { Sparkles, ArrowLeft, ArrowRight, Eye, RefreshCw, X } from 'lucide-react';

interface TokenSkillModalProps {
  player: Player;
  onActivateLotusSwap: (discardIds: string[], targetDeck: 'knowledge' | 'resource' | 'fortune') => void;
  onActivateBanhMiShift: (delta: -1 | 1) => void;
  onClose: () => void;
  language: 'vi' | 'en';
}

export const TokenSkillModal: React.FC<TokenSkillModalProps> = ({
  player,
  onActivateLotusSwap,
  onActivateBanhMiShift,
  onClose,
  language
}) => {
  const tokenDef = TOKENS[player.token];
  const [selectedCardsToDiscard, setSelectedCardsToDiscard] = useState<string[]>([]);
  const [targetDeck, setTargetDeck] = useState<'knowledge' | 'resource' | 'fortune'>('fortune');
  const [previewCard, setPreviewCard] = useState<typeof CHALLENGE_CARDS[0] | null>(null);

  // All cards on hand
  const allHandCards: { id: string; name: string; type: string }[] = [
    ...player.cards.knowledge.map(c => ({ id: c.id, name: `[Kiến thức] ${c.title}`, type: 'knowledge' })),
    ...player.cards.resource.map(c => ({ id: c.id, name: `[Tài nguyên] ${c.name}`, type: 'resource' })),
    ...player.cards.fortune.map(c => ({ id: c.id, name: `[May mắn] ${c.name}`, type: 'fortune' }))
  ];

  const handleToggleCardDiscard = (id: string) => {
    if (selectedCardsToDiscard.includes(id)) {
      setSelectedCardsToDiscard(selectedCardsToDiscard.filter(x => x !== id));
    } else {
      if (selectedCardsToDiscard.length < 2) {
        setSelectedCardsToDiscard([...selectedCardsToDiscard, id]);
      }
    }
  };

  const handlePreviewLantern = () => {
    soundManager.playTokenSkill();
    const randomCard = CHALLENGE_CARDS[Math.floor(Math.random() * CHALLENGE_CARDS.length)];
    setPreviewCard(randomCard);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#941B26] via-[#7E121D] to-[#5C0D15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tokenDef.icon}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
                KÍCH HOẠT NỘI TẠI TOKEN
              </span>
              <h2 className="font-serif-lacviet text-lg font-bold">
                {tokenDef.name}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-gray-700 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30 leading-relaxed">
            {tokenDef.description}
          </p>

          {/* 1. NÓN LÁ */}
          {player.token === 'non_la' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles size={14} className="text-blue-600" />
                <span>Nội tại Tự Động Miễn Nhiễm</span>
              </div>
              <p className="text-gray-600">
                Khi bạn trả lời sai một câu hỏi Thử Thách, Nón Lá sẽ tự động bảo vệ kỷ vật của bạn không bị mất về ô START (1 lần/vòng).
              </p>
            </div>
          )}

          {/* 2. HOA SEN: Đổi 2 thẻ lấy 1 thẻ */}
          {player.token === 'hoa_sen' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-800">
                Chọn 2 thẻ trên tay để đổi (Đã chọn {selectedCardsToDiscard.length}/2):
              </div>
              
              {allHandCards.length < 2 ? (
                <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                  Bạn cần có ít nhất 2 lá bài trên tay để kích hoạt kỹ năng của Hoa Sen.
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1 border rounded-xl p-2 bg-gray-50 text-xs">
                  {allHandCards.map(c => {
                    const isSelected = selectedCardsToDiscard.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleCardDiscard(c.id)}
                        className={`p-2 rounded-lg cursor-pointer border transition-all flex items-center justify-between ${
                          isSelected ? 'bg-pink-100 border-pink-400 font-bold text-pink-900' : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isSelected && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-gray-700">Bộ thẻ muốn bốc:</span>
                <select
                  value={targetDeck}
                  onChange={(e) => setTargetDeck(e.target.value as any)}
                  className="p-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                >
                  <option value="fortune">Thẻ May Mắn</option>
                  <option value="resource">Thẻ Tài Nguyên</option>
                  <option value="knowledge">Thẻ Kiến Thức</option>
                </select>
              </div>

              <button
                disabled={selectedCardsToDiscard.length !== 2}
                onClick={() => {
                  soundManager.playTokenSkill();
                  onActivateLotusSwap(selectedCardsToDiscard, targetDeck);
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 ${
                  selectedCardsToDiscard.length === 2
                    ? 'crimson-gradient-bg text-[#F5E5BE] border border-[#C5A059]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw size={14} />
                <span>Hoán Đổi 2 Thẻ Lấy 1 Thẻ Mới</span>
              </button>
            </div>
          )}

          {/* 3. ĐÈN LỒNG: Soi trước 1 thẻ thử thách */}
          {player.token === 'den_long' && (
            <div className="space-y-3">
              {!previewCard ? (
                <button
                  onClick={handlePreviewLantern}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  <span>Soi Trước 1 Thẻ Thử Thách Tiếp Theo</span>
                </button>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <span>🏮 Đèn Lồng Soi Sáng:</span>
                    <span className="text-[#7E121D]">{previewCard.title} ({previewCard.province})</span>
                  </div>
                  <div className="text-gray-800 font-medium">
                    {previewCard.question}
                  </div>
                  <div className="text-[11px] text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                    💡 Gợi ý: Hãy giữ Thẻ Kiến Thức liên quan đến "{previewCard.relatedKnowledgeKeyword}" để được bỏ qua thử thách này!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. BÁNH MÌ: Tiến hoặc lùi 1 ô */}
          {player.token === 'banh_mi' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-800 text-center">
                Chọn hướng điều chỉnh vị trí ngay lúc này:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playTokenSkill();
                    onActivateBanhMiShift(-1);
                  }}
                  className="p-3 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded-xl text-xs font-bold text-orange-950 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Lùi lại 1 ô (-1)</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playTokenSkill();
                    onActivateBanhMiShift(1);
                  }}
                  className="p-3 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded-xl text-xs font-bold text-orange-950 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Tiến thêm 1 ô (+1)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
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

