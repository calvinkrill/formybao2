/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Music, 
  BookOpen, 
  Smile, 
  Image as ImageIcon, 
  Lock, 
  Sparkles, 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  X,
  Download,
  Share2,
  Copy
} from 'lucide-react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { Page, Memory, Song, SecretNote } from './types.ts';

// --- Constants & Data ---

const MEMORIES: Memory[] = [
  { id: '1', image: 'input_file_0.png', caption: 'Starting our journey together.', date: 'Ranked Mythic Lobby' },
  { id: '2', image: 'input_file_1.png', caption: "Win or lose, I'm just glad I have you by my side.", date: '27 April 2026' },
  { id: '3', image: 'input_file_2.png', caption: 'Absolute dominance! 16-0 with my favorite duo.', date: '03 March 2026' },
  { id: '4', image: 'input_file_3.png', caption: 'You are always the MVP in my heart.', date: 'Match Synergy' },
  { id: '5', image: 'input_file_4.png', caption: 'Our victory streak continues.', date: '10 March 2026' },
];

const SONGS: Song[] = [
  { id: '1', title: 'Palangga Taka', artist: 'Local Artist', url: '#', note: 'This song reminds me of the day I realized how much you mean to me.' },
  { id: '2', title: 'Perfect', artist: 'Ed Sheeran', url: '#', note: 'Because you are perfect for me in every single way.' },
  { id: '3', title: 'Lover', artist: 'Taylor Swift', url: '#', note: 'Our love story is my favorite story of all.' },
  { id: '4', title: 'At My Worst', artist: 'Pink Sweat$', url: '#', note: 'Thank you for staying even when I am at my worst.' },
];

const SECRET_NOTES: SecretNote[] = [
  { id: '1', label: 'Click if you need a hug', content: 'Virtual hug sending... 🫂 I wish I could hold you tight right now. You are doing so well, my Bao2. Just breathe.', password: 'us' },
  { id: '2', label: 'Open when you feel tired', content: 'Rest your eyes, mahal. You’ve worked so hard today. I’m so proud of everything you do. Eat well and sleep early tonight. 💕', password: 'love' },
  { id: '3', label: 'Open when you miss me', content: 'I miss you more than words can say. Close your eyes and feel my heart beating with yours. We’ll be together again soon. I love you.', password: 'forever' },
  { id: '4', label: 'Open when you feel unloved', content: 'Even on your worst days, even when you don’t feel like yourself, you are the most precious person to me. You are loved, cherished, and needed. Always.', password: 'always' },
];

const DAILY_MESSAGES = [
  "You are loved more than you know.",
  "I’m proud of you, Bao2.",
  "You make my world so much brighter.",
  "Whatever happens today, I'm here for you.",
  "You are my favorite person in the whole world.",
  "Thank you for being you.",
  "Your smile is my favorite view.",
  "I'm so lucky to have you in my life.",
];

// --- Components ---

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; top: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [
        ...prev.slice(-20),
        { id: Date.now(), left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 20 + 10 }
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.6, 0] }}
          transition={{ duration: Math.random() * 5 + 5, ease: 'linear' }}
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
          className="absolute text-romantic-deep/20"
        >
          <Heart fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void; key?: React.Key }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    const saved = localStorage.getItem('musicPlaying');
    return saved ? JSON.parse(saved) : false;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('musicPlaying', JSON.stringify(isMusicPlaying));
    if (isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsMusicPlaying(false));
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  useEffect(() => {
    // Auto-hide splash after 10 seconds if not clicked
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Music interaction required"));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const Splash = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-romantic-bg flex flex-col items-center justify-center p-6 text-center"
    >
      <FloatingHearts />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="space-y-8 relative z-10"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 bg-romantic-soft rounded-full flex items-center justify-center shadow-2xl mx-auto ring-8 ring-white"
          >
            <Heart fill="white" className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -right-4 text-4xl"
          >
            ✨
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-serif italic font-bold text-romantic-ink">For my baby nicole</h1>
          <p className="text-romantic-accent font-bold tracking-widest uppercase text-xs">prepared with all my heart</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSplash(false)}
          className="group relative px-10 py-4 bg-romantic-accent text-white rounded-full font-bold shadow-xl shadow-romantic-accent/30 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Click here to start
            <Sparkles className="w-5 h-5 animate-pulse" />
          </span>
          <motion.div
            className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />
        </motion.button>
        
        <p className="text-[10px] uppercase font-bold tracking-tighter text-romantic-ink/40">
          opening your safe place...
        </p>
      </motion.div>
    </motion.div>
  );

  const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -2, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, rotate: 2, filter: 'blur(10px)' }}
      transition={{ 
        duration: 0.6, 
        ease: [0.34, 1.56, 0.64, 1], // Custom bouncy ease
      }}
      className="w-full max-w-2xl mx-auto px-4 py-8 relative z-10"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.5, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * 100],
              y: [0, (i < 3 ? -1 : 1) * 100]
            }}
            transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
            className="absolute left-1/2 top-1/2 text-xl"
          >
            ✨
          </motion.div>
        ))}
      </div>
      {children}
    </motion.div>
  );

  // --- Sub-Pages ---

  const HomePage = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'my bao2',
            text: 'A little surprise for you...',
            url: window.location.origin,
          });
        } catch (err) {
          console.log('Share failed', err);
        }
      } else {
        navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-romantic-soft rounded-full flex items-center justify-center p-6 shadow-lg ring-4 ring-white"
          >
            <Heart fill="white" className="w-16 h-16 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-serif italic font-bold">Hi <span className="text-romantic-accent underline decoration-wavy underline-offset-8">Bao2</span>,</h1>
            <p className="text-xl leading-relaxed text-romantic-ink/80 max-w-lg mx-auto">
              This website is made only for you. Whenever you feel tired, sad, or alone, open this and remember that someone cares for you so much.
            </p>
            <p className="text-sm font-serif italic text-romantic-accent/60">
              made with love — xander james
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/letter')}
              className="btn-vibrant flex items-center gap-2 group"
            >
              Open Letter
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/music')}
              className="btn-outline-vibrant flex items-center gap-2"
            >
              Our Playlist
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-8 py-4 bg-white text-romantic-accent border-2 border-romantic-accent rounded-full font-bold hover:bg-romantic-accent/5 active:scale-95 transition-all"
            >
              {copied ? <><Copy className="w-5 h-5" /> Copied!</> : <><Share2 className="w-5 h-5" /> Share this page</>}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  };

  const LetterPage = () => {
    const paragraphs = [
      "Dear Bao2, sometimes I catch myself just staring at your photos and realizing how incredibly lucky I am to have you. You’re not just someone I love — you are my favorite person, my home, and my peace.",
      "I know life gets heavy sometimes, and there are days when everything feels too much to handle. I want this little message to be your safe place whenever you need a reminder of how valuable and important you truly are.",
      "You have such a beautiful strength within you, even when you can’t see it yourself. You make every day better just by being in it. Every laugh we share, every conversation, and every moment with you means so much to me, and I treasure them deeply.",
      "No matter how far apart we are or how busy life gets, please never forget that you have me. I’ll always be your biggest fan, your strongest supporter, and your safest place. Palangga taka, Bao2. Always."
    ];
    const [currentPara, setCurrentPara] = useState(0);

    return (
      <PageTransition>
        <div className="card-vibrant p-10 space-y-6 min-h-[50vh] flex flex-col pt-12">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-romantic-soft rounded-full blur-3xl opacity-30"></div>
          <h2 className="text-3xl font-serif italic font-bold border-b-2 border-romantic-border pb-4 relative z-10">A Letter for You</h2>
          <div className="flex-grow italic text-xl leading-relaxed text-romantic-ink/90 relative z-10">
            <Typewriter key={currentPara} text={paragraphs[currentPara]} />
          </div>
          
          <div className="flex justify-between items-center pt-6 relative z-10">
            <span className="text-xs uppercase tracking-widest font-bold opacity-40">Paragraph {currentPara + 1} of {paragraphs.length}</span>
            <button 
              onClick={() => {
                if (currentPara < paragraphs.length - 1) setCurrentPara(p => p + 1);
                else navigate('/mood');
              }}
              className="px-6 py-2 bg-romantic-accent text-white rounded-full font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              {currentPara < paragraphs.length - 1 ? "Keep Reading" : "Finished"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </PageTransition>
    );
  };

  const MoodPage = () => {
    const moods = [
      { id: 'sad', label: 'I feel sad', emoji: '💌', message: "It's okay to feel sad. Cry if you need to. I wish I was there to wipe your tears. Remember that after the rain, there is always a rainbow. You'll be okay, and I'm right here with you." },
      { id: 'alone', label: 'I feel alone', emoji: '🤗', message: "You are NEVER alone. My heart is with you, even if I'm not physically there. Think of me, and know that someone is always thinking of you and loving you." },
      { id: 'miss', label: 'I miss you', emoji: '📞', message: "I miss you too, more than you know. Every second without you feels like a minute. But every day brings us closer to being together again. Hang in there, mahal." },
      { id: 'comfort', label: 'I need comfort', emoji: '🫂', message: "Take a deep breath. Imagine me wrapping my arms around you in a warm hug. Put on your favorite pajamas, grab a hot drink, and listen to our songs. You are safe." },
      { id: 'overthink', label: 'I’m overthinking', emoji: '🤍', message: "Hush, my love. Your mind is being loud, but it's not always telling the truth. You are loved. You are doing enough. You are enough. Let go of the worries." },
    ];
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    return (
      <PageTransition>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif italic font-bold">How do you feel?</h2>
            <p className="text-romantic-ink/60 mt-1">Select a mood to receive some love</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-5 glass rounded-2xl transition-all text-left text-lg font-bold flex justify-between items-center group ${mood.id === 'comfort' ? 'bg-romantic-soft text-white border-transparent' : 'hover:shadow-md border-romantic-border'}`}
              >
                <span>{mood.label}</span>
                <span className={`text-xl transition-all ${mood.id === 'comfort' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{mood.emoji}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedMood && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-10 card-vibrant border-romantic-soft/30"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-romantic-soft rounded-full flex items-center justify-center text-white">✨</div>
                  <button onClick={() => setSelectedMood(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                </div>
                <p className="text-xl italic text-romantic-ink leading-relaxed font-medium">
                  {moods.find(m => m.id === selectedMood)?.message}
                </p>
                <div className="mt-8 flex justify-center">
                  <Heart fill="#FF85A1" className="w-8 h-8 text-romantic-accent animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    );
  };

  const GalleryPage = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

    return (
      <PageTransition>
        <div className="space-y-6">
          <h2 className="text-3xl font-serif italic font-bold text-romantic-ink text-center">Our Memories</h2>
          <div 
            onClick={() => setZoomedIdx(activeIdx)}
            className="relative aspect-square sm:aspect-video rounded-[40px] overflow-hidden card-vibrant border-4 border-white/50 group cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={MEMORIES[activeIdx].image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-romantic-ink/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <p className="text-xl font-serif italic font-medium">{MEMORIES[activeIdx].caption}</p>
              <p className="text-xs uppercase tracking-widest font-bold opacity-60 mt-1">{MEMORIES[activeIdx].date}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(i => (i - 1 + MEMORIES.length) % MEMORIES.length);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white active:scale-90"
            >
              <ChevronLeft className="w-6 h-6"/>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(i => (i + 1) % MEMORIES.length);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white active:scale-90"
            >
              <ChevronRight className="w-6 h-6"/>
            </button>
          </div>
          <div className="flex justify-center gap-2">
            {MEMORIES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIdx(i)}
                className={`h-2 rounded-full transition-all ${i === activeIdx ? 'bg-romantic-accent w-8' : 'bg-romantic-accent/20 w-2'}`}
              />
            ))}
          </div>

          <AnimatePresence>
            {zoomedIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-romantic-ink/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10"
                onClick={() => setZoomedIdx(null)}
              >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setZoomedIdx(null)}
                    className="absolute -top-12 right-0 text-white hover:text-romantic-soft transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={MEMORIES[zoomedIdx].image}
                    className="w-full h-full object-contain rounded-3xl shadow-2xl border-4 border-white/20"
                  />
                  <div className="text-center text-white space-y-2">
                    <p className="text-3xl font-serif italic font-medium">{MEMORIES[zoomedIdx].caption}</p>
                    <p className="text-sm uppercase tracking-widest font-bold opacity-60">{MEMORIES[zoomedIdx].date}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    );
  };

  const MusicPage = () => {
    const [selectedSongNote, setSelectedSongNote] = useState<Song | null>(null);

    return (
      <PageTransition>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif italic font-bold">Our Sweet Playlist</h2>
            <p className="mt-2 text-romantic-ink/60 font-medium">Songs that remind me of every moment we've shared.</p>
          </div>
          <div className="space-y-4">
            {SONGS.map(song => (
              <div key={song.id} className="glass p-5 rounded-3xl flex items-center justify-between hover:translate-x-2 border-l-4 border-romantic-accent transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-romantic-soft rounded-2xl flex items-center justify-center shadow-sm">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-romantic-ink">{song.title}</h3>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-40">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedSongNote(song)}
                    className="p-2 hover:bg-romantic-soft/10 rounded-full transition-colors text-romantic-accent"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] uppercase font-bold tracking-tighter text-romantic-accent border-b border-romantic-accent/30 pb-0.5">This song is for you ✨</p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedSongNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-romantic-ink/40 backdrop-blur-md"
                onClick={() => setSelectedSongNote(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white/95 glass p-8 rounded-3xl max-w-sm w-full relative shadow-2xl border-2 border-white"
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedSongNote(null)} className="absolute top-4 right-4 p-2 hover:bg-romantic-soft/20 rounded-full transition-colors text-romantic-ink"><X className="w-4 h-4"/></button>
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-romantic-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Music className="w-6 h-6 text-romantic-accent" />
                    </div>
                    <h3 className="text-xl font-serif italic font-bold text-romantic-ink">{selectedSongNote.title}</h3>
                    <p className="italic text-romantic-ink/80 leading-relaxed">
                      "{selectedSongNote.note}"
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-8 bg-romantic-lavender rounded-[40px] border-2 border-white shadow-lg text-center">
            <p className="italic text-romantic-ink/80 text-lg font-medium">"Every lyric feels like it was written about us."</p>
          </div>
        </div>
      </PageTransition>
    );
  };

  const SecretMessagesPage = () => {
    const [selectedNote, setSelectedNote] = useState<SecretNote | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [error, setError] = useState(false);

    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput.toLowerCase().trim() === (selectedNote?.password || 'love')) {
        setIsPasswordCorrect(true);
        setError(false);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
    };

    const closeModal = () => {
      setSelectedNote(null);
      setPasswordInput('');
      setIsPasswordCorrect(false);
      setError(false);
    };

    return (
      <PageTransition>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif italic font-bold">Secret Gifts</h2>
            <p className="text-romantic-ink/60 mt-1">Little surprises just for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECRET_NOTES.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-8 glass rounded-[40px] flex flex-col items-center text-center space-y-4 hover:scale-105 transition-all group border-romantic-border"
              >
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-romantic-soft group-hover:text-white transition-all text-2xl">
                  🎁
                </div>
                <span className="font-bold text-romantic-ink">{note.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedNote && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-romantic-ink/40 backdrop-blur-md"
                onClick={closeModal}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white/95 glass p-10 rounded-[3rem] max-w-md w-full relative shadow-2xl border-2 border-white"
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={closeModal} className="absolute top-6 right-6 p-2 hover:bg-romantic-soft/20 rounded-full transition-colors text-romantic-ink"><X/></button>
                  
                  {!isPasswordCorrect ? (
                    <div className="space-y-6">
                      <div className="w-14 h-14 bg-romantic-soft rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-2">🔒</div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif italic font-bold text-romantic-ink">{selectedNote.label}</h3>
                        <p className="text-sm text-romantic-ink/60">This gift is locked. Enter the secret word to open it.</p>
                      </div>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <motion.input
                          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                          type="text"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="What's the secret word?"
                          className="w-full px-6 py-4 rounded-2xl bg-romantic-bg border-2 border-romantic-border focus:border-romantic-accent outline-none font-bold text-center transition-all"
                          autoFocus
                        />
                        <button className="w-full py-4 bg-romantic-accent text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                          Unlock Gift
                        </button>
                      </form>
                      {error && <p className="text-xs text-romantic-accent font-bold uppercase tracking-widest text-center">Incorrect word, try again!</p>}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-14 h-14 bg-romantic-warm rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🎁</div>
                      <p className="text-2xl font-serif italic font-bold text-romantic-accent mb-4">{selectedNote.label}</p>
                      <p className="text-xl italic leading-relaxed text-romantic-ink font-medium">{selectedNote.content}</p>
                      <div className="mt-10 flex justify-center">
                        <Heart fill="#FF85A1" className="w-10 h-10 text-romantic-accent animate-pulse" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    );
  };

  const DailyMessagePage = () => {
    const [msg, setMsg] = useState(DAILY_MESSAGES[0]);
    const [isLoading, setIsLoading] = useState(false);

    const generateNew = () => {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = DAILY_MESSAGES.filter(m => m !== msg);
        setMsg(filtered[Math.floor(Math.random() * filtered.length)]);
        setIsLoading(false);
      }, 1500);
    };

    return (
      <PageTransition>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-12">
          <h2 className="text-3xl font-serif italic font-bold">Daily Sunshine</h2>
          
          <div className="relative h-64 flex items-center justify-center w-full max-w-sm">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart fill="#FF85A1" className="w-16 h-16 text-romantic-accent" />
                  </motion.div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-romantic-accent animate-pulse">Finding a message...</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="p-12 card-vibrant border-romantic-soft bg-gradient-to-br from-white to-romantic-bg text-2xl italic font-bold leading-relaxed w-full relative h-full flex items-center justify-center"
                >
                  <div className="absolute top-4 left-4 text-4xl opacity-10">“</div>
                  <span className="relative z-10">{msg}</span>
                  <div className="absolute bottom-4 right-4 text-4xl opacity-10">”</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={generateNew}
            disabled={isLoading}
            className={`group flex flex-col items-center gap-4 transition-transform active:scale-95 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-romantic-soft to-romantic-warm text-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white group-hover:rotate-12 transition-transform">
              <Sparkles className={`w-10 h-10 ${isLoading ? 'animate-spin' : ''}`}/>
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-romantic-accent">Another Message</span>
          </button>
        </div>
      </PageTransition>
    );
  };

  const MiniGamePage = () => {
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState<{ id: number; x: number; isCaught?: boolean; isMissed?: boolean }[]>([]);

    useEffect(() => {
      const interval = setInterval(() => {
        setHearts(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10 }]);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const onFinish = (id: number, caught: boolean) => {
      setHearts(prev => prev.filter(p => p.id !== id));
    };

    return (
      <PageTransition>
        <div className="space-y-6 text-center">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-serif italic font-bold">Catch My Love</h2>
            <div className="bg-romantic-accent text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-romantic-accent/20">Score: {score}</div>
          </div>
          <div className="relative h-[60vh] glass rounded-[40px] overflow-hidden border-4 border-white bg-gradient-to-br from-romantic-box/40 to-romantic-lavender/40 shadow-inner">
            <AnimatePresence>
              {hearts.map(h => (
                <motion.button
                  key={h.id}
                  initial={{ y: -50, x: `${h.x}%`, scale: 0, opacity: 1 }}
                  animate={h.isCaught ? { scale: 2, opacity: 0, rotate: 15 } : { y: '70vh', scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: h.isCaught ? 0.3 : 3, ease: h.isCaught ? 'easeOut' : 'linear' }}
                  onClick={() => {
                    if (!h.isCaught) {
                      setScore(s => s + 1);
                      setHearts(prev => prev.map(p => p.id === h.id ? { ...p, isCaught: true } : p));
                    }
                  }}
                  onAnimationComplete={() => onFinish(h.id, !!h.isCaught)}
                  className={`absolute text-romantic-accent drop-shadow-lg transition-transform ${h.isCaught ? 'pointer-events-none' : 'hover:scale-125'}`}
                >
                  {h.isCaught ? (
                    <div className="relative">
                      <Heart fill="currentColor" className="w-10 h-10" />
                      <motion.span 
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -40 }}
                        className="absolute top-0 left-0 right-0 font-bold text-xs whitespace-nowrap"
                      >
                        GOT IT! ✨
                      </motion.span>
                    </div>
                  ) : (
                    <Heart fill="currentColor" className="w-10 h-10" />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
            {score === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-romantic-ink/40 font-bold uppercase tracking-widest text-sm">
                Catch as many as you can!
              </div>
            )}
          </div>
          <p className="text-sm italic text-romantic-ink/60 font-medium">Every heart caught is a message I'm sending you...</p>
        </div>
      </PageTransition>
    );
  };

  const FinalPage = () => (
    <PageTransition>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12">
        <motion.div
           animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 5, repeat: Infinity }}
           className="relative"
        >
          <div className="absolute inset-0 bg-romantic-soft rounded-full blur-3xl opacity-20 scale-150"></div>
          <Heart fill="#FF85A1" className="w-24 h-24 text-romantic-accent" />
        </motion.div>
        
        <div className="space-y-6 max-w-md">
          <p className="text-2xl font-serif italic font-medium leading-relaxed text-romantic-ink/80">
            "No matter how heavy your day feels, I hope this little website reminds you that you are not alone."
          </p>
          <h2 className="text-6xl font-serif italic font-bold text-romantic-accent">Palangga taka, Bao2.</h2>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="btn-outline-vibrant flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Visit home again
        </button>
      </div>
    </PageTransition>
  );

  const renderPage = () => {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/letter" element={<LetterPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/secrets" element={<SecretMessagesPage />} />
        <Route path="/daily" element={<DailyMessagePage />} />
        <Route path="/game" element={<MiniGamePage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    );
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-romantic-bg text-romantic-ink'}`}>
      <AnimatePresence>
        {showSplash && <Splash />}
      </AnimatePresence>

      <FloatingHearts />
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808f30302.mp3" />

      {/* Global Header */}
      <header className="sticky top-0 z-40 px-6 py-5 flex justify-between items-center glass backdrop-blur-xl border-b-2 border-white/50">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 text-romantic-ink font-serif italic text-2xl font-bold hover:scale-105 transition-transform"
        >
          <div className="w-10 h-10 bg-romantic-soft rounded-full flex items-center justify-center shadow-sm">
            <Heart fill="white" className="w-5 h-5 text-white" />
          </div>
          <span>my bao2</span>
        </button>
        <div className="flex gap-3">
          {showInstallBtn && (
            <button 
              onClick={handleInstallClick}
              className="p-3 rounded-2xl bg-romantic-accent text-white hover:bg-romantic-deep transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:bounce" />
              <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">Install</span>
            </button>
          )}
          <button 
            onClick={toggleMusic}
            className="p-3 rounded-2xl bg-white/40 hover:bg-white/60 text-romantic-accent transition-all shadow-sm active:scale-95"
          >
            {isMusicPlaying ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-2xl bg-white/40 hover:bg-white/60 text-romantic-accent transition-all shadow-sm active:scale-95"
          >
            {isDarkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 sm:p-10 relative">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
        
        {/* Subtle persistent credit */}
        <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none opacity-20 text-[10px] uppercase font-bold tracking-widest text-romantic-ink">
          made with love — xander james
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="sticky bottom-0 z-40 bg-white/60 backdrop-blur-2xl border-t-2 border-romantic-border px-4 py-3 flex justify-around items-center gap-2 no-scrollbar overflow-x-auto shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {[
          { id: '', icon: Sparkles, label: 'Home' },
          { id: 'letter', icon: BookOpen, label: 'Letter' },
          { id: 'mood', icon: Smile, label: 'Mood' },
          { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
          { id: 'music', icon: Music, label: 'Music' },
          { id: 'secrets', icon: Lock, label: 'Secrets' },
          { id: 'daily', icon: Sparkles, label: 'Daily' },
          { id: 'game', icon: Gamepad2, label: 'Game' },
        ].map(item => {
          const path = `/${item.id}`;
          const isActive = location.pathname === path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center p-3 rounded-[20px] min-w-[70px] transition-all relative ${isActive ? 'bg-romantic-accent text-white scale-110 shadow-lg shadow-romantic-accent/20' : 'text-romantic-ink/60 hover:bg-romantic-soft/20'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[9px] font-bold uppercase tracking-tighter mt-1">{item.label}</span>
              {isActive && (
                <motion.div layoutId="activeNav" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
