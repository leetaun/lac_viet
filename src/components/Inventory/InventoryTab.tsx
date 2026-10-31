import React, { useState } from 'react';
import { Player, GameCard, ResourceCard, FortuneCard, KnowledgeCard, ArtifactItem, BiKipCard } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { 
  Trophy, Award, Layers, Shield, Swords, Sparkles, QrCode, BookOpen, 
  ChevronRight, X, Lock, Unlock, Flag, CheckCircle2, AlertTriangle, Info 
} from 'lucide-react';
import { generateQRCode } from '../../utils/qrcode';

interface InventoryTabProps {
  player: Player;
  allPlayers: Player[];
  artifactGoal: number;
  gameModeRule?: 'toc_chien' | 'co_ban' | 'truong_ky';
  onUseCard: (card: GameCard, targetPlayer?: Player) => void;
  language: 'vi' | 'en';
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  player,
  allPlayers,
  artifactGoal,
  gameModeRule = 'toc_chien',
  onUseCard,
  language
}) => {
  const [cardFilter, setCardFilter] = useState<'all' | 'resource' | 'fortune' | 'knowledge' | 'bikip'>('all');
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [selectedBiKip, setSelectedBiKip] = useState<BiKipCard | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const opponents = allPlayers.filter(p => p.id !== player.id);
  
  // Artifact calculations
  const pouchUnsealed = player.artifactItems.filter(a => a.storage === 'pouch' && !a.isSealed);
  const pouchSealed = player.artifactItems.filter(a => a.storage === 'pouch' && a.isSealed);
  const safeDeposit = player.artifactItems.filter(a => a.storage === 'safe');
  
  // Valid Artifacts for Victory = Pouch Unsealed + Safe Deposit
  const validArtifactCount = pouchUnsealed.length + safeDeposit.length;

  // Regional breakdown
  const validArtifacts = [...pouchUnsealed, ...safeDeposit];
  const countBac = validArtifacts.filter(a => a.region === 'bac_bo').length;
  const countTrung = validArtifacts.filter(a => a.region === 'trung_bo').length;
  const countNam = validArtifacts.filter(a => a.region === 'nam_bo').length;

  const minRequiredPerRegion = gameModeRule === 'truong_ky' ? 2 : 1;
  const isRegionalRequirementMet = countBac >= minRequiredPerRegion && countTrung >= minRequiredPerRegion && countNam >= minRequiredPerRegion;

  // Total cards in hand
  const totalHandCards = player.cards.resource.length + player.cards.fortune.length + player.cards.knowledge.length + player.biKipCards.length;

  const handleCardClick = async (card: GameCard) => {
    setSelectedCard(card);
    const url = 'qrContent' in card 
      ? card.qrContent 
      : `https://lacviet.edu.vn/the-bai/${card.id}`;
    const qr = await generateQRCode(url);
    setQrCodeUrl(qr);
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 pb-24 space-y-4">
      
      {/* 1. Header Assets Stats Card: Tay Nải vs Hòm Ký Gửi */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#C5A059]/40 shadow-card space-y-4">
        
        {/* Main Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              TÀI SẢN · {player.name}
            </span>
            <div className="font-serif-lacviet text-2xl font-bold text-[#543310] flex items-center gap-2">
              <Trophy size={24} className="text-[#C5A059]" />
              <span>{validArtifactCount}/{artifactGoal} Kỷ vật</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              isRegionalRequirementMet 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {isRegionalRequirementMet ? '✅ Đủ 3 Miền' : `⚠️ Chưa đủ 3 Miền (≥${minRequiredPerRegion})`}
            </span>
          </div>
        </div>

        {/* Regional Progress Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-xl border ${countBac >= minRequiredPerRegion ? 'bg-blue-50/70 border-blue-300 font-bold text-blue-950' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <span className="block text-[10px] uppercase text-gray-500">Bắc Bộ</span>
            <span className="text-sm">{countBac}/{minRequiredPerRegion}</span>
          </div>
          <div className={`p-2 rounded-xl border ${countTrung >= minRequiredPerRegion ? 'bg-amber-50/70 border-amber-300 font-bold text-amber-950' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <span className="block text-[10px] uppercase text-gray-500">Trung Bộ</span>
            <span className="text-sm">{countTrung}/{minRequiredPerRegion}</span>
          </div>
          <div className={`p-2 rounded-xl border ${countNam >= minRequiredPerRegion ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-950' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <span className="block text-[10px] uppercase text-gray-500">Nam Bộ</span>
            <span className="text-sm">{countNam}/{minRequiredPerRegion}</span>
          </div>
        </div>

        {/* 2 Storage Compartments: Tay Nải vs Hòm Ký Gửi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Compartment A: Tay Nải */}
          <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#C5A059]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#543310]">
              <span>🎒 TAY NẢI</span>
              <span>{player.artifactItems.filter(a => a.storage === 'pouch').length} món</span>
            </div>

            {pouchUnsealed.length > 0 || pouchSealed.length > 0 ? (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {pouchUnsealed.map(art => (
                  <div key={art.id} className="p-1.5 bg-white rounded-lg border border-gray-200 text-xs flex items-center justify-between">
                    <span className="truncate">{art.name}</span>
                    <div className="flex items-center gap-1">
                      {art.isTreasure && (
                        <span className="text-[10px] px-1 py-0.2 bg-amber-100 text-amber-900 rounded font-bold">
                          Bảo vật
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">({art.province})</span>
                    </div>
                  </div>
                ))}

                {/* Sealed Artifacts */}
                {pouchSealed.map(art => (
                  <div key={art.id} className="p-1.5 bg-red-50 rounded-lg border border-red-200 text-xs flex items-center justify-between text-red-900">
                    <span className="flex items-center gap-1 line-through">
                      <Lock size={12} className="text-red-600" />
                      <span className="truncate">{art.name}</span>
                    </span>
                    <span className="text-[9px] bg-red-200 px-1 rounded font-bold">
                      Bị phong ấn
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 italic py-2 text-center">
                Tay nải đang trống
              </div>
            )}
            
            {pouchSealed.length > 0 && (
              <div className="text-[10px] text-red-700 bg-red-100/70 p-1.5 rounded-lg">
                ⚠️ {pouchSealed.length} kỷ vật bị phong ấn (vào Ô Góc để giải phóng).
              </div>
            )}
          </div>

          {/* Compartment B: Hòm Ký Gửi */}
          <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-300 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="flex items-center gap-1">
                <Shield size={14} className="text-emerald-700" /> HÒM KÝ GỬI
              </span>
              <span>{safeDeposit.length} món</span>
            </div>

            {safeDeposit.length > 0 ? (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {safeDeposit.map(art => (
                  <div key={art.id} className="p-1.5 bg-white rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                    <span className="truncate text-emerald-950 font-medium">{art.name}</span>
                    <span className="text-[10px] text-emerald-700">({art.province})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 italic py-2 text-center">
                Chưa ký gửi kỷ vật
              </div>
            )}

            <div className="text-[10px] text-emerald-800 bg-emerald-100/80 p-1.5 rounded-lg leading-relaxed">
              🛡️ Kỷ vật an toàn tuyệt đối khỏi cướp và phong ấn.
            </div>
          </div>
        </div>

        {/* Milestone Indicator */}
        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-700">
            <Flag size={14} className="text-[#543310]" />
            <span>Cột mốc đã cắm: <strong>{player.milestones.length}/2</strong></span>
          </div>
          <span className="text-[11px] text-gray-500">
            {player.milestones.length > 0 ? `Ô: ${player.milestones.map(idx => `#${idx}`).join(', ')}` : 'Chưa cắm cờ'}
          </span>
        </div>
      </div>

      {/* 2. BÍ KÍP TÍCH LŨY */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-lacviet font-bold text-base text-[#543310] flex items-center gap-1.5">
            <BookOpen size={16} className="text-[#C5A059]" />
            <span>BÍ KÍP ({player.biKipCards.length})</span>
          </h3>
          <span className="text-[11px] text-gray-500">
            Trợ giúp câu hỏi hoặc vượt ải
          </span>
        </div>

        {player.biKipCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {player.biKipCards.map(bk => (
              <div
                key={bk.id}
                onClick={() => setSelectedBiKip(bk)}
                className="p-2.5 rounded-xl border border-amber-200/70 bg-[#FAF6EE] hover:border-[#C5A059] cursor-pointer transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-900 truncate max-w-[200px]">
                    {bk.title}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Chủ đề: <strong className="text-[#543310]">{bk.topicName}</strong> {bk.sourceProvince ? `(${bk.sourceProvince})` : ''}
                  </div>
                </div>
                <span className="text-base">📜</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 italic py-2 text-center bg-gray-50 rounded-xl">
            Chưa có Bí kíp nào (nhận khi trả lời sai hoặc thua Thử thách).
          </div>
        )}

        {/* Bi Kip assist exchange guide */}
        <div className="bg-amber-50/50 p-2 rounded-xl border border-amber-200/50 text-[11px] text-amber-950 grid grid-cols-3 gap-2 text-center">
          <div>
            <strong>1 BK:</strong> Loại 2 đáp án
          </div>
          <div>
            <strong>1 BK:</strong> Hỏi bạn
          </div>
          <div>
            <strong>3 BK:</strong> Nhận kỷ vật ngay
          </div>
        </div>
      </div>

      {/* 3. TÚI ĐỒ THẺ BÀI (HAND CARDS) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A059]/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-lacviet font-bold text-base text-[#543310] flex items-center gap-1.5">
              <Layers size={16} className="text-[#C5A059]" />
              <span>TÚI ĐỒ ({totalHandCards}/5 thẻ)</span>
            </h3>
            {totalHandCards > 5 && (
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle size={11} /> Quá 5 thẻ (xả cuối lượt)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs">
            {['all', 'resource', 'fortune', 'knowledge'].map(tab => (
              <button
                key={tab}
                onClick={() => setCardFilter(tab as any)}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  cardFilter === tab ? 'bg-[#543310] text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab === 'resource' ? 'Tài nguyên' : tab === 'fortune' ? 'May mắn' : 'Kiến thức'}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {(cardFilter === 'all' || cardFilter === 'resource') && player.cards.resource.map(r => (
            <div
              key={r.id}
              onClick={() => handleCardClick(r)}
              className="p-3 bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 rounded-xl cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-emerald-950 flex items-center justify-between">
                <span>[Tài nguyên] {r.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-normal">
                  {r.category}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-2">{r.effect}</p>
            </div>
          ))}

          {(cardFilter === 'all' || cardFilter === 'fortune') && player.cards.fortune.map(f => (
            <div
              key={f.id}
              onClick={() => handleCardClick(f)}
              className="p-3 bg-amber-50/60 border border-amber-200 hover:border-amber-400 rounded-xl cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-amber-950 flex items-center justify-between">
                <span>[May mắn] {f.name}</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-normal">
                  {f.eventType}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-2">{f.effectText}</p>
            </div>
          ))}

          {(cardFilter === 'all' || cardFilter === 'knowledge') && player.cards.knowledge.map(k => (
            <div
              key={k.id}
              onClick={() => handleCardClick(k)}
              className="p-3 bg-blue-50/60 border border-blue-200 hover:border-blue-400 rounded-xl cursor-pointer text-xs space-y-1 transition-all"
            >
              <div className="font-bold text-blue-950 flex items-center justify-between">
                <span>[Kiến thức] {k.title}</span>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-normal">
                  {k.province}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 line-clamp-2">{k.description}</p>
            </div>
          ))}
        </div>

        {totalHandCards === 0 && (
          <div className="text-xs text-gray-400 italic py-3 text-center bg-gray-50 rounded-xl">
            Túi đồ hiện đang trống. Dừng vào ô Thị trường, Lễ hội hoặc Ô Góc để nhận thẻ!
          </div>
        )}
      </div>

      {/* Selected Bi Kip Detail Modal */}
      {selectedBiKip && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 border-2 border-[#C5A059] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-[#543310]">CHI TIẾT BÍ KÍP</span>
              <button onClick={() => setSelectedBiKip(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="font-bold text-sm text-gray-900">{selectedBiKip.title}</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Chủ đề: <strong>{selectedBiKip.topicName}</strong></div>
              {selectedBiKip.sourceProvince && <div>Địa phương: <strong>{selectedBiKip.sourceProvince}</strong></div>}
              {selectedBiKip.questionSnippet && (
                <div className="p-2 bg-gray-50 rounded-lg italic text-[11px]">
                  "{selectedBiKip.questionSnippet}"
                </div>
              )}
            </div>
            <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg">
              ✨ Dùng để vượt ải Thử thách cùng chủ đề <strong>{selectedBiKip.topicName}</strong> hoặc gom 3 Bí kíp để nhận kỷ vật!
            </div>
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 border-2 border-[#C5A059] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-[#543310]">THÔNG TIN THẺ BÀI</span>
              <button onClick={() => setSelectedCard(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="font-bold text-sm text-gray-900">
              {'title' in selectedCard ? selectedCard.title : selectedCard.name}
            </div>
            <p className="text-xs text-gray-600">
              {'description' in selectedCard ? selectedCard.description : selectedCard.explanation}
            </p>
            <button type="button" onClick={() => { onUseCard(selectedCard); setSelectedCard(null); }} className="w-full py-2.5 bg-[#543310] hover:bg-[#6F441E] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all">Sử dụng thẻ</button>
            {qrCodeUrl && (
              <div className="text-center pt-2">
                <img src={qrCodeUrl} alt="QR" className="w-28 h-28 mx-auto rounded-lg border border-gray-200" />
                <span className="text-[10px] text-gray-400 mt-1 block">Quét QR xem tư liệu</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
