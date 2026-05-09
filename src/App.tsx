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
  Info,
  Share2,
  Copy,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Calendar,
  Filter,
  Search,
  Mic,
  Square,
  Play,
  Pause,
  Star,
  Flower2,
  RotateCcw,
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
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };
  const [showSplash, setShowSplash] = useState(true);
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('userMemories');
    return saved ? JSON.parse(saved) : MEMORIES;
  });
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
    localStorage.setItem('userMemories', JSON.stringify(memories));
  }, [memories]);

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
          onClick={() => {
            setShowSplash(false);
            if (!isMusicPlaying) toggleMusic();
          }}
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
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const startEditing = (memory: Memory) => {
      setEditingMemoryId(memory.id);
      setShowUploadModal(true);
    };

    const handleCloseModal = () => {
      setShowUploadModal(false);
      setEditingMemoryId(null);
    };

    const filteredMemories = memories.filter(m => 
      m.caption.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const deleteMemory = (id: string) => {
      setMemories(memories.filter(m => m.id !== id));
      setDeleteConfirmId(null);
      if (activeIdx >= memories.length - 1) setActiveIdx(Math.max(0, memories.length - 2));
      showToast('Memory deleted successfully');
    };

    const filters = [
      { name: 'none', label: 'None' },
      { name: 'sepia', label: 'Sepia' },
      { name: 'grayscale', label: 'B&W' },
      { name: 'saturate-200', label: 'Vivid' },
      { name: 'brightness-125', label: 'Bright' }
    ];

    const currentFilterClass = (filterName: string) => {
      switch (filterName) {
        case 'sepia': return 'sepia';
        case 'grayscale': return 'grayscale';
        case 'saturate-200': return 'saturate-200';
        case 'brightness-125': return 'brightness-125';
        default: return '';
      }
    };

    function UploadModal() {
      const [step, setStep] = useState(editingMemoryId ? 2 : 1);
      const initialMemory = editingMemoryId 
        ? memories.find(m => m.id === editingMemoryId)! 
        : { image: '', caption: '', description: '', date: '', filter: 'none', voiceNote: '' };
      
      const [newMemory, setNewMemory] = useState(initialMemory);
      const [previewImage, setPreviewImage] = useState<string | null>(editingMemoryId ? initialMemory.image : null);
      const [isRecording, setIsRecording] = useState(false);
      const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
      const [recordingTime, setRecordingTime] = useState(0);
      const timerRef = useRef<any>(null);

      const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];

          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              setNewMemory(prev => ({ ...prev, voiceNote: reader.result as string }));
            };
            reader.readAsDataURL(blob);
            stream.getTracks().forEach(track => track.stop());
          };

          recorder.start();
          setMediaRecorder(recorder);
          setIsRecording(true);
          setRecordingTime(0);
          timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
        } catch (err) {
          console.error('Recording error:', err);
          showToast('Microphone access denied');
        }
      };

      const stopRecording = () => {
        if (mediaRecorder) {
          mediaRecorder.stop();
          setIsRecording(false);
          clearInterval(timerRef.current);
        }
      };

      const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
          showToast('Please select an image file 🖼️');
          return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          showToast('Image is too large. Max 5MB please!');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
          setNewMemory(prev => ({ ...prev, image: reader.result as string }));
          setStep(2);
        };
        reader.onerror = () => {
          showToast('Failed to read image. Try another one?');
        };
        reader.readAsDataURL(file);
      };

      const saveMemoryAction = () => {
        if (newMemory.image && newMemory.caption && newMemory.date) {
          if (editingMemoryId) {
            setMemories(memories.map(m => m.id === editingMemoryId ? { ...newMemory, id: editingMemoryId } : m));
            showToast('Memory updated! ✨');
          } else {
            const memoryToAdd: Memory = {
              id: Date.now().toString(),
              ...newMemory
            };
            setMemories([memoryToAdd, ...memories]);
            showToast('Memory saved beautifully! ✨');
          }
          handleCloseModal();
        }
      };

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-romantic-ink/40 backdrop-blur-md"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white glass p-8 rounded-[40px] max-w-md w-full relative shadow-2xl border-2 border-white max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={handleCloseModal} className="absolute top-6 right-6 p-2 hover:bg-romantic-soft/20 rounded-full transition-colors"><X/></button>
            
            <h3 className="text-2xl font-serif italic font-bold text-romantic-ink mb-6">
              {editingMemoryId ? 'Edit Memory' : 'Add New Memory'}
            </h3>
            
            <div className="space-y-6">
              {step === 1 ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-romantic-border rounded-3xl bg-romantic-bg/30">
                  <Camera className="w-12 h-12 text-romantic-accent mb-4 opacity-50" />
                  <p className="text-sm font-medium text-romantic-ink/60 mb-6 text-center px-6">Choose a photo that makes you smile</p>
                  <label className="btn-vibrant cursor-pointer">
                    Choose Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-inner border-2 border-white">
                    <img src={previewImage!} className={`w-full h-full object-cover ${currentFilterClass(newMemory.filter)}`} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                      {filters.map(f => (
                        <button
                          key={f.name}
                          onClick={() => setNewMemory(prev => ({ ...prev, filter: f.name }))}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${newMemory.filter === f.name ? 'bg-romantic-accent text-white shadow-md' : 'bg-romantic-bg text-romantic-ink/60 hover:bg-romantic-warm/30'}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Say something sweet about this..." 
                        className="w-full px-5 py-4 rounded-2xl bg-romantic-bg border-none outline-none font-medium italic text-romantic-ink placeholder:text-romantic-ink/30 focus:shadow-md transition-all pt-10"
                        value={newMemory.caption}
                        onChange={e => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
                      />
                      <span className="absolute top-4 left-5 text-[10px] uppercase font-bold tracking-widest text-romantic-accent opacity-50">Caption</span>
                    </div>

                    <div className="relative">
                      <textarea 
                        placeholder="Memory details..." 
                        className="w-full px-5 py-4 rounded-2xl bg-romantic-bg border-none outline-none font-medium text-romantic-ink placeholder:text-romantic-ink/30 focus:shadow-md transition-all pt-10 min-h-[100px] resize-none"
                        value={newMemory.description}
                        onChange={e => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <span className="absolute top-4 left-5 text-[10px] uppercase font-bold tracking-widest text-romantic-accent opacity-50">Detailed Description</span>
                    </div>

                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full px-5 py-4 rounded-2xl bg-romantic-bg border-none outline-none font-bold text-romantic-ink focus:shadow-md transition-all pt-10"
                        value={newMemory.date}
                        onChange={e => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                      />
                      <span className="absolute top-4 left-5 text-[10px] uppercase font-bold tracking-widest text-romantic-accent opacity-50">Memory Date</span>
                    </div>

                    <div className="bg-romantic-bg/30 p-5 rounded-2xl border-2 border-white/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-romantic-accent opacity-50">Voice Note</span>
                        {isRecording && (
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                             <span className="text-xs font-mono font-bold text-red-500">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                          </div>
                        )}
                      </div>
                      
                      {!isRecording ? (
                        <button 
                          onClick={startRecording}
                          type="button"
                          className="w-full py-3 bg-white hover:bg-romantic-soft/10 text-romantic-accent rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 border-romantic-accent/20"
                        >
                          <Mic className="w-4 h-4"/> 
                          {newMemory.voiceNote ? 'Re-record Voice Note' : 'Record Voice Note'}
                        </button>
                      ) : (
                        <button 
                          onClick={stopRecording}
                          type="button"
                          className="w-full py-3 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse"
                        >
                          <Square className="w-4 h-4 fill-current"/> Stop Recording
                        </button>
                      )}

                      {newMemory.voiceNote && !isRecording && (
                        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                          <button 
                            type="button"
                            onClick={() => {
                              const audio = new Audio(newMemory.voiceNote);
                              audio.play();
                            }}
                            className="p-2 bg-romantic-accent text-white rounded-full transition-transform active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-current"/>
                          </button>
                          <span className="text-xs text-romantic-ink/60 italic">Voice note recorded</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={saveMemoryAction}
                      disabled={!newMemory.caption || !newMemory.date}
                      className="w-full py-4 bg-romantic-accent text-white rounded-2xl font-bold shadow-lg shadow-romantic-accent/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Save Memory ✨
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full py-2 text-xs font-bold uppercase tracking-widest text-romantic-ink/40 hover:text-romantic-accent transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      );
    }

    if (memories.length === 0) {
      return (
        <PageTransition>
          <div className="flex flex-col items-center justify-center space-y-6 pt-10 text-center">
            <div className="w-20 h-20 bg-romantic-soft/20 rounded-full flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-romantic-accent opacity-40" />
            </div>
            <p className="text-romantic-ink/60 font-medium italic">No memories yet. Add your first one!</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-vibrant flex items-center gap-2"
            >
              <Plus className="w-5 h-5"/> Add Memory
            </button>
            {/* Modal placeholder logic below */}
          </div>
          {showUploadModal && <UploadModal />}
        </PageTransition>
      );
    }

    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="px-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif italic font-bold text-romantic-ink">Our Memories</h2>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-3 bg-romantic-accent text-white rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-6 h-6"/>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-romantic-ink/30" />
              <input 
                type="text" 
                placeholder="Search memories..." 
                aria-label="Search memories"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-2 border-romantic-border/30 outline-none focus:border-romantic-accent/40 focus:shadow-md transition-all font-medium text-romantic-ink"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredMemories.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-romantic-bg rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search className="w-6 h-6 text-romantic-ink/40" />
              </div>
              <p className="text-romantic-ink/60 font-medium italic">No memories found for "{searchQuery}"</p>
            </div>
          ) : (
            <>
              <div className="relative aspect-square sm:aspect-video rounded-[40px] overflow-hidden card-vibrant border-4 border-white/50 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={filteredMemories[activeIdx % filteredMemories.length]?.id}
                    src={filteredMemories[activeIdx % filteredMemories.length]?.image}
                    onClick={() => setZoomedIdx(memories.findIndex(m => m.id === filteredMemories[activeIdx % filteredMemories.length].id))}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    alt={filteredMemories[activeIdx % filteredMemories.length]?.caption}
                    className={`w-full h-full object-cover transition-all cursor-zoom-in ${currentFilterClass(filteredMemories[activeIdx % filteredMemories.length]?.filter || 'none')}`}
                  />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-romantic-ink/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white pointer-events-none">
                  <p className="text-xl font-serif italic font-medium">{filteredMemories[activeIdx % filteredMemories.length]?.caption}</p>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60 mt-1">{filteredMemories[activeIdx % filteredMemories.length]?.date}</p>
                </div>

                <button 
                  onClick={() => setActiveIdx(i => (i - 1 + filteredMemories.length) % filteredMemories.length)}
                  aria-label="Previous memory"
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white active:scale-90 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ChevronLeft className="w-6 h-6"/>
                </button>
                <button 
                  onClick={() => setActiveIdx(i => (i + 1) % filteredMemories.length)}
                  aria-label="Next memory"
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-all text-white active:scale-90 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ChevronRight className="w-6 h-6"/>
                </button>

                <button 
                  onClick={() => setDeleteConfirmId(filteredMemories[activeIdx % filteredMemories.length].id)}
                  aria-label="Delete memory"
                  className="absolute top-6 right-6 p-3 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="w-5 h-5"/>
                </button>

                <button 
                  onClick={() => startEditing(filteredMemories[activeIdx % filteredMemories.length])}
                  aria-label="Edit memory"
                  className="absolute top-6 right-20 p-3 bg-white/80 hover:bg-white rounded-full text-romantic-ink backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-romantic-accent"
                >
                  <Edit3 className="w-5 h-5"/>
                </button>
              </div>

              <div className="flex justify-center gap-2 pb-4 overflow-x-auto no-scrollbar max-w-full">
                {filteredMemories.map((m, i) => (
                  <button 
                    key={m.id} 
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-romantic-accent scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={m.image} className={`w-full h-full object-cover ${currentFilterClass(m.filter || 'none')}`} />
                  </button>
                ))}
              </div>
            </>
          )}

          <AnimatePresence>
            {zoomedIdx !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-romantic-ink/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10"
                onClick={() => setZoomedIdx(null)}
              >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-6 overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setZoomedIdx(null)} className="absolute -top-12 right-0 text-white hover:text-romantic-soft transition-colors"><X className="w-8 h-8" /></button>
                  <img src={memories[zoomedIdx].image} className={`w-full rounded-3xl shadow-2xl border-4 border-white/20 max-h-[60vh] object-contain ${currentFilterClass(memories[zoomedIdx].filter || 'none')}`} />
                  
                  <div className="text-center text-white space-y-4 max-w-2xl px-4 pb-10">
                    <div>
                      <p className="text-3xl font-serif italic font-medium">{memories[zoomedIdx].caption}</p>
                      <p className="text-sm uppercase tracking-widest font-bold opacity-60 mt-1">{memories[zoomedIdx].date}</p>
                    </div>

                    {memories[zoomedIdx].voiceNote && (
                      <div className="flex justify-center pt-2">
                        <button 
                          onClick={() => {
                            const audio = new Audio(memories[zoomedIdx!].voiceNote);
                            audio.play();
                          }}
                          className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md border border-white/30 transition-all font-bold text-sm active:scale-95 group"
                        >
                          <div className="w-8 h-8 bg-romantic-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </div>
                          Play Voice Note
                        </button>
                      </div>
                    )}

                    {memories[zoomedIdx].description && (
                      <div className="relative pt-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white/20" />
                        <p className="text-lg italic opacity-80 leading-relaxed font-light py-4">
                          {memories[zoomedIdx].description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {showUploadModal && <UploadModal />}

            {deleteConfirmId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-romantic-ink/40 backdrop-blur-md flex items-center justify-center p-6"
                onClick={() => setDeleteConfirmId(null)}
              >
                <div className="bg-white p-8 rounded-[30px] border-2 border-white shadow-2xl max-w-sm w-full text-center space-y-6" onClick={e => e.stopPropagation()}>
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-romantic-ink">Delete Memory?</h3>
                    <p className="text-romantic-ink/60 italic">This memory will be lost forever. Are you sure?</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 py-3 bg-romantic-bg hover:bg-romantic-warm/30 text-romantic-ink rounded-2xl font-bold transition-all"
                    >
                      Wait, no!
                    </button>
                    <button 
                      onClick={() => deleteMemory(deleteConfirmId)}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all"
                    >
                      Yes, delete
                    </button>
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
                    aria-label={`View note for ${song.title}`}
                    className="p-2 hover:bg-romantic-soft/10 rounded-full transition-colors text-romantic-accent focus:outline-none focus:ring-2 focus:ring-romantic-accent"
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
                aria-label={`Open ${note.label}`}
                className="p-8 glass rounded-[40px] flex flex-col items-center text-center space-y-4 hover:scale-105 transition-all group border-romantic-border focus:outline-none focus:ring-2 focus:ring-romantic-accent"
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
    const GRID_SIZE = 6;
    const INITIAL_TIME = 30;
    const CANDIES = [
      { icon: Heart, color: 'text-romantic-accent', fill: '#FF85A1', id: 'heart' },
      { icon: Star, color: 'text-yellow-400', fill: '#FACC15', id: 'star' },
      { icon: Sparkles, color: 'text-purple-400', id: 'sparkles' },
      { icon: Smile, color: 'text-orange-400', id: 'smile' },
      { icon: Flower2, color: 'text-green-400', id: 'flower' }
    ];

    const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
    const [grid, setGrid] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('matchGameHighScore') || 0));
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [combo, setCombo] = useState(1);
    const [showCombo, setShowCombo] = useState(false);
    const [level, setLevel] = useState(1);
    const [timeAdded, setTimeAdded] = useState<{ id: number; amount: number } | null>(null);

    const createGrid = () => {
      const newGrid = [];
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const randomCandy = CANDIES[Math.floor(Math.random() * CANDIES.length)];
        newGrid.push({ ...randomCandy, gridId: Math.random() });
      }
      setGrid(newGrid);
      setScore(0);
      setCombo(1);
      setLevel(1);
      setTimeLeft(INITIAL_TIME);
    };

    useEffect(() => {
      if (gameState === 'playing' && grid.length === 0) {
        createGrid();
      }
    }, [gameState]);

    useEffect(() => {
      if (gameState !== 'playing') return;

      const timerIdx = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerIdx);
    }, [gameState]);

    useEffect(() => {
      if (gameState === 'ended' && score > highScore) {
        setHighScore(score);
        localStorage.setItem('matchGameHighScore', score.toString());
        showToast('New High Score! 🏆');
      }
    }, [gameState, score, highScore]);

    // Difficulty scaling
    useEffect(() => {
      const nextLevel = Math.floor(score / 500) + 1;
      if (nextLevel > level) {
        setLevel(nextLevel);
        showToast(`Level Up! Difficulty Increased 🚀`);
      }
    }, [score, level]);

    const checkMatches = (currentGrid: any[]) => {
      if (!currentGrid || currentGrid.length === 0) return [];
      const matches = new Set<number>();

      // Horizontal
      for (let row = 0; row < GRID_SIZE; row++) {
        let matchLength = 1;
        for (let col = 0; col < GRID_SIZE; col++) {
          const idx = row * GRID_SIZE + col;
          const nextIdx = idx + 1;
          
          if (col < GRID_SIZE - 1 && currentGrid[idx].id === currentGrid[nextIdx].id) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = 0; i < matchLength; i++) {
                matches.add(idx - i);
              }
            }
            matchLength = 1;
          }
        }
      }

      // Vertical
      for (let col = 0; col < GRID_SIZE; col++) {
        let matchLength = 1;
        for (let row = 0; row < GRID_SIZE; row++) {
          const idx = row * GRID_SIZE + col;
          const nextIdx = (row + 1) * GRID_SIZE + col;
          
          if (row < GRID_SIZE - 1 && currentGrid[idx].id === currentGrid[nextIdx].id) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = 0; i < matchLength; i++) {
                matches.add(idx - i * GRID_SIZE);
              }
            }
            matchLength = 1;
          }
        }
      }

      return Array.from(matches);
    };

    const processMatches = async (currentGrid: any[], currentCombo: number = 1) => {
      const matchedIndices = checkMatches(currentGrid);
      if (matchedIndices.length === 0) {
        setIsProcessing(false);
        setCombo(1);
        return;
      }

      setIsProcessing(true);
      setCombo(currentCombo);
      if (currentCombo > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 800);
      }

      const basePoints = matchedIndices.length * 10;
      const countBonus = matchedIndices.length > 3 ? (matchedIndices.length - 3) * 15 : 0;
      const totalPointsAdded = (basePoints + countBonus) * currentCombo;
      
      // Calculate time bonus: level reduces bonus, combo increases it
      const timeBonus = Math.max(1, Math.floor((matchedIndices.length * 0.5 * currentCombo) / (level * 0.5)));
      
      setScore(s => s + totalPointsAdded);
      setTimeLeft(prev => Math.min(60, prev + timeBonus));
      setTimeAdded({ id: Date.now(), amount: timeBonus });
      setTimeout(() => setTimeAdded(null), 1000);

      // Clear matches
      const newGrid = [...currentGrid];
      matchedIndices.forEach(idx => {
        newGrid[idx] = { ...newGrid[idx], cleared: true };
      });
      setGrid([...newGrid]);

      await new Promise(resolve => setTimeout(resolve, 300));

      // Drop down
      for (let col = 0; col < GRID_SIZE; col++) {
        let emptySpaces = 0;
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          const idx = row * GRID_SIZE + col;
          if (newGrid[idx].cleared) {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            newGrid[idx + emptySpaces * GRID_SIZE] = newGrid[idx];
            newGrid[idx] = { cleared: true };
          }
        }
        
        // Fill top
        for (let i = 0; i < emptySpaces; i++) {
          const randomCandy = CANDIES[Math.floor(Math.random() * CANDIES.length)];
          newGrid[i * GRID_SIZE + col] = { ...randomCandy, gridId: Math.random() };
        }
      }

      const finalGrid = newGrid.map(c => ({ ...c, cleared: false }));
      setGrid(finalGrid);
      
      setTimeout(() => processMatches(finalGrid, currentCombo + 1), 300);
    };

    const handleCellClick = async (idx: number) => {
      if (isProcessing || gameState !== 'playing') return;

      if (selectedId === null) {
        setSelectedId(idx);
      } else {
        const diff = Math.abs(selectedId - idx);
        const isAdjacent = (diff === 1 && Math.floor(selectedId / GRID_SIZE) === Math.floor(idx / GRID_SIZE)) || diff === GRID_SIZE;

        if (isAdjacent) {
          const newGrid = [...grid];
          const temp = newGrid[selectedId];
          newGrid[selectedId] = newGrid[idx];
          newGrid[idx] = temp;
          
          setGrid(newGrid);
          setSelectedId(null);
          
          const matches = checkMatches(newGrid);
          if (matches.length > 0) {
            processMatches(newGrid);
          } else {
            setTimeout(() => {
              const revertGrid = [...newGrid];
              const t = revertGrid[selectedId];
              revertGrid[selectedId] = revertGrid[idx];
              revertGrid[idx] = t;
              setGrid(revertGrid);
              showToast('No match! Try another one? 🙊');
            }, 300);
          }
        } else {
          setSelectedId(idx);
        }
      }
    };

    const startGame = () => {
      createGrid();
      setGameState('playing');
    };

    return (
      <PageTransition>
        <div className="space-y-6 max-w-lg mx-auto text-center px-4">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <h2 className="text-3xl font-serif italic font-bold text-romantic-ink">Sweet Bao Match</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-romantic-accent/10 md:px-2 py-0.5 rounded-full font-bold text-romantic-accent uppercase tracking-widest border border-romantic-accent/20">
                  Level {level}
                </span>
                <p className="text-xs font-bold text-romantic-ink/40 uppercase tracking-widest">Record: {highScore}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {timeAdded && (
                    <motion.div 
                      key={timeAdded.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-green-500 font-bold text-xs"
                    >
                      +{timeAdded.amount}s
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={`px-4 py-1.5 rounded-2xl font-mono font-bold shadow-sm transition-colors ${timeLeft < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-romantic-ink'}`}>
                  {timeLeft}s
                </div>
              </div>
              <div className="bg-romantic-accent text-white px-6 py-2 rounded-2xl font-bold shadow-lg shadow-romantic-accent/20 flex items-center gap-2">
                <Sparkles size={16} />
                <span className="tabular-nums">{score}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/40 p-3 rounded-[40px] border-4 border-white shadow-xl backdrop-blur-sm relative overflow-hidden">
            <AnimatePresence>
              {gameState === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-20 h-20 bg-romantic-soft rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Heart fill="white" className="w-10 h-10 text-white animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-serif italic font-bold text-romantic-ink mb-2">Match the Sweets!</h3>
                  <p className="text-sm text-romantic-ink/60 mb-6 max-w-xs italic line-clamp-3">
                    Bao2, match 3 or more sweet icons to gain love points and extra time! How long can you keep the love going?
                  </p>
                  <button 
                    onClick={startGame}
                    className="w-full max-w-[200px] py-4 bg-romantic-accent text-white rounded-2xl font-bold shadow-xl shadow-romantic-accent/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Start Playing
                  </button>
                </motion.div>
              )}

              {gameState === 'ended' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-[30] bg-romantic-ink/90 backdrop-blur-lg flex flex-col items-center justify-center p-8 text-center text-white"
                >
                  <div className="text-5xl mb-4">🍯</div>
                  <h3 className="text-3xl font-serif italic font-bold mb-2">Sweet Time's Up!</h3>
                  <div className="space-y-1 mb-8">
                    <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Your Love Score</p>
                    <p className="text-6xl font-bold text-romantic-soft">{score}</p>
                    <p className="text-xs text-white/60">Reached Level {level}</p>
                  </div>
                  <div className="flex gap-4 w-full max-w-xs">
                    <button 
                      onClick={startGame}
                      className="flex-1 py-4 bg-white text-romantic-ink rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95"
                    >
                      Retry
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="flex-1 py-4 bg-white/10 text-white border-2 border-white/20 rounded-2xl font-bold hover:bg-white/5 transition-all active:scale-95"
                    >
                      Exit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              className="grid gap-2" 
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {grid.map((candy, i) => (
                <motion.button
                  key={candy.gridId}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: candy.cleared ? 0 : 1,
                    rotate: candy.cleared ? 90 : 0
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCellClick(i)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all relative ${
                    selectedId === i 
                      ? 'bg-romantic-accent/20 ring-4 ring-romantic-accent ring-inset' 
                      : 'bg-white/60 hover:bg-white shadow-sm'
                  } ${candy.cleared ? 'opacity-0' : 'opacity-100'}`}
                >
                  <candy.icon 
                    className={`w-2/3 h-2/3 ${candy.color}`} 
                    fill={candy.fill || 'none'} 
                  />
                </motion.button>
              ))}
            </div>
            
            <AnimatePresence>
              {showCombo && combo > 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1.2, y: -40 }}
                  exit={{ opacity: 0, y: -60 }}
                  className="absolute bottom-12 left-0 right-0 pointer-events-none"
                >
                  <span className="px-6 py-2 bg-romantic-accent text-white rounded-full text-lg font-black italic shadow-2xl shadow-romantic-accent/40 ring-4 ring-white">
                    {combo}x COMBO! 💖
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={createGrid}
              className="flex-1 py-4 bg-white text-romantic-ink rounded-3xl font-bold border-2 border-white/50 shadow-lg hover:bg-romantic-soft/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5"/> Reset Grid
            </button>
            <button 
              onClick={() => showToast('Match 3 to earn points and TIME! 🍬')}
              className="px-6 py-4 bg-romantic-accent text-white rounded-3xl font-bold shadow-xl shadow-romantic-accent/20 transition-all active:scale-95"
            >
              <Info className="w-5 h-5"/>
            </button>
          </div>
          
          <p className="text-[10px] text-romantic-ink/40 font-bold uppercase tracking-[0.2em] animate-pulse">
            {gameState === 'playing' ? `Difficulty Level ${level} in effect` : "Sweet Bao Match 2.0"}
          </p>
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

  const AboutPage = () => (
    <PageTransition>
      <div className="space-y-8 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-romantic-soft rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Info className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-serif italic font-bold text-romantic-ink">About my bao2</h2>
          <p className="text-romantic-ink/60 italic font-medium">A space built with love, for everything we share.</p>
        </div>

        <div className="grid gap-6">
          {[
            {
              title: "Digital Love Letter",
              desc: "A timeless letter that grows with our story, accessible whenever you need a reminder.",
              icon: BookOpen
            },
            {
              title: "Memory Vault",
              desc: "Capture and preserve our favorite moments together with photos, dates, and voice notes.",
              icon: ImageIcon
            },
            {
              title: "Shared Atmosphere",
              desc: "A personalized playlist and mood-based interactions designed for your comfort.",
              icon: Heart
            },
            {
              title: "Safe & Private",
              desc: "Everything here is stored locally on your device, just for you.",
              icon: Lock
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-[32px] border-2 border-white/50 flex gap-4 items-start"
            >
              <div className="p-3 bg-romantic-bg rounded-2xl text-romantic-accent">
                <feature.icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-romantic-ink">{feature.title}</h3>
                <p className="text-sm text-romantic-ink/70 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-xs uppercase font-bold tracking-[0.3em] text-romantic-accent opacity-50">
            Version 2.0 — Forever & Always
          </p>
        </div>
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    );
  };

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-romantic-bg text-romantic-ink'}`}>
      <AnimatePresence>
        {showSplash && <Splash />}
      </AnimatePresence>

      <FloatingHearts />
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808f30302.mp3" 
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onError={() => showToast('Music playback failed. Check your connection.')}
      />

      {/* Global Header */}
      <header className="sticky top-0 z-40 px-6 py-5 flex justify-between items-center glass backdrop-blur-xl border-b-2 border-white/50">
        <button 
          onClick={() => navigate('/')} 
          aria-label="Go to Home"
          className="flex items-center gap-3 text-romantic-ink font-serif italic text-2xl font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-romantic-accent rounded-xl"
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
              aria-label="Install app"
              className="p-3 rounded-2xl bg-romantic-accent text-white hover:bg-romantic-deep transition-all shadow-lg active:scale-95 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-romantic-accent"
            >
              <Download className="w-5 h-5 group-hover:bounce" />
              <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">Install</span>
            </button>
          )}
          <button 
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            className="p-3 rounded-2xl bg-white/40 hover:bg-white/60 text-romantic-accent transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-romantic-accent"
          >
            {isMusicPlaying ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-3 rounded-2xl bg-white/40 hover:bg-white/60 text-romantic-accent transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-romantic-accent"
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
          { id: 'about', icon: Info, label: 'About' },
        ].map(item => {
          const path = `/${item.id}`;
          const isActive = location.pathname === path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(path)}
              aria-label={item.label}
              className={`flex flex-col items-center p-3 rounded-[20px] min-w-[70px] transition-all relative focus:outline-none focus:ring-2 focus:ring-romantic-accent ${isActive ? 'bg-romantic-accent text-white scale-110 shadow-lg shadow-romantic-accent/20' : 'text-romantic-ink/60 hover:bg-romantic-soft/20'}`}
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

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-romantic-ink/90 backdrop-blur-xl text-white rounded-full font-bold shadow-2xl border border-white/20 flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-romantic-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
