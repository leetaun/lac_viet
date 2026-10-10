import React, { useState } from 'react';
import { GameMode, ArtifactGoal, TokenType, Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { Users, Trophy, Play, Sparkles, Smartphone, Bot, Globe } from 'lucide-react';

interface GameSetupModalProps {
  onStartGame: (config: {
    mode: GameMode;
    playerCount: number;
    artifactGoal: ArtifactGoal;
    players: Player[];
    roomCode?: string;
  }) => void;
  language: 'vi' | 'en';
}

const PLAYER_COLORS = ['#0284C7', '#EC4899', '#F59E0B', '#EA580C'];
const TOKEN_LIST: TokenType[] = ['non_la', 'hoa_sen', 'den_long', 'banh_mi'];

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  onStartGame,
  language
}) => {
  const [mode, setMode] = useState<GameMode>('offline');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [artifactGoal, setArtifactGoal] = useState<ArtifactGoal>(3);
  const [roomCode, setRoomCode] = useState<string>('LV-2026');

  // Player configurations
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Người chơi 1',
    'Người chơi 2',
    'Người chơi 3',
    'Người chơi 4'
  ]);

  const [assignedTokens, setAssignedTokens] = useState<TokenType[]>([
    'non_la',
    'hoa_sen',
    'den_long',
    'banh_mi'
  ]);

  const handleTokenSelect = (seatIdx: number, token: TokenType) => {
    const updated = [...assignedTokens];
    updated[seatIdx] = token;
    setAssignedTokens(updated);
  };

  const handleNameChange = (idx: number, name: string) => {
    const updated = [...playerNames];
    updated[idx] = name;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    soundManager.playSuccess();

    const createdPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const isAIPlayer = mode === 'ai' && i > 0;
      createdPlayers.push({
        id: `p${i + 1}`,
        name: isAIPlayer 
          ? (i === 1 ? 'Bé Sen (AI)' : i === 2 ? 'Cụ Đồ (AI)' : 'Bạn An (AI)')
          : (playerNames[i] || `Người chơi ${i + 1}`),
        seat: i + 1,
        isAI: isAIPlayer,
        token: assignedTokens[i] || TOKEN_LIST[i % 4],
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        position: 0, // Starts at 0 (START)
        artifacts: 0,
        safeArtifacts: 0,
        score: 0,
        tokenSkillAvailable: true,
        hasShield: false,
        immuneToPenalty: false,
        cards: {
          knowledge: [],
          resource: [],
          fortune: []
        },
        lapsCompleted: 0
      });
    }

    onStartGame({
      mode,
      playerCount,
      artifactGoal,
      players: createdPlayers,
      roomCode: mode === 'online' ? roomCode : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141824]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-4 border-[#C5A059] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header matching Slide 6 */}
        <div className="crimson-gradient-bg px-5 py-4 text-white flex items-center justify-between border-b-2 border-[#C5A059]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FAF6EE] text-[#7E121D] font-bold font-serif-lacviet flex items-center justify-center border border-[#C5A059] text-base">
              LV
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">
                STARUP OLYMPIAD 2026
              </div>
              <h1 className="font-serif-lacviet text-xl sm:text-2xl font-bold text-white tracking-wide">
                BOARDGAME LẠC VIỆT
              </h1>
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching Slide 6 */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* LEFT COLUMN: App Description & Game Mode (Slide 6 Left) */}
          <div className="space-y-4">
            <div>
              <h2 className="font-serif-lacviet text-xl font-bold text-[#7E121D]">
                Lạc Việt
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Hành trình 40 ô qua văn hóa Việt. Một máy làm trọng tài cho cả bàn chơi.
              </p>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                HÌNH THỨC CHƠI
              </span>

              {/* 1. Offline */}
              <div
                onClick={() => setMode('offline')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'offline'
                    ? 'bg-red-50/70 border-[#7E121D] ring-2 ring-[#7E121D]/20 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className={mode === 'offline' ? 'text-[#7E121D]' : 'text-gray-400'} />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Chơi offline (Trọng tài)
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 pl-6">
                  Một máy làm trọng tài, truyền tay quanh bàn kết hợp với bàn cờ thật hoặc chơi trực tiếp trên máy.
                </div>
              </div>

              {/* 2. Vs AI */}
              <div
                onClick={() => setMode('ai')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'ai'
                    ? 'bg-red-50/70 border-[#7E121D] ring-2 ring-[#7E121D]/20 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bot size={16} className={mode === 'ai' ? 'text-[#7E121D]' : 'text-gray-400'} />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Chơi với AI
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 pl-6">
                  Bạn giữ ghế 1, các ghế còn lại (P2, P3, P4) do máy AI điều khiển tự động.
                </div>
              </div>

              {/* 3. Online */}
              <div
                onClick={() => setMode('online')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  mode === 'online'
                    ? 'bg-red-50/70 border-[#7E121D] ring-2 ring-[#7E121D]/20 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe size={16} className={mode === 'online' ? 'text-[#7E121D]' : 'text-gray-400'} />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Chơi online (Mã phòng)
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 pl-6">
                  Mỗi người một máy, cùng vào một mã phòng chung.
                </div>
              </div>
            </div>

            {/* Referee App Note Box */}
            <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#C5A059]/40 text-[11px] text-gray-700 space-y-1.5 leading-relaxed">
              <span className="font-bold text-[#7E121D] block">
                LẠC VIỆT · REFEREE APP
              </span>
              <p>
                Một máy làm trọng tài cho tối đa 4 người chơi. Bàn 40 ô, 4 bộ thẻ, kỷ vật, cơ chế phạt và cướp, kỹ năng token, bản đồ hành trình và tra cứu luật — tất cả theo đúng luật đã mô tả.
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                <li>Chạm bất kỳ ô nào trên bàn để xem loại ô và ý nghĩa văn hóa.</li>
                <li>Thẻ kiến thức cùng chủ đề với thẻ thử thách sẽ mở nút bỏ qua câu hỏi.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Start Match (Slide 6 Right) */}
          <div className="space-y-4">
            
            {/* Number of Players: 2 | 3 | 4 */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                SỐ NGƯỜI CHƠI
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPlayerCount(num)}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      playerCount === num
                        ? 'bg-[#7E121D] text-white border-[#7E121D] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {num} người
                  </button>
                ))}
              </div>
            </div>

            {/* Artifact Goal: Tốc chiến (3) | Cơ bản (5) | Trường kỳ (7) */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                QUY ƯỚC SỐ KỶ VẬT
              </span>
              <div className="space-y-1.5">
                {[
                  { goal: 3 as ArtifactGoal, name: 'Tốc chiến', desc: '3 kỷ vật' },
                  { goal: 5 as ArtifactGoal, name: 'Cơ bản', desc: '5 kỷ vật' },
                  { goal: 7 as ArtifactGoal, name: 'Trường kỳ', desc: '7 kỷ vật' },
                ].map(item => (
                  <div
                    key={item.goal}
                    onClick={() => setArtifactGoal(item.goal)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      artifactGoal === item.goal
                        ? 'bg-amber-50 border-[#C5A059] font-bold text-amber-950 shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-500 font-medium">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Selection for each seat */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  CHỌN TOKEN CHO TỪNG GHẾ
                </span>
                <span className="text-[11px] text-[#7E121D] font-bold">
                  {playerCount} ghế đã kích hoạt
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: playerCount }).map((_, seatIdx) => {
                  const currentToken = assignedTokens[seatIdx] || TOKEN_LIST[seatIdx % 4];
                  const tDef = TOKENS[currentToken];

                  return (
                    <div
                      key={seatIdx}
                      className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-gray-800">
                          Ghế P{seatIdx + 1}
                        </span>
                        <select
                          value={currentToken}
                          onChange={(e) => handleTokenSelect(seatIdx, e.target.value as TokenType)}
                          className="text-[11px] font-bold border border-gray-300 rounded p-1 bg-white"
                        >
                          {TOKEN_LIST.map(tKey => (
                            <option key={tKey} value={tKey}>
                              {TOKENS[tKey].icon} {TOKENS[tKey].name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-[10px] text-gray-500 line-clamp-1">
                        {tDef.passive}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BIG START BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-3.5 crimson-gradient-bg text-[#F5E5BE] font-bold rounded-2xl text-base border-2 border-[#C5A059] shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Play size={18} fill="#F5E5BE" />
                <span>Bắt Đầu Trận Đấu</span>
              </button>
              <div className="text-center text-[10px] text-gray-400 mt-1.5">
                Máy này giữ luật, thẻ và điểm. Người chơi vẫn dùng bàn thật nếu muốn.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

