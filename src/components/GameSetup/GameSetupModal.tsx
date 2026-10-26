import React, { useState } from 'react';
import { GameMode, GameModeRule, ArtifactGoal, TokenType, Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { STARTER_BIKIP_CARDS } from '../../data/cardDecks';
import { copyCard } from '../../engine/rules';
import { soundManager } from '../../utils/sound';
import { Play, Smartphone, Bot, Globe, ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react';

interface GameSetupModalProps {
  onStartGame: (config: {
    durationMinutes?: number;
    mode: GameMode;
    gameModeRule: GameModeRule;
    playerCount: number;
    artifactGoal: ArtifactGoal;
    players: Player[];
    roomCode?: string;
    options: {
      physicalQR?: boolean;
      starterBiKip: boolean;
      exploreMode: boolean;
      timedMode: boolean;
    };
  }) => void;
  language: 'vi' | 'en';
}

const PLAYER_COLORS = ['#0284C7', '#EC4899', '#F59E0B', '#EA580C'];
const TOKEN_LIST: TokenType[] = ['non_la', 'hoa_sen', 'den_long', 'banh_mi'];

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  onStartGame,
  language
}) => {
  const [step, setStep] = useState(0);
  const stepHeading = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => { stepHeading.current?.focus(); }, [step]);

  const [mode, setMode] = useState<GameMode>('offline');
  const [gameModeRule, setGameModeRule] = useState<GameModeRule>('toc_chien');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [artifactGoal, setArtifactGoal] = useState<ArtifactGoal>(3);
  const [roomCode, setRoomCode] = useState<string>('LV-2026');

  const [durationMinutes, setDurationMinutes] = useState(60);
  const [starterSeats, setStarterSeats] = useState([true, false, false, false]);

  // Options toggles (Section 3 & 10.1)
  const [starterBiKip, setStarterBiKip] = useState<boolean>(false);
  const [exploreMode, setExploreMode] = useState<boolean>(false);
  const [timedMode, setTimedMode] = useState<boolean>(false);
  const [physicalQR,setPhysicalQR]=useState(true);

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
    const other = updated.indexOf(token);
    if (other !== -1) updated[other] = updated[seatIdx];
    updated[seatIdx] = token;
    setAssignedTokens(updated);
  };

  const handleSelectRuleMode = (rule: GameModeRule, goal: ArtifactGoal) => {
    setGameModeRule(rule);
    setArtifactGoal(goal);
  };

  const handleStart = () => {
    soundManager.playSuccess();

    const createdPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const isAIPlayer = mode === 'ai' && i > 0;
      
      // Starter Bi Kip assignment (Rule: 1 starter Bi Kip default or 3 if starterBiKip enabled)
      const initialBiKip = starterBiKip && starterSeats[i]
        ? [STARTER_BIKIP_CARDS[0], STARTER_BIKIP_CARDS[1], STARTER_BIKIP_CARDS[2]]
        : [STARTER_BIKIP_CARDS[i % STARTER_BIKIP_CARDS.length]];

      createdPlayers.push({
        id: `p${i + 1}`,
        name: isAIPlayer 
          ? (i === 1 ? 'Bé Sen (AI)' : i === 2 ? 'Cụ Đồ (AI)' : 'Bạn An (AI)')
          : (playerNames[i].trim() || `Người chơi ${i + 1}`),
        seat: i + 1,
        isAI: isAIPlayer,
        token: assignedTokens[i] || TOKEN_LIST[i % 4],
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        position: 0, // Starts at 0 (START)
        artifactItems: [],
        artifacts: 0,
        safeArtifacts: 0,
        biKipCards: initialBiKip.map(copyCard),
        milestones: [],
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
      durationMinutes,
      gameModeRule: exploreMode ? 'toc_chien' : gameModeRule,
      playerCount,
      artifactGoal: exploreMode ? 3 : artifactGoal,
      players: createdPlayers,
      roomCode: mode === 'online' ? roomCode.trim() : undefined,
      options: {
        physicalQR: mode==='offline' && physicalQR,
        starterBiKip,
        exploreMode,
        timedMode: timedMode && !exploreMode
      }
    });
  };

  const steps = ['Hình thức', 'Chế độ', 'Người chơi', 'Sẵn sàng'];
  const modes = [
    { value: 'offline' as GameMode, icon: Smartphone, name: 'Chơi offline', description: 'Cùng chơi trên bàn cờ thật, dùng một thiết bị làm trọng tài.' },
    { value: 'ai' as GameMode, icon: Bot, name: 'Chơi với AI', description: 'Bạn và những người bạn máy cùng khám phá Lạc Việt.' },
    { value: 'online' as GameMode, icon: Globe, name: 'Chơi online', description: 'Dùng mã phòng để thiết lập ván chơi.' },
  ];
  const rules = [
    { rule: 'toc_chien' as GameModeRule, goal: 3 as ArtifactGoal, name: 'Tốc chiến', time: '25–35 phút', description: '3 Kỷ vật · Mỗi miền ít nhất 1' },
    { rule: 'co_ban' as GameModeRule, goal: 5 as ArtifactGoal, name: 'Cơ bản', time: '~45–60 phút', description: '5 Kỷ vật · Mỗi miền ít nhất 1' },
    { rule: 'truong_ky' as GameModeRule, goal: 7 as ArtifactGoal, name: 'Trường kỳ', time: '75–90 phút', description: '7 Kỷ vật · Mỗi miền ít nhất 2' },
  ];
  const selectedMode = modes.find(item => item.value === mode)!;
  const selectedRule = rules.find(item => item.rule === gameModeRule)!;
  const titles = ['Bạn muốn chơi thế nào?', 'Chọn nhịp chơi của bạn', 'Ai sẽ cùng lên đường?', 'Sẵn sàng khám phá Lạc Việt'];
  const descriptions = [
    'Chọn một hình thức để bắt đầu hành trình.',
    'Một ván nhanh hay một chuyến đi thật thong thả?',
    mode === 'ai' ? 'Bạn ở ghế 1. Các ghế còn lại do AI điều khiển.' : 'Chọn số người và quân cờ theo thứ tự quanh bàn.',
    'Xem lại lựa chọn, rồi cùng bắt đầu thôi.',
  ];
  const selectionClass = (selected: boolean) => `w-full text-left rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2 ${selected ? 'border-[#7E121D] bg-[#FCF5F3] shadow-sm' : 'border-gray-200 bg-white hover:border-[#C5A059] hover:bg-[#FAF8F3]'}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#141824]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-backdrop-fade">
      <section role="dialog" aria-modal="true" aria-labelledby="setup-title" className="bg-white rounded-3xl max-w-xl w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col shadow-2xl border-2 border-[#C5A059] overflow-hidden animate-modal-pop">
        <header className="crimson-gradient-bg px-5 sm:px-7 py-4 text-white border-b border-[#C5A059] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] text-[#7E121D] font-bold font-serif-lacviet flex items-center justify-center border border-[#C5A059] shrink-0">LV</div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">STARTUP OLYMPIAD 2026</p>
              <p className="font-serif-lacviet text-xl sm:text-2xl font-bold">BOARDGAME LẠC VIỆT</p>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <nav aria-label="Các bước thiết lập">
            <ol className="flex items-start">
              {steps.map((label, index) => (
                <li key={label} aria-current={index === step ? 'step' : undefined} className="flex-1 relative text-center">
                  {index < steps.length - 1 && <div aria-hidden="true" className={`absolute h-px top-3.5 left-1/2 w-full ${index < step ? 'bg-[#C5A059]' : 'bg-gray-200'}`} />}
                  <button type="button" disabled={index >= step} onClick={() => setStep(index)} className="relative flex flex-col items-center gap-2 mx-auto disabled:cursor-default rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]" aria-label={`Bước ${index + 1}: ${label}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index === step ? 'bg-[#7E121D] text-white' : index < step ? 'bg-[#F4E8CF] text-[#7E121D]' : 'bg-gray-100 text-gray-400'}`}>
                      {index < step ? <Check size={14} aria-hidden="true" /> : index + 1}
                    </span>
                    <span className={`text-[10px] sm:text-xs ${index === step ? 'text-[#7E121D] font-bold' : 'text-gray-500'}`}>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div>
            <h2 id="setup-title" ref={stepHeading} tabIndex={-1} className="font-serif-lacviet text-2xl sm:text-3xl font-bold text-[#7E121D] outline-none">{titles[step]}</h2>
            <p className="text-sm text-gray-500 mt-2">{descriptions[step]}</p>
          </div>

          {step === 0 && (
            <div className="space-y-3" role="group" aria-label="Hình thức chơi">
              {modes.map(item => (
                <button key={item.value} type="button" aria-pressed={mode === item.value} onClick={() => setMode(item.value)} className={selectionClass(mode === item.value)}>
                  <span className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl ${mode === item.value ? 'bg-[#7E121D] text-white' : 'bg-gray-100 text-gray-500'}`}><item.icon size={20} aria-hidden="true" /></span>
                    <span className="flex-1"><span className="block text-sm font-bold text-gray-900">{item.name}</span><span className="block text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</span></span>
                    {mode === item.value && <Check size={18} className="text-[#7E121D] shrink-0" aria-hidden="true" />}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3" role="group" aria-label="Chế độ chơi">
              {rules.map(item => (
                <button key={item.rule} type="button" aria-pressed={gameModeRule === item.rule} onClick={() => handleSelectRuleMode(item.rule, item.goal)} className={selectionClass(gameModeRule === item.rule)}>
                  <span className="flex justify-between items-center gap-2"><span className="text-base font-bold text-[#7E121D]">{item.name}</span><span className="text-xs text-gray-500">{item.time}</span></span>
                  <span className="block text-xs text-gray-500 mt-2">{item.description}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="text-xs font-bold text-gray-500 mb-2">SỐ NGƯỜI CHƠI {mode === 'ai' && '(GỒM CẢ BẠN)'}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map(num => (
                    <button key={num} type="button" aria-pressed={playerCount === num} onClick={() => setPlayerCount(num)} className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${playerCount === num ? 'bg-[#7E121D] text-white border-[#7E121D]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#C5A059]'}`}>{num} người</button>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: playerCount }, (_, seatIdx) => {
                  const currentToken = assignedTokens[seatIdx] || TOKEN_LIST[seatIdx % 4];
                  const isAI = mode === 'ai' && seatIdx > 0;
                  return (
                    <div key={seatIdx} className="p-3.5 bg-[#FAF9F6] rounded-xl border border-gray-200 space-y-2">
                      <label htmlFor={`token-${seatIdx}`} className="block text-xs font-bold text-gray-700">{isAI ? ['Bạn', 'Bé Sen (AI)', 'Cụ Đồ (AI)', 'Bạn An (AI)'][seatIdx] : mode === 'ai' ? 'Bạn · Ghế 1' : `Ghế ${seatIdx + 1}`}</label>
                      {!isAI && <input aria-label={`Biệt danh ghế ${seatIdx + 1}`} value={playerNames[seatIdx]} onChange={e => setPlayerNames(previous => previous.map((name,index) => index === seatIdx ? e.target.value : name))} maxLength={24} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]" />}
                      <select id={`token-${seatIdx}`} value={currentToken} onChange={e => handleTokenSelect(seatIdx, e.target.value as TokenType)} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]">
                        {TOKEN_LIST.map(token => <option key={token} value={token}>{TOKENS[token].icon} {TOKENS[token].name}</option>)}
                      </select>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{TOKENS[currentToken].passive}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#FAF8F3] border border-[#EADFC9] p-4">
                <div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-[#7E121D]">{selectedMode.name}</span><button type="button" onClick={() => setStep(0)} className="text-xs text-[#7E121D] underline underline-offset-4">Thay đổi</button></div>
                <p className="text-sm text-gray-600 mt-2">{selectedRule.name} · {playerCount} người · {selectedRule.time}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedRule.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">{assignedTokens.slice(0, playerCount).map((token, index) => <span key={index} className="rounded-lg bg-white border border-[#EADFC9] px-2 py-1 text-xs text-gray-600">{TOKENS[token].icon} {TOKENS[token].name}</span>)}</div>
              </div>
              {mode === 'online' && (
                <div>
                  <label htmlFor="setup-room-code" className="block text-xs font-bold text-gray-600 mb-2">MÃ PHÒNG</label>
                  <input id="setup-room-code" value={roomCode} onChange={e => setRoomCode(e.target.value)} maxLength={32} placeholder="Ví dụ: LV-2026" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-[#C5A059] focus:border-[#C5A059]" />
                </div>
              )}
              <details className="group rounded-xl border border-gray-200">
                <summary className="cursor-pointer list-none flex items-center justify-between p-4 text-sm font-semibold text-gray-700">Tùy chọn bổ sung<ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <div className="px-4 pb-4 space-y-4">
                  {mode==='offline' && <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={physicalQR} onChange={e=>setPhysicalQR(e.target.checked)} className="mt-1 accent-[#7E121D]"/><span><span className="block text-sm font-semibold text-gray-800">Dùng 4 thẻ QR vật lý</span><span className="block text-xs text-gray-500 mt-1">Dừng ở ô địa phương, quét thẻ bằng điện thoại chung hoặc bấm mở trên máy.</span></span></label>}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={starterBiKip} onChange={e => setStarterBiKip(e.target.checked)} className="mt-1 accent-[#7E121D]" />
                    <span><span className="block text-sm font-semibold text-gray-800">3 Bí kíp cho người mới</span><span className="block text-xs text-gray-500 mt-1">Thêm trợ giúp về Lịch sử, Ẩm thực và Nghệ thuật.</span></span>
                  </label>
                  {starterBiKip && <div className="space-y-2">
                    <p className="text-xs text-gray-500">Chọn người mới được nhận 3 Bí kíp:</p>
                    {playerNames.slice(0,playerCount).map((name,index) => <label key={index} className="flex items-start gap-3 cursor-pointer text-xs text-gray-700"><input type="checkbox" checked={starterSeats[index]} onChange={e => setStarterSeats(previous => previous.map((value,i) => i === index ? e.target.checked : value))} className="mt-1 accent-[#7E121D]" />{mode === 'ai' && index>0 ? ['','Bé Sen (AI)','Cụ Đồ (AI)','Bạn An (AI)'][index] : name}</label>)}
                  </div>}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={exploreMode} onChange={e => { setExploreMode(e.target.checked); if (e.target.checked) { handleSelectRuleMode('toc_chien',3); setTimedMode(false); } }} className="mt-1 accent-[#7E121D]" />
                    <span><span className="block text-sm font-semibold text-gray-800">Khám phá văn hóa</span><span className="block text-xs text-gray-500 mt-1">Tốc chiến, không đếm ngược; tắt Nỏ thần, Phong ấn và Chạm trán để thong thả tìm hiểu di sản.</span></span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" disabled={exploreMode} checked={timedMode} onChange={e => setTimedMode(e.target.checked)} className="mt-1 accent-[#7E121D]" />
                    <span><span className="block text-sm font-semibold text-gray-800">Giờ thu quân</span><span className="block text-xs text-gray-500 mt-1">Hết giờ, hoàn tất lượt đang chơi rồi xếp hạng theo Kỷ vật hợp lệ, số miền và khoảng cách đến START.</span></span>
                  </label>
                  {timedMode && <label className="block text-xs font-bold text-gray-600">Thời gian ván chơi (phút)<input type="number" min={5} max={180} value={durationMinutes} onChange={e => setDurationMinutes(Math.min(180,Math.max(5,Number(e.target.value)||5)))} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-[#C5A059] focus:border-[#C5A059]" /></label>}
                </div>
              </details>
              <p className="text-xs text-gray-400 leading-relaxed">Bạn có thể quay lại các bước trước để sửa lựa chọn.</p>
            </div>
          )}
        </div>

        <footer className="shrink-0 px-5 sm:px-7 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white">
          {step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-gray-500 hover:text-[#7E121D]"><ArrowLeft size={16} aria-hidden="true" />Quay lại</button> : <span className="text-xs text-gray-400">Bước 1 / 4</span>}
          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="flex items-center justify-center gap-2 rounded-xl bg-[#7E121D] hover:bg-[#650F17] text-white px-6 py-3 text-sm font-bold transition-colors">Tiếp tục<ArrowRight size={16} aria-hidden="true" /></button>
          ) : (
            <button type="button" onClick={handleStart} disabled={mode === 'online' && !roomCode.trim()} className="flex items-center justify-center gap-2 rounded-xl crimson-gradient-bg text-[#F5E5BE] border border-[#C5A059] px-5 py-3 text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"><Play size={16} fill="currentColor" aria-hidden="true" />Bắt đầu trận đấu</button>
          )}
        </footer>
      </section>
    </div>
  );
};
