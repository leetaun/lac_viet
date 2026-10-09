import React, { useState } from 'react';
import { Player, GameCard, ResourceCard, FortuneCard, KnowledgeCard } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { Trophy, Award, Layers, Shield, Swords, Sparkles, QrCode, BookOpen, ChevronRight, X } from 'lucide-react';
import { generateQRCode } from '../../utils/qrcode';

interface InventoryTabProps {
  player: Player;
  allPlayers: Player[];
  artifactGoal: number;
  onUseCard: (card: GameCard, targetPlayer?: Player) => void;
  language: 'vi' | 'en';
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  player,
  allPlayers,
  artifactGoal,
  onUseCard,
  language
}) => {
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const opponents = allPlayers.filter(p => p.id !== player.id);
  const totalArtifacts = player.artifacts + player.safeArtifacts;

  const handleCardClick = async (card: GameCard) => {
    setSelectedCard(card);
    const url = 'qrContent' in card 
      ? card.qrContent 
      : `https://lacviet.edu.vn/card/${card.id}`;
    const qr = await generateQRCode(url);
    setQrCodeUrl(qr);
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* 1. Header Assets Stats Card (Matching Slide 8) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/40 shadow-card">
        <div className="grid grid-cols-2 gap-3 text-center divide-x divide-gray-100">
          <div>
            <div className="text-xs text-gray-500 font-medium mb-0.5">
              Kỷ vật đang giữ
            </div>
            <div className="font-serif-lacviet text-2xl sm:text-3xl font-bold text-[#7E121D] flex items-center justify-center gap-1.5">
              <Trophy size={20} className="text-[#C5A059]" />
              <span>{totalArtifacts}/{artifactGoal}</span>
            </div>
            {player.safeArtifacts > 0 && (
              <div className="text-[10px] text-green-600 font-medium mt-0.5">
                ({player.safeArtifacts} đã gửi an toàn tại trạm góc)
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-gray-500 font-medium mb-0.5">
              Điểm thành tích
            </div>
            <div className="font-serif-lacviet text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-1.5">
              <Award size={20} className="text-[#C5A059]" />
              <span>{player.score}</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium mt-0.5">
              Văn hóa & Di sản
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed bg-[#FAF6EE] p-2.5 rounded-xl border border-[#C5A059]/20">
          💡 <em>Điểm thành tích dùng cho kết quả ván và bảng xếp hạng; chỉ Kỷ vật mới quyết định thắng thua. Đủ {artifactGoal} Kỷ vật và chạm hoặc đi qua START là hoàn thành ván!</em>
        </div>
      </div>

      {/* 2. TAY THẺ (Hand Cards) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-lacviet font-bold text-base text-[#7E121D] flex items-center gap-1.5">
            <Layers size={16} className="text-[#C5A059]" />
            <span>TAY THẺ BÀI SỞ HỮU</span>
          </h3>
          <span className="text-xs font-bold bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-700">
            {player.cards.knowledge.length + player.cards.resource.length + player.cards.fortune.length} thẻ
          </span>
        </div>

        {/* Empty state */}
        {player.cards.knowledge.length === 0 &&
         player.cards.resource.length === 0 &&
         player.cards.fortune.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Chưa có thẻ nào trên tay. Hãy dừng ở ô Lễ hội hoặc Thị trường để rút thẻ!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Knowledge Cards */}
            {player.cards.knowledge.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow"
              >
                <div className="flex items-center justify-between text-[10px] text-blue-700 font-bold mb-1">
                  <span>THẺ KIẾN THỨC</span>
                  <span>{card.province}</span>
                </div>
                <div className="font-bold text-xs text-blue-950 truncate mb-1">
                  {card.title}
                </div>
                <div className="text-[11px] text-gray-600 line-clamp-2">
                  {card.description}
                </div>
              </div>
            ))}

            {/* Resource Cards */}
            {player.cards.resource.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow"
              >
                <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold mb-1">
                  <span>THẺ TÀI NGUYÊN</span>
                  <span>{card.category.toUpperCase()}</span>
                </div>
                <div className="font-bold text-xs text-emerald-950 truncate mb-1">
                  {card.name}
                </div>
                <div className="text-[11px] text-gray-600 line-clamp-2">
                  {card.description}
                </div>
              </div>
            ))}

            {/* Fortune Cards */}
            {player.cards.fortune.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow"
              >
                <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold mb-1">
                  <span>THẺ MAY MẮN</span>
                  <span>{card.eventType.toUpperCase()}</span>
                </div>
                <div className="font-bold text-xs text-amber-950 truncate mb-1">
                  {card.name}
                </div>
                <div className="text-[11px] text-gray-600 line-clamp-2">
                  {card.effectText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. CÔNG KÍCH ĐỐI THỦ (Matching Slide 8) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/30 shadow-sm space-y-3">
        <div>
          <h3 className="font-serif-lacviet font-bold text-base text-[#7E121D] flex items-center gap-1.5">
            <Swords size={16} className="text-[#C5A059]" />
            <span>CÔNG KÍCH & TƯƠNG TÁC ĐỐI THỦ</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Chỉ được chiếm hoặc vô hiệu hóa kỷ vật khi dùng Thẻ Tài nguyên / May mắn có hiệu ứng đó, hoặc khi đứng cùng ô đối phương.
          </p>
        </div>

        <div className="space-y-2">
          {opponents.map(opp => {
            const oppToken = TOKENS[opp.token];
            const isSameSpace = opp.position === player.position;

            return (
              <div
                key={opp.id}
                className="p-3 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: opp.color }}
                  />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1">
                      <span>{opp.name} (P{opp.seat})</span>
                      <span>{oppToken.icon}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Kỷ vật: <strong>{opp.artifacts}</strong> (an toàn {opp.safeArtifacts}) · Thẻ: <strong>{opp.cards.knowledge.length + opp.cards.resource.length + opp.cards.fortune.length}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  {isSameSpace ? (
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded-lg border border-red-300">
                      Đang cùng ô!
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-500 font-medium rounded-lg">
                      Cần thẻ hiệu ứng
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Card Modal / QR Code Drawer */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-4 border-[#C5A059] relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-[#7E121D] mb-1">
              CHI TIẾT THẺ BÀI
            </div>

            <h3 className="font-serif-lacviet text-lg font-bold text-gray-900 mb-2">
              {'title' in selectedCard ? selectedCard.title : selectedCard.name}
            </h3>

            <p className="text-xs text-gray-700 leading-relaxed bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/20 mb-3">
              {'description' in selectedCard ? selectedCard.description : ''}
            </p>

            {/* QR Code view */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
                <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28 rounded-lg" />
                <span className="text-[10px] text-gray-500">Mã QR tra cứu di sản số</span>
              </div>
            )}

            <button
              onClick={() => setSelectedCard(null)}
              className="w-full py-2 bg-[#7E121D] text-white font-bold rounded-xl text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

