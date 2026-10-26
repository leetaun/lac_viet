import React, { useState } from 'react';
import { Player, GameCard } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { CHALLENGE_CARDS, KNOWLEDGE_CARDS } from '../../data/cardDecks';
import { soundManager } from '../../utils/sound';
import { Sparkles, ArrowLeft, ArrowRight, Eye, RefreshCw, X, Check } from 'lucide-react';

interface TokenSkillModalProps {
  player: Player;
  onActivateLotusSwap: (discardIds: string[], targetDeck: 'knowledge' | 'resource' | 'fortune') => void;
  onActivateBanhMiShift: (delta: -1 | 1) => void;
  previewQuestion?: GameCard | null;
  onPreviewLantern?: () => Promise<GameCard | null>;
  initialPreview?: GameCard | null;
  onActivateLanternRedraw?: () => void;
  onClose: () => void;
  language: 'vi' | 'en';
}

export const TokenSkillModal: React.FC<TokenSkillModalProps> = ({
  player,
  onActivateLotusSwap,
  onActivateBanhMiShift,
  onActivateLanternRedraw,
  previewQuestion,
  onPreviewLantern,
  initialPreview,
  onClose,
  language
}) => {
  const tokenDef = TOKENS[player.token];
  const [selectedCardsToDiscard, setSelectedCardsToDiscard] = useState<string[]>([]);
  const [targetDeck, setTargetDeck] = useState<'knowledge' | 'resource' | 'fortune'>('fortune');
  const [previewCard, setPreviewCard] = useState<any>(initialPreview||null);
  React.useEffect(()=>{if(initialPreview)setPreviewCard(initialPreview);},[initialPreview]);

  // All cards in player's pouch/hand
  const allHandCards: { id: string; name: string; type: string }[] = [
    ...player.biKipCards.map(c => ({ id: c.id, name: `[Bí kíp] ${c.title}`, type: 'bikip' })),
    ...player.cards.resource.map(c => ({ id: c.id, name: `[Tài nguyên] ${c.name}`, type: 'resource' })),
    ...player.cards.fortune.map(c => ({ id: c.id, name: `[May mắn] ${c.name}`, type: 'fortune' })),
    ...player.cards.knowledge.map(c => ({ id: c.id, name: `[Kiến thức] ${c.title}`, type: 'knowledge' }))
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

  const handlePreviewLantern = async () => {
    soundManager.playTokenSkill();
    const randomCard = onPreviewLantern ? await onPreviewLantern() : previewQuestion;
    setPreviewCard(randomCard);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#941B26] via-[#7E121D] to-[#5C0D15] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tokenDef.icon}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
                KỸ NĂNG TOKEN
              </span>
              <h2 className="font-serif-lacviet text-lg font-bold">
                {tokenDef.name} · {tokenDef.passive}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="text-xs text-gray-700 bg-[#FAF6EE] p-3 rounded-2xl border border-[#C5A059]/30 leading-relaxed">
            <span className="font-bold text-[#7E121D] block mb-0.5">Hiệu lực kỹ năng:</span>
            {tokenDef.description}
            <div className="text-[11px] text-gray-500 mt-1">
              Thời điểm kích hoạt: <strong>{tokenDef.timing}</strong>
            </div>
          </div>

          {/* 1. NÓN LÁ: Che mưa */}
          {player.token === 'non_la' && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles size={15} className="text-blue-600" />
                <span>Kỹ năng: Che Mưa (Tự động kích hoạt)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Khi bạn thua Thử thách hoặc chịu tác động từ thẻ Sự kiện xấu (như Bão lũ), hệ thống sẽ hỏi bạn có dùng kỹ năng miễn phạt 01 lần và bảo vệ an toàn kỷ vật của bạn.
              </p>
              <div className="text-[11px] font-bold text-blue-800">
                Trạng thái: {player.tokenSkillAvailable ? '✅ Sẵn sàng sử dụng' : '⏳ Đã sử dụng (Hồi phục ở START/Góc)'}
              </div>
            </div>
          )}

          {/* 2. HOA SEN: Thanh lọc (Đổi 2 thẻ lấy 1) */}
          {player.token === 'hoa_sen' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
                <span>Chọn 2 thẻ trong túi đồ để đổi ({selectedCardsToDiscard.length}/2):</span>
              </div>
              
              {allHandCards.length < 2 ? (
                <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                  ⚠️ Bạn cần tối thiểu 2 thẻ bài trong túi đồ để kích hoạt kỹ năng Thanh lọc.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {allHandCards.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleToggleCardDiscard(c.id)}
                      className={`w-full p-2 rounded-xl text-xs text-left border flex items-center justify-between transition-all ${
                        selectedCardsToDiscard.includes(c.id)
                          ? 'bg-[#7E121D] text-white font-bold border-[#7E121D]'
                          : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {selectedCardsToDiscard.includes(c.id) && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Target Deck selector */}
              <div className="pt-2 border-t border-gray-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Chọn loại thẻ muốn nhận:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setTargetDeck('resource')}
                    className={`py-2 rounded-xl border font-bold ${
                      targetDeck === 'resource'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Thẻ Tài Nguyên
                  </button>
                  <button
                    onClick={() => setTargetDeck('fortune')}
                    className={`py-2 rounded-xl border font-bold ${
                      targetDeck === 'fortune'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    Thẻ May Mắn
                  </button>
                </div>
              </div>

              <button
                disabled={selectedCardsToDiscard.length !== 2 || !player.tokenSkillAvailable}
                onClick={() => onActivateLotusSwap(selectedCardsToDiscard, targetDeck)}
                className="w-full py-2.5 bg-[#7E121D] hover:bg-[#941B26] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Kích Hoạt Thanh Lọc (Đổi Thẻ)
              </button>
            </div>
          )}

          {/* 3. ĐÈN LỒNG: Soi đường */}
          {player.token === 'den_long' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-900">
                  <Eye size={14} className="text-amber-700" /> Kỹ năng: Soi Đường
                </span>
                <p className="text-gray-600">
                  Xem trước đề bài Kiến thức hoặc Thử thách khi vừa chạm ô, đồng thời được quyền đổi đề 01 lần nếu câu hỏi quá khó.
                </p>
              </div>

              {!previewCard ? (
                <button
                  disabled={!player.tokenSkillAvailable}
                  onClick={handlePreviewLantern}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
                >
                  <Eye size={15} />
                  <span>Xem Trước Đề Bài Sắp Tới</span>
                </button>
              ) : (
                <div className="p-3 bg-white border border-amber-300 rounded-2xl text-xs space-y-2">
                  <div className="font-bold text-[#7E121D]">
                    [Xem trước]: {previewCard.title} ({previewCard.province})
                  </div>
                  <div className="text-gray-700 italic">
                    "{previewCard.question}"
                  </div>
                  {onActivateLanternRedraw && (
                    <button
                      onClick={onActivateLanternRedraw}
                      className="w-full py-2 bg-[#7E121D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <RefreshCw size={14} /> Đổi sang đề mới
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. BÁNH MÌ: Tiện đường */}
          {player.token === 'banh_mi' && (
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 space-y-1">
                <span className="font-bold text-orange-900">
                  Kỹ năng: Tiện Đường (+1 hoặc -1 ô sau khi gieo xúc xắc)
                </span>
                <p className="text-gray-600">
                  Cho phép bạn tiến hoặc lùi 1 ô để né ô có Cột mốc đối thủ, hoặc tiến thẳng vào Trạm góc/Thử thách mong muốn.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={!player.tokenSkillAvailable}
                  onClick={() => onActivateBanhMiShift(-1)}
                  className="py-2.5 px-3 bg-gray-100 hover:bg-orange-100 disabled:opacity-50 text-gray-800 rounded-xl text-xs font-bold border border-gray-300 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowLeft size={15} />
                  <span>Lùi Lại 1 Ô (-1)</span>
                </button>
                <button
                  disabled={!player.tokenSkillAvailable}
                  onClick={() => onActivateBanhMiShift(1)}
                  className="py-2.5 px-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold border border-orange-600 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Tiến Lên 1 Ô (+1)</span>
                  <ArrowRight size={15} />
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
