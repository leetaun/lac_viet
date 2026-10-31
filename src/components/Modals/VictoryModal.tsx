import { journalUrl, downloadJournal } from '../../utils/journal';
import { timedRanking, validArtifacts } from '../../engine/rules';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { generateQRCode } from '../../utils/qrcode';
import { Trophy, Award, Sparkles, RotateCcw, BookOpen, QrCode, Mic, Download } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  artifactGoal: number;
  gameModeRule?: 'toc_chien' | 'co_ban' | 'truong_ky';
  onNewGame: () => void;
  language: 'vi' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  artifactGoal,
  gameModeRule = 'toc_chien',
  onNewGame,
  language
}) => {
  const tokenDef = TOKENS[winner.token];
  const [showStoryMinute, setShowStoryMinute] = useState<boolean>(false);
  const [showJournalQR, setShowJournalQR] = useState<boolean>(false);
  const [journalQrUrl, setJournalQrUrl] = useState<string>('');
  const [journalPlayerId, setJournalPlayerId] = useState(winner.id);
  const [journalError, setJournalError] = useState('');
  const journalPlayer = players.find(p => p.id === journalPlayerId) || winner;

  useEffect(() => {
    soundManager.playVictory();

    // Trigger confetti bursts
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#C5A059', '#543310', '#E5C07B', '#8C572D', '#3B220C'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

  }, [winner]);

  useEffect(() => {
    let cancelled=false;
    setJournalQrUrl(''); setJournalError('');
    journalUrl(journalPlayer).then(generateQRCode).then(url=>{
      if(cancelled)return;
      if(url)setJournalQrUrl(url);
      else setJournalError('Sổ dài hơn dung lượng mã QR. Bạn vẫn có thể tải đầy đủ bằng nút bên dưới.');
    }).catch(()=>{if(!cancelled)setJournalError('Không tạo được mã QR. Bạn có thể tải Sổ hành trình bên dưới.');});
    return()=>{cancelled=true;};
  }, [journalPlayer]);

  const sortedPlayers = timedRanking(players);

  const winnerValidArtifacts = winner.artifactItems 
    ? winner.artifactItems.filter(a => !a.isSealed || a.storage === 'safe') 
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop my-auto">
        
        {/* Banner */}
        <div className="brown-gradient-bg p-6 text-center text-white border-b-2 border-[#C5A059] relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#F5E5BE] to-[#C5A059] mx-auto flex items-center justify-center text-[#543310] shadow-lg mb-2 border-2 border-white animate-bounce-slow">
            <Trophy size={32} />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-[#F5E5BE] font-bold">
            VINH QUY BÁI TỔ · LẠC VIỆT
          </span>
          <h2 className="font-serif-lacviet text-2xl sm:text-3xl font-bold mt-1 text-white">
            {winner.name} CHIẾN THẮNG!
          </h2>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#F5E5BE]">
            <span>{tokenDef.icon} {tokenDef.name}</span>
            <span>•</span>
            <span>Đủ 3 miền & Về đích START</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Winner Artifacts Showcase */}
          <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C5A059]/40 space-y-2">
            <div className="text-xs font-bold text-[#543310] flex items-center justify-between">
              <span>BỘ SƯU TẬP KỶ VẬT:</span>
              <span>{winnerValidArtifacts.length} món</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {winnerValidArtifacts.map(art => (
                <span
                  key={art.id}
                  className="px-2 py-1 rounded-lg bg-white border border-[#C5A059]/40 text-xs font-medium text-gray-800 shadow-sm"
                >
                  {art.isTreasure ? '⭐ ' : '• '}{art.name} <span className="text-[10px] text-gray-400">({art.province})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Hall of Fame Ranking */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Bảng Vàng Thành Tích Toàn Trận
            </div>

            <div className="space-y-1.5">
              {sortedPlayers.map((player, rank) => {
                const pToken = TOKENS[player.token];
                const totalArt = validArtifacts(player).length;
                const isWinner = player.id === winner.id;

                return (
                  <div
                    key={player.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                      isWinner
                        ? 'bg-amber-50 border-[#C5A059] font-bold text-amber-950 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        rank === 0 ? 'bg-[#C5A059] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {rank + 1}
                      </span>
                      <span>{pToken.icon}</span>
                      <span>{player.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#543310] font-bold">
                        {totalArt}/{artifactGoal} Kỷ vật
                      </span>
                      <span className="text-gray-400 font-normal">
                        ({player.score}đ)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 10.3: Phút Kể Chuyện Toggle */}
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200 space-y-1.5 text-xs text-blue-950">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Mic size={14} className="text-blue-700" /> PHÚT KỂ CHUYỆN (3 PHÚT)
              </span>
              <button
                onClick={() => setShowStoryMinute(!showStoryMinute)}
                className="text-[11px] font-bold text-blue-700 hover:underline"
              >
                {showStoryMinute ? 'Thu gọn' : 'Xem gợi ý'}
              </button>
            </div>
            {showStoryMinute ? (
              <p className="text-gray-700 leading-relaxed pt-1">
                Mỗi người chơi lần lượt chia sẻ 1 điều bất ngờ hoặc câu chuyện về kỷ vật tâm đắc nhất mang về đích.
              </p>
            ) : (
              <p className="text-gray-600">
                Mỗi người chơi chia sẻ 1 điều tâm đắc sau hành trình.
              </p>
            )}
          </div>

          {/* Sổ Hành Trình QR Code */}
          {showJournalQR && (
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border-2 border-[#C5A059] text-center space-y-2 animate-fade-in">
              <span className="font-bold text-xs text-[#543310] block">
                MÃ QR SỔ HÀNH TRÌNH VĂN HÓA
              </span>
              <select aria-label="Sổ hành trình của người chơi" value={journalPlayerId} onChange={event=>setJournalPlayerId(event.target.value)} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]">{players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
              {journalError && <p className="text-xs text-gray-500">{journalError}</p>}
              <button type="button" onClick={()=>downloadJournal(journalPlayer)} className="w-full py-2.5 bg-[#543310] hover:bg-[#6F441E] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all">Tải Sổ hành trình</button>
              {journalQrUrl && <img src={journalQrUrl} alt="Journey QR" className="w-28 h-28 mx-auto rounded-lg border border-gray-200" />}
              <p className="text-[11px] text-gray-500">
                Quét mã để lưu lại toàn bộ kỷ vật và tri thức vào điện thoại!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
          <button
            onClick={() => setShowJournalQR(!showJournalQR)}
            className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-300 flex items-center gap-1.5 transition-all"
          >
            <QrCode size={14} className="text-[#543310]" />
            <span>Sổ hành trình</span>
          </button>

          <button
            onClick={onNewGame}
            className="px-5 py-2.5 brown-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Ván Mới</span>
          </button>
        </div>

      </div>
    </div>
  );
};
