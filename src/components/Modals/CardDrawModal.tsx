import { topicName } from '../../engine/content';
import { DIFFICULTY_LABELS } from '../../data/questionBank';
import { pouchCards } from '../../engine/rules';
import React, { useState, useEffect } from 'react';
import { GameCard, KnowledgeCard, ChallengeCard, ResourceCard, FortuneCard, Player, BiKipCard, ArtifactItem, CardResolution } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { PROVINCES_DATA, getProvinceByName } from '../../data/provinces';
import { soundManager } from '../../utils/sound';
import { generateQRCode } from '../../utils/qrcode';
import { 
  Sparkles, Trophy, AlertTriangle, ShieldCheck, QrCode, CheckCircle2, 
  XCircle, ArrowRight, HelpCircle, Users, BookOpen, Clock, Tag, ShoppingBag, ExternalLink
} from 'lucide-react';

interface CardDrawModalProps {
  remoteConnected?: boolean;
  remoteConnection?: React.ReactNode;
  remoteAnswer?: {answer:number;success:boolean};
  card: GameCard;
  player: Player;
  onResolve: (result: CardResolution) => void;
  onConsumeBiKip?: (ids: string[]) => boolean;
  exploreMode?: boolean;
  onAskFriend?: () => Promise<string | undefined>;
  onFriendReward?: (id: string) => void;
  onGuessReward?: () => Promise<void>;
  language: 'vi' | 'en';
}

export const CardDrawModal: React.FC<CardDrawModalProps> = ({
  remoteConnected=false,
  remoteConnection,
  remoteAnswer,
  card,
  player,
  onResolve,
  onConsumeBiKip,
  exploreMode = false,
  onAskFriend,
  onFriendReward,
  onGuessReward,
  language
}) => {
  const [friendId, setFriendId] = useState<string | undefined>();
  const [askingFriend, setAskingFriend] = useState(false);
  const [helperUsed, setHelperUsed] = useState(false);
  const [pendingAction, setPendingAction] = useState(false);

  // Common Quiz / Task State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(20);
  const answeredRef = React.useRef(false);
  const [actionDone, setActionDone] = useState<boolean>(false);

  // QR & Deep Dive View
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [showContestAnswer,setShowContestAnswer]=useState(false);

  // Market specific state
  const [marketBargainAnswered, setMarketBargainAnswered] = useState<boolean>(false);
  const [marketAnswer,setMarketAnswer]=useState<number | undefined>();
  const [marketPrice, setMarketPrice] = useState<number>(2); // 1 if bargain correct, 2 if wrong
  const [selectedCardsToPay, setSelectedCardsToPay] = useState<string[]>([]);
  useEffect(()=>{
    if(!remoteAnswer)return;
    if(card.type==='resource') {setMarketAnswer(remoteAnswer.answer);setMarketBargainAnswered(true);setMarketPrice(remoteAnswer.success?1:2);}
    if(card.type==='fortune')setShowContestAnswer(true);
  },[remoteAnswer,card.id]);

  // Province and Artifact lookup
  const provinceName = ('province' in card ? card.province : '') || '';
  const provData = getProvinceByName(provinceName);
  const marketQuiz = card.type==='resource' && card.marketQuestion ? {...provData?.marketQuiz,...card.marketQuestion,item:provData?.marketQuiz.item||'Kỷ vật địa phương'} : provData?.marketQuiz;

  // Helper to generate a new artifact item for this province
  const generateArtifactForProvince = (isTreasure: boolean = false): ArtifactItem => {
    const artName = provData 
      ? (isTreasure ? provData.artifacts.treasure : provData.artifacts.regular[Math.floor(Math.random() * provData.artifacts.regular.length)])
      : ('title' in card ? card.title : 'Kỷ vật văn hóa');
    
    return {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: artName,
      province: provinceName || 'Địa phương',
      region: (provData?.region as any) || 'bac_bo',
      isTreasure,
      isSealed: false,
      storage: 'pouch'
    };
  };

  // Check matching Bi Kip for Challenge auto-pass
  const matchingTopicBiKip = card.type === 'challenge'
    ? player.biKipCards.find(bk => bk.topic === (card as ChallengeCard).topic)
    : undefined;

  useEffect(() => {
    soundManager.playCardDraw();
    
    // Generate QR code for Deep Dive
    const qrLink = ('qrContent' in card && card.qrContent) 
      ? card.qrContent 
      : provData?.qrCodeUrl || `https://lacviet.edu.vn/kham-pha/${card.id}`;
    generateQRCode(qrLink).then(url => setQrDataUrl(url));

    // Countdown Timer for Knowledge and Action Challenges
    const initialTime = card.type === 'knowledge' ? 20 : (card.type === 'challenge' && card.timeLimitSeconds ? card.timeLimitSeconds : 20);
    setTimer(initialTime);

  }, [card]);

  useEffect(() => {
    if (remoteConnected || exploreMode || askingFriend || answered || pendingAction) return;
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
  }, [card, remoteConnected, exploreMode, askingFriend, answered, pendingAction]);

  useEffect(() => {
    if (!exploreMode && timer === 0 && !answered && (card.type === 'knowledge' || card.type === 'challenge')) {
      setAnswered(true);
      setIsCorrect(false);
    }
  }, [timer, exploreMode, answered, card.type]);

  // Handle Knowledge Answer
  const handleAnswerKnowledge = (index: number) => {
    if (askingFriend || pendingAction || answeredRef.current) return;
    answeredRef.current = true;
    if (answered || (!exploreMode && timer === 0) || card.type !== 'knowledge') { answeredRef.current = false; return; }
    const kn = card as KnowledgeCard;
    setSelectedOption(index);
    setAnswered(true);

    const correct = kn.correctAnswer === index;
    setIsCorrect(correct);

    if (correct) {
      if (friendId) onFriendReward?.(friendId);
      soundManager.playSuccess();
    } else {
      soundManager.playTokenSkill();
    }
  };

  // Handle Challenge Answer
  const handleAnswerChallenge = (index: number) => {
    if (answered || (!exploreMode && timer === 0) || card.type !== 'challenge') return;
    const ch = card as ChallengeCard;
    setSelectedOption(index);
    setAnswered(true);

    const correct = ch.correctAnswer === index;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
    } else {
      soundManager.playTokenSkill();
    }
  };

  // 1 Bí kíp: 50:50 Eliminate 2 wrong options
  const handleEliminateTwoOptions = () => {
    if (player.biKipCards.length < 1 || answered || helperUsed || (!exploreMode && timer === 0) || card.type !== 'knowledge') return;
    if (!onConsumeBiKip?.([player.biKipCards[0].id])) return;
    const kn = card as KnowledgeCard;
    const wrongIndices = kn.options.map((_, index) => index).filter(i => i !== kn.correctAnswer);
    // Shuffle and pick 2
    const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setHelperUsed(true);
    soundManager.playTokenSkill();
  };

  // 3 Bí kíp: "Có công mài sắt" (Auto-win artifact without quiz)
  const handleCoCongMaiSat = () => {
    if (player.biKipCards.length < 3 || helperUsed || answered || (!exploreMode && timer === 0)) return;
    soundManager.playSuccess();
    const newArt = generateArtifactForProvince(Math.random() < 0.1);
    onResolve({
      success: true,
      rewardArtifact: true,
      rewardArtifactItem: newArt,
      consumeBiKipIds: player.biKipCards.slice(0, 3).map(bk => bk.id),
      logMessage: `${player.name} đã dùng 3 Bí kíp ("Có công mài sắt") nhận ngay Kỷ vật: [${newArt.name}]!`
    });
  };

  // Challenge: Vượt ải tự động bằng Bí kíp cùng chủ đề
  const handleAutoPassChallengeWithBiKip = () => {
    if (!matchingTopicBiKip || answered || (!exploreMode && timer === 0)) return;
    soundManager.playSuccess();
    const newArt = generateArtifactForProvince(Math.random() < 0.4); // Higher chance of treasure
    onResolve({
      success: true,
      rewardArtifact: true,
      rewardArtifactItem: newArt,
      consumeBiKipId: matchingTopicBiKip.id,
      logMessage: `${player.name} dùng Bí kíp cùng chủ đề [${matchingTopicBiKip.title}] vượt ải thành công, nhận Kỷ vật: [${newArt.name}]!`
    });
  };

  const askFriend = async () => {
    if (helperUsed || answered || (!exploreMode && timer === 0) || !player.biKipCards.length || !onAskFriend || askingFriend) return;
    setAskingFriend(true);
    try {
      const id = await onAskFriend();
      if (id) { setFriendId(id); setHelperUsed(true); }
    } finally { setAskingFriend(false); }
  };

  // Market: Handle Bargain Quiz
  const handleMarketBargainAnswer = (idx: number) => {
    if (!marketQuiz || marketBargainAnswered) return;
    setMarketAnswer(idx);
    setMarketBargainAnswered(true);
    const correct = marketQuiz.correctAnswer === idx;
    if (correct) {
      soundManager.playSuccess();
      setMarketPrice(1);
    } else {
      soundManager.playTokenSkill();
      setMarketPrice(2);
    }
  };

  // Market: Toggle card selection for payment
  const handleToggleMarketCard = (cardId: string) => {
    if (selectedCardsToPay.includes(cardId)) {
      setSelectedCardsToPay(selectedCardsToPay.filter(id => id !== cardId));
    } else {
      if (selectedCardsToPay.length < marketPrice) {
        setSelectedCardsToPay([...selectedCardsToPay, cardId]);
      }
    }
  };

  // Market: Confirm Purchase
  const handleConfirmMarketPurchase = () => {
    if (!marketBargainAnswered || selectedCardsToPay.length !== marketPrice) return;
    const payment = pouchCards(player).filter(c => selectedCardsToPay.includes(c.id));
    if (payment.length !== marketPrice) return;
    const newArt = generateArtifactForProvince(Math.random() < 0.1);
    onResolve({ success: true, rewardArtifact: true, rewardArtifactItem: newArt, consumeCards: payment, marketAnswer,
      logMessage: `${player.name} mua Kỷ vật [${newArt.name}] tại ${provinceName}, thanh toán ${marketPrice} thẻ.` });
  };

  // Complete Resolution
  const handleComplete = (customSuccess?: boolean) => {
    if (card.type === 'knowledge') {
      const kn = card as KnowledgeCard;
      if (isCorrect) {
        const newArt = generateArtifactForProvince(Math.random() < 0.1);
        onResolve({
          success: true,
          rewardArtifact: true,
          rewardArtifactItem: newArt,
          logMessage: `${player.name} trả lời đúng câu hỏi ${kn.province}, nhận được Kỷ vật: [${newArt.name}]!`
        });
      } else {
        // "HỌC TỪ CÁI SAI" - No penalty! Award Bi Kip card!
        const newBiKip: BiKipCard = {
          id: `bk_${Date.now()}`,
          title: `Bí Kíp: ${kn.title}`,
          topic: kn.topic,
          topicName: topicName(kn.topic),
          sourceProvince: kn.province,
          questionSnippet: kn.question
        };

        onResolve({
          success: false,
          rewardBiKip: newBiKip,
          logMessage: `💡 ${player.name} học từ cái sai, nhận được thêm 01 thẻ Bí Kíp [${newBiKip.title}]!`
        });
      }
    } else if (card.type === 'resource') {
      onResolve({
        success: true,
        drawCard: card,
        logMessage: `${player.name} nhận được Thẻ Tài Nguyên: ${card.name} (Túi đồ)`
      });
    } else if (card.type === 'fortune') {
      const fortune = card as FortuneCard;
      onResolve({
        success: true,
        drawCard: card,
        extraRoll: fortune.extraTurn,
        moveDelta: fortune.moveDelta,
        logMessage: `${player.name} rút Thẻ May Mắn: [${fortune.name}] - ${fortune.effectText}`
      });
    } else if (card.type === 'challenge') {
      const ch = card as ChallengeCard;
      const success = customSuccess !== undefined ? customSuccess : isCorrect;
      if (success) {
        const isTreasure = Math.random() < 0.4; // Higher chance of treasure
        const newArt = generateArtifactForProvince(isTreasure);
        onResolve({
          success: true,
          rewardArtifact: true,
          rewardArtifactItem: newArt,
          logMessage: `🏆 ${player.name} vượt ải Thử thách ${ch.province} thành công, nhận Kỷ vật [${newArt.name}] ${isTreasure ? '⭐ BẢO VẬT' : ''}!`
        });
      } else {
        // Failing Challenge: Drop 1 artifact to Lost & Found (START), get 1 Bi Kip compensation
        const immuneByNonLa = false;
        const dropped = player.artifactItems.find(a => !a.isSealed && a.storage === 'pouch');

        const compensationBiKip: BiKipCard = {
          id: `bk_comp_${Date.now()}`,
          title: `Bí Kíp Đền Bù: ${ch.title}`,
          topic: ch.topic,
          topicName: topicName(ch.topic),
          sourceProvince: ch.province,
          questionSnippet: ch.question
        };

        onResolve({
          success: false,
          penalizeArtifact: !immuneByNonLa,
          droppedArtifactItem: !immuneByNonLa ? dropped : undefined,
          rewardBiKip: compensationBiKip,
          logMessage: immuneByNonLa
            ? `${player.name} thất bại thử thách nhưng nhờ Kỹ năng NÓN LÁ đã che mưa miễn phạt kỷ vật!`
            : `${player.name} nhận thêm 01 Bí kíp từ trải nghiệm Thử thách.`
        });
      }
    }
  };

  // Hand cards available for market payment
  const allHandCards = [
    ...player.biKipCards.map(c => ({ id: c.id, name: `[Bí kíp] ${c.title}` })),
    ...player.cards.resource.map(c => ({ id: c.id, name: `[Tài nguyên] ${c.name}` })),
    ...player.cards.fortune.map(c => ({ id: c.id, name: `[May mắn] ${c.name}` })),
    ...player.cards.knowledge.map(c => ({ id: c.id, name: `[Kiến thức] ${c.title}` }))
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] flex flex-col max-h-[92vh] animate-modal-pop">
        
        {/* Modal Header */}
        <div className={`p-4 text-white flex items-center justify-between ${
          card.type === 'knowledge' ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900' :
          card.type === 'fortune' ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800' :
          card.type === 'resource' ? 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900' :
          'bg-gradient-to-r from-red-700 via-rose-800 to-red-900'
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#F5E5BE] flex items-center gap-1.5">
              <span>{card.type === 'knowledge' ? '📖 Ô KIẾN THỨC' :
                     card.type === 'fortune' ? '🌾 Ô LỄ HỘI' :
                     card.type === 'resource' ? '🛒 Ô THỊ TRƯỜNG' :
                     '⚔️ Ô THỬ THÁCH ĐỊA PHƯƠNG'}</span>
              <span>•</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">
                {'province' in card ? card.province : 'Toàn quốc'}
              </span>
            </div>
            <h2 className="font-serif-lacviet text-lg sm:text-xl font-bold mt-0.5">
              {'title' in card ? card.title : card.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Badge */}
            {(card.type === 'knowledge' || card.type === 'challenge') && !answered && !remoteConnected && (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                timer <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'
              }`}>
                <Clock size={13} />
                <span>{exploreMode ? '∞' : timer}s</span>
              </div>
            )}

            {/* QR Deep Dive Toggle */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
              title="Quét QR xem tư liệu chuyên sâu trên máy cá nhân"
            >
              <QrCode size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Standard 4-Part Layout */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {remoteConnected && remoteConnection}
          
          {/* QR Code Deep Dive Section (Part 4) */}
          {showQR && qrDataUrl && (
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border-2 border-[#C5A059] text-center flex flex-col items-center gap-2 animate-fade-in">
              <span className="text-xs font-bold text-[#543310] flex items-center gap-1">
                <QrCode size={15} /> TƯ LIỆU MỞ RỘNG (QR)
              </span>
              <img src={qrDataUrl} alt="QR Code" className="w-32 h-32 rounded-xl shadow-sm border border-gray-200" />
              <p className="text-[11px] text-gray-600 max-w-xs leading-relaxed">
                Quét mã để xem tư liệu lịch sử chi tiết trên điện thoại.
              </p>
            </div>
          )}

          {/* 1. THẺ KIẾN THỨC BODY */}
          {card.type === 'knowledge' && (
            <div className="space-y-3">
              {/* Bí kíp assist bar */}
              {!answered && (
                <div className="bg-[#FAF6EE] border border-[#C5A059]/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-700">
                    <BookOpen size={14} className="text-[#543310]" />
                    <span>Bí kíp: <strong>{player.biKipCards.length}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {player.biKipCards.length >= 1 && !helperUsed && !askingFriend && eliminatedOptions.length === 0 && (
                      <button
                        onClick={handleEliminateTwoOptions}
                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-300"
                      >
                        1 BK: Loại 2 đáp án
                      </button>
                    )}
                    {!helperUsed && player.biKipCards.length >= 1 && onAskFriend && <button disabled={askingFriend} onClick={askFriend} className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-300">1 BK: Hỏi bạn</button>}
                    {!helperUsed && player.biKipCards.length >= 3 && (
                      <button
                        onClick={handleCoCongMaiSat}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow"
                      >
                        3 BK: Có công mài sắt
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Part 1: Task (Nhiệm vụ) */}
              <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>PHẦN 1: NHIỆM VỤ (ĐỌC TO CHO CẢ BÀN)</span>
                  <span className="text-blue-700 lowercase font-medium">Chủ đề: {topicName(card.topic)}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 leading-snug">
                  {card.question}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {card.options.map((option, idx) => {
                  const isEliminated = eliminatedOptions.includes(idx);
                  let optionStyle = 'bg-white hover:bg-blue-50/50 border-gray-200 text-gray-800';
                  
                  if (isEliminated) {
                    optionStyle = 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed opacity-40 line-through';
                  } else if (answered) {
                    if (idx === card.correctAnswer) {
                      optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (idx === selectedOption) {
                      optionStyle = 'bg-amber-100 border-amber-400 text-amber-950 font-medium';
                    } else {
                      optionStyle = 'bg-gray-50 text-gray-400 border-gray-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={answered || isEliminated || askingFriend || pendingAction}
                      onClick={() => handleAnswerKnowledge(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 shadow-sm ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {answered && idx === card.correctAnswer && (
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result & Parts 2 + 3 (Did You Know & Citation) */}
              {answered && (
                <div className="space-y-2.5 animate-fade-in pt-1">
                  {/* Positive Feedback */}
                  <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                    isCorrect 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    {isCorrect ? (
                      <>
                        <Trophy size={16} className="text-amber-600 flex-shrink-0" />
                        <span>CHÍNH XÁC! +1 Kỷ vật ({card.province})</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} className="text-[#543310] flex-shrink-0" />
                        <span>HỌC TỪ CÁI SAI! Nhận 01 Bí kíp ({topicName(card.topic)})</span>
                      </>
                    )}
                  </div>

                  {/* Part 2: Did You Know (Bạn có biết) */}
                  <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 text-xs text-gray-800 leading-relaxed">
                    <span className="font-bold text-[#543310] block mb-0.5">💡 Bạn có biết?</span>
                    {card.didYouKnow || card.description}
                  </div>

                  {/* Part 3: Citation (Dẫn chứng) */}
                  {card.citation && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                      <strong>📜 Nguồn: </strong> {card.citation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. THẺ THỬ THÁCH BODY */}
          {card.type === 'challenge' && (
            <div className="space-y-3">
              {/* Bypass button with matching topic Bi Kip */}
              {matchingTopicBiKip && !answered && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#C5A059] p-3 rounded-2xl flex items-center justify-between gap-2 shadow-sm">
                  <div className="text-xs text-amber-950">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-700" /> Bí kíp cùng chủ đề ({topicName(card.topic)})!
                    </span>
                    <div className="text-[11px] text-gray-600 mt-0.5 truncate max-w-xs">
                      {matchingTopicBiKip.title}
                    </div>
                  </div>
                  <button
                    onClick={handleAutoPassChallengeWithBiKip}
                    className="px-3 py-1.5 brown-gradient-bg text-[#F5E5BE] font-bold rounded-xl text-xs border border-[#C5A059] shadow transition-all active:scale-95 flex-shrink-0"
                  >
                    Vượt ải tự động
                  </button>
                </div>
              )}

              {/* Task prompt */}
              <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#C5A059]/40">
                <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-[#543310]">
                  <span>
                    {card.challengeType === 'quiz' ? 'TRẮC NGHIỆM CHUYÊN SÂU' :
                     card.challengeType === 'action' ? 'THỬ THÁCH HÀNH ĐỘNG' : 'KỂ NHANH 20 GIÂY'}
                  </span>
                  <span className="text-gray-500 font-normal">Chủ đề: {topicName(card.topic)}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 leading-snug">
                  {card.question}
                </div>
                {card.actionPrompt && (
                  <div className="mt-2 text-xs text-[#543310] font-medium bg-[#FAF6EE] p-2.5 rounded-lg border border-[#C5A059]/30">
                    👉 {card.actionPrompt}
                  </div>
                )}
              </div>

              {/* Challenge Quiz Options */}
              {card.challengeType === 'quiz' && card.options && (
                <div className="space-y-2">
                  {card.options.map((option, idx) => {
                    let optionStyle = 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800';
                    if (answered) {
                      if (idx === card.correctAnswer) {
                        optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (idx === selectedOption) {
                        optionStyle = 'bg-amber-100 border-amber-400 text-amber-950';
                      } else {
                        optionStyle = 'bg-gray-50 text-gray-400 border-gray-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={answered}
                        onClick={() => handleAnswerChallenge(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 shadow-sm ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {answered && idx === card.correctAnswer && (
                          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action / Speed naming voting */}
              {(card.challengeType === 'action' || card.challengeType === 'speed_naming') && !answered && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-700 text-center">
                    Cả bàn chơi biểu quyết kết quả thực hiện:
                  </div>
                  <p className="text-[11px] text-gray-500">Diễn tả/Vẽ: có người khác đoán đúng trong thời gian. Hát/Kể nhanh: quá nửa số người còn lại đồng ý; hòa phiếu hoặc chơi 2 người thì tính Đạt nếu đã cố gắng hoàn thành trọn yêu cầu.</p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={pendingAction}
                      onClick={async () => {
                        if (pendingAction || (!exploreMode && timer === 0)) return;
                        setPendingAction(true);
                        if (card.challengeType === 'action' && /diễn tả|vẽ/i.test(card.question + ' ' + (card.actionPrompt || ''))) await onGuessReward?.();
                        setPendingAction(false);
                        setActionDone(true);
                        setAnswered(true);
                        setIsCorrect(true);
                        soundManager.playSuccess();
                      }}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      <span>ĐẠT (Quá nửa đồng ý)</span>
                    </button>
                    <button
                      onClick={() => {
                        setActionDone(false);
                        setAnswered(true);
                        setIsCorrect(false);
                        soundManager.playTokenSkill();
                      }}
                      className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold text-xs transition-all"
                    >
                      KHÔNG ĐẠT
                    </button>
                  </div>
                </div>
              )}

              {/* Results & Citation */}
              {answered && (
                <div className="space-y-2 animate-fade-in pt-1">
                  <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                    isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    {isCorrect ? (
                      <>
                        <Trophy size={16} className="text-amber-600 flex-shrink-0" />
                        <span>VƯỢT ẢI THÀNH CÔNG! Nhận 01 Kỷ vật tỉnh {card.province} + 01 thẻ tự chọn!</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={16} className="text-[#543310] flex-shrink-0" />
                        <span>
                          Nhận 01 Bí kíp. Bấm tiếp tục để chọn Kỷ vật/thẻ phải bỏ (hoặc dùng Nón lá nếu sẵn sàng).
                        </span>
                      </>
                    )}
                  </div>

                  {card.explanation && (
                    <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 text-xs text-gray-800">
                      <span className="font-bold text-[#543310] block mb-0.5">💡 Lời giải:</span>
                      {card.explanation}
                    </div>
                  )}

                  {card.citation && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                      <strong>📜 Nguồn: </strong> {card.citation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {(card.type==='knowledge'||card.type==='challenge') && card.questionScope==='general' && <p className="text-[11px] text-gray-500">Ngân hàng của nhóm · {DIFFICULTY_LABELS[card.difficulty||'basic']} · Liên ngành. Kỷ vật thưởng thuộc {card.province}; câu hỏi có thể là kiến thức chung.</p>}

          {/* 3. THẺ TÀI NGUYÊN (Ô Thị trường) */}
          {card.type === 'resource' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                  TÀI NGUYÊN (TÚI ĐỒ)
                </div>
                <div className="font-serif-lacviet text-base font-bold text-emerald-950">
                  {card.name} (Tỷ lệ: {card.ratePercent}%)
                </div>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {card.description}
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-bold mt-2">
                  ✨ Thời điểm dùng: {card.timing}
                </div>
              </div>

              {/* Phiên chợ đặc sản & Trả giá */}
              {marketQuiz && (
                <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C5A059]/40 space-y-2.5">
                  <div className="text-xs font-bold text-[#543310] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShoppingBag size={14} /> CHỢ ĐẶC SẢN {provinceName.toUpperCase()}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {marketQuiz.item}
                    </span>
                  </div>

                  <div className="text-xs text-gray-800 font-medium">
                    Câu hỏi Trả giá: {marketQuiz.question}
                  </div>

                  {!marketBargainAnswered ? (
                    <div className="space-y-1.5">
                      {marketQuiz.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleMarketBargainAnswer(i)}
                          className="w-full p-2 text-left bg-white hover:bg-amber-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      <div className={`p-2 rounded-xl text-xs font-bold ${
                        marketPrice === 1 ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
                      }`}>
                        {marketPrice === 1 ? 'Trả giá đúng! Giá mua: 1 THẺ BÀI.' : 'Chưa đúng! Giá mua: 2 THẺ BÀI.'}
                      </div>

                      {card.marketQuestion && <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 text-xs text-gray-800"><p>{card.marketQuestion.explanation}</p>{card.marketQuestion.sources.map(source=><a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-gray-500 hover:underline">{source.label}</a>)}</div>}
                      <div className="text-xs text-gray-700">
                        Chọn thẻ bài thanh toán ({selectedCardsToPay.length}/{marketPrice} thẻ):
                      </div>

                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {allHandCards.map(c => (
                          <button
                            key={c.id}
                            onClick={() => handleToggleMarketCard(c.id)}
                            className={`p-1.5 text-[11px] rounded-lg border transition-all ${
                              selectedCardsToPay.includes(c.id)
                                ? 'bg-[#543310] text-white font-bold border-[#543310]'
                                : 'bg-white text-gray-700 border-gray-200'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={selectedCardsToPay.length < marketPrice}
                          onClick={handleConfirmMarketPurchase}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow"
                        >
                          Đổi ({marketPrice} thẻ)
                        </button>
                        <button
                          onClick={() => handleComplete()}
                          className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-medium"
                        >
                          Bỏ qua
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {card.type==='fortune' && card.contestQuestion && <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C5A059]/40 space-y-2.5"><p className="text-xs font-bold text-[#543310]">Hội thi · {DIFFICULTY_LABELS[card.contestQuestion.difficulty]}</p><p className="text-sm font-bold text-gray-900">{card.contestQuestion.question}</p>{card.contestQuestion.options.map((option,index)=><p key={index} className="text-xs text-gray-700">{String.fromCharCode(65+index)}. {option}</p>)}<button type="button" onClick={()=>setShowContestAnswer(true)} className="px-3 py-1.5 bg-[#543310] text-white rounded-xl text-xs font-bold">Hiện đáp án</button>{showContestAnswer && <div className="text-xs text-gray-700"><strong>Đáp án {String.fromCharCode(65+card.contestQuestion.correctAnswer)}.</strong> {card.contestQuestion.explanation}{card.contestQuestion.sources.map(source=><a className="block text-[11px] text-gray-500 hover:underline" key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>)}</div>}</div>}

          {/* 4. THẺ MAY MẮN (Ô Lễ hội) */}
          {card.type === 'fortune' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>NHÓM: {card.group.toUpperCase()}</span>
                  <span>Tỷ lệ: {card.ratePercent}%</span>
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

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-xs text-[#543310] font-bold flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={13} />
            <span>{showQR ? 'Ẩn QR' : 'Mở rộng (QR)'}</span>
          </button>

          {card.type === 'resource' && marketQuiz && marketBargainAnswered ? null : (
            (card.type !== 'challenge' && card.type !== 'knowledge') || answered ? (
              <button
                onClick={() => handleComplete()}
                className="px-5 py-2.5 brown-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2"
              >
                <span>Tiếp tục</span>
                <ArrowRight size={15} />
              </button>
            ) : null
          )}
        </div>

      </div>
    </div>
  );
};
