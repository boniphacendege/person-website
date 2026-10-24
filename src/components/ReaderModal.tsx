import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Clock,
  User,
  CheckCircle2,
  ArrowUp,
  Bookmark,
  Search,
  Download,
  CloudCheck,
  WifiOff,
  Sparkles,
  Layers,
  Edit3,
  ExternalLink,
  Save,
  Check,
} from 'lucide-react';
import { ReadingMaterial, BookChapter } from '../types';
import {
  saveMaterialForOffline,
  removeMaterialFromOffline,
  isMaterialSavedSync,
  saveReadingProgress,
  getReadingProgress,
} from '../utils/offlineStorage';

interface ReaderModalProps {
  material: ReadingMaterial | null;
  onClose: () => void;
  language?: string;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  material,
  onClose,
  language = 'English',
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(false);
  const [isOfflineSaving, setIsOfflineSaving] = useState<boolean>(false);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Active view mode: 'reader' | 'pdf_view' | 'type_within'
  const [viewMode, setViewMode] = useState<'reader' | 'pdf_view' | 'type_within'>('reader');

  // Chapter navigation state
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Reader Notes / Type Within state
  const [userNotes, setUserNotes] = useState<string>('');
  const [notesSavedToast, setNotesSavedToast] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isSwahili = language === 'Swahili';

  // Listen to browser online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize progress, view mode and load saved notes
  useEffect(() => {
    if (material) {
      const savedProgress = getReadingProgress(material.title);
      setScrollProgress(savedProgress || 0);
      setIsBookmarked(false);
      setIsSavedOffline(isMaterialSavedSync(material.title));
      setSearchQuery('');
      setOfflineToast(null);
      setActiveChapterIndex(0);
      setViewMode('reader');

      // Load saved notes from localStorage
      try {
        const stored = localStorage.getItem(`reader_notes_${material.title}`);
        if (stored) setUserNotes(stored);
        else setUserNotes('');
      } catch {
        setUserNotes('');
      }

      // Auto-cache active material into Cache API
      saveMaterialForOffline(material).catch(() => {});

      if (scrollContainerRef.current) {
        if (savedProgress > 5) {
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const target = scrollContainerRef.current;
              const maxScroll = target.scrollHeight - target.clientHeight;
              if (maxScroll > 0) {
                target.scrollTop = (savedProgress / 100) * maxScroll;
              }
            }
          }, 150);
        } else {
          scrollContainerRef.current.scrollTop = 0;
        }
      }
    }
  }, [material]);

  // Save notes locally
  const handleSaveNotes = () => {
    if (!material) return;
    try {
      localStorage.setItem(`reader_notes_${material.title}`, userNotes);
      setNotesSavedToast(true);
      setTimeout(() => setNotesSavedToast(false), 2000);
    } catch {}
  };

  const chapters: BookChapter[] = material?.chapters || [];
  const hasChapters = chapters.length > 0;
  const activeChapter = hasChapters ? chapters[activeChapterIndex] : null;

  // Active content being read
  const currentContentText = activeChapter ? activeChapter.content : (material?.content || '');

  // Compute matches count for search
  const matchesCount = useMemo(() => {
    if (!currentContentText || !searchQuery.trim()) return 0;
    try {
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = currentContentText.match(new RegExp(escaped, 'gi'));
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [currentContentText, searchQuery]);

  if (!material) return null;

  // Handle scroll and dynamically update reading progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollableDistance = target.scrollHeight - target.clientHeight;
    if (scrollableDistance <= 0) {
      setScrollProgress(100);
      saveReadingProgress(material.title, 100);
      return;
    }
    const currentProgress = Math.min(
      100,
      Math.max(0, Math.round((target.scrollTop / scrollableDistance) * 100))
    );
    setScrollProgress(currentProgress);
    saveReadingProgress(material.title, currentProgress);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle saving material for offline reading
  const handleToggleOfflineSave = async () => {
    setIsOfflineSaving(true);
    if (isSavedOffline) {
      const success = await removeMaterialFromOffline(material.title);
      if (success) {
        setIsSavedOffline(false);
        setOfflineToast(
          isSwahili
            ? 'Imeondolewa kwenye usomaji wa nje ya mtandao'
            : 'Removed from offline reading library'
        );
      }
    } else {
      const success = await saveMaterialForOffline(material);
      if (success) {
        setIsSavedOffline(true);
        setOfflineToast(
          isSwahili
            ? 'Imehifadhiwa! Unaweza kusoma bila mtandao (Cache API).'
            : 'Saved for offline reading! Available without connection.'
        );
      }
    }
    setIsOfflineSaving(false);
    setTimeout(() => setOfflineToast(null), 3000);
  };

  // Word count and calculated read time & time remaining
  const wordCount = currentContentText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedTotalMins = Math.max(1, Math.ceil(wordCount / 180));
  const wordsRemaining = Math.max(
    0,
    Math.round(wordCount * (1 - scrollProgress / 100))
  );
  const remainingMins = Math.max(0, Math.ceil(wordsRemaining / 180));
  const displayReadTime = material.readTime || `${estimatedTotalMins} min read`;

  const isBook = material.type === 'book';

  const fontSizeClasses = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
    lg: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
  };

  // Render highlighted text if search is active
  const renderHighlightedContent = () => {
    if (!searchQuery.trim()) {
      return currentContentText;
    }
    try {
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = currentContentText.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#ffd700] text-slate-950 font-bold px-1 rounded-sm shadow-xs"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return currentContentText;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#07160f] w-full max-w-4xl rounded-3xl border border-emerald-500/25 shadow-[0_0_36px_rgba(5,150,105,0.4),0_0_16px_rgba(255,215,0,0.25)] flex flex-col max-h-[94vh] overflow-hidden relative">
        {/* Top Reading Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-emerald-950/80 relative z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-[#ffd700] to-emerald-400 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(255,215,0,0.7)] relative"
            style={{ width: `${scrollProgress}%` }}
          >
            {scrollProgress > 0 && scrollProgress < 100 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffd700]" />
            )}
          </div>
        </div>

        {/* Sticky Header with Controls */}
        <div className="px-4 py-3 sm:px-6 border-b border-emerald-950/10 dark:border-emerald-500/15 bg-white/95 dark:bg-[#07160f]/95 backdrop-blur-md z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/25 text-[#ffd700] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(5,150,105,0.3)]">
              {isBook ? (
                <BookOpen className="w-4 h-4 text-[#ffd700]" />
              ) : (
                <FileText className="w-4 h-4 text-[#ffd700]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-[#ffd700]">
                  {isBook
                    ? isSwahili
                      ? 'Kitabu'
                      : 'Book'
                    : isSwahili
                    ? 'Makala'
                    : 'Article'}
                </span>
                {material.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ffd700]/15 text-slate-800 dark:text-[#ffd700] border border-[#ffd700]/30">
                    {material.category}
                  </span>
                )}
                {isSavedOffline && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <CloudCheck className="w-3 h-3 text-emerald-500" />
                    <span>{isSwahili ? 'Nje ya Mtandao' : 'Offline'}</span>
                  </span>
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 truncate font-editorial">
                {material.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
            {/* Search Input Field */}
            <div className="relative flex-1 sm:w-44 flex items-center bg-slate-100/90 dark:bg-emerald-950/60 rounded-xl px-2.5 py-1 border border-emerald-950/10 dark:border-emerald-500/25 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700] mr-1.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSwahili ? 'Tafuta...' : 'Search...'}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-emerald-50 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Offline Save Toggle */}
            <button
              type="button"
              onClick={handleToggleOfflineSave}
              disabled={isOfflineSaving}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                isSavedOffline
                  ? 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-600 dark:text-emerald-300 border-emerald-950/10 dark:border-emerald-500/20 hover:border-[#ffd700]/50'
              }`}
              title="Cache API offline storage"
            >
              {isSavedOffline ? (
                <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ffd700]" />
              )}
              <span className="hidden md:inline">
                {isSavedOffline ? (isSwahili ? 'Imehifadhiwa' : 'Saved') : (isSwahili ? 'Hifadhi' : 'Offline')}
              </span>
            </button>

            {/* Font Size Selector */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-emerald-950/60 rounded-xl p-0.5 border border-emerald-950/5 dark:border-emerald-500/20 text-[10px] font-bold">
              {(['sm', 'base', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFontSize(s)}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors ${
                    fontSize === s
                      ? 'bg-white dark:bg-emerald-800 text-emerald-700 dark:text-emerald-100 shadow-xs'
                      : 'text-slate-500 dark:text-emerald-300/70 hover:text-slate-900'
                  }`}
                >
                  {s === 'sm' ? 'A-' : s === 'base' ? 'A' : 'A+'}
                </button>
              ))}
            </div>

            {/* Reading Progress Indicator Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-[#ffd700] shrink-0 shadow-xs"
              title={isSwahili ? 'Maendeleo ya Usomaji' : 'Reading Progress'}
            >
              <div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" />
              <span>{scrollProgress}% {isSwahili ? 'imesomwa' : 'read'}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
              aria-label="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher Sub-header: Reader / Direct PDF-EPUB Viewer / Type Within */}
        <div className="px-4 sm:px-6 py-2 bg-slate-50 dark:bg-[#04160c] border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'reader'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-emerald-950'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Usomaji wa Maandishi / Sura' : 'Interactive Reader'}</span>
            </button>

            {Boolean(material.pdfUrl) && (
              <button
                type="button"
                onClick={() => setViewMode('pdf_view')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'pdf_view'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-emerald-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{isSwahili ? 'Kitabu cha PDF / EPUB (Direct)' : 'PDF / EPUB Viewer'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode('type_within')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'type_within'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-emerald-300 hover:bg-slate-200 dark:hover:bg-emerald-950'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Andika / Vidokezo Ndani (Type Within)' : 'Type / Notes Within'}</span>
            </button>
          </div>

          {/* Quick PDF Download link if available */}
          {material.pdfUrl && (
            <a
              href={material.pdfUrl}
              download={material.pdfFileName || `${material.title}.pdf`}
              className="text-[11px] font-bold text-emerald-600 dark:text-[#ffd700] hover:underline flex items-center gap-1 shrink-0"
              target="_blank"
              rel="noreferrer"
            >
              <Download className="w-3 h-3" />
              <span>{isSwahili ? 'Pakua Faili' : 'Download File'}</span>
            </a>
          )}
        </div>

        {/* Offline Notification Toast */}
        {offlineToast && (
          <div className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white text-xs font-semibold flex items-center justify-between shadow-md z-20">
            <span className="flex items-center gap-2">
              <CloudCheck className="w-4 h-4 text-[#ffd700]" />
              <span>{offlineToast}</span>
            </span>
            <button onClick={() => setOfflineToast(null)} className="text-white/80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 1: INTERACTIVE READER / CHAPTERS                    */}
        {/* ========================================================= */}
        {viewMode === 'reader' && (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 scroll-smooth relative"
          >
            {/* Sticky Reading Progress Indicator at top of modal content as user scrolls */}
            <div className="sticky top-0 z-20 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-4 px-6 sm:px-10 py-2.5 bg-white/95 dark:bg-[#07160f]/95 backdrop-blur-md border-b border-emerald-950/10 dark:border-emerald-500/20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#ffd700] shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-emerald-100 truncate max-w-[200px] sm:max-w-md">
                  {material.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-black text-emerald-700 dark:text-[#ffd700] bg-emerald-500/10 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                  {scrollProgress}% {isSwahili ? 'imesomwa' : 'read'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-emerald-300/70 hidden sm:inline flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500 inline" />
                  {wordsRemaining > 0
                    ? isSwahili
                      ? `dakika ~${remainingMins} zimebaki`
                      : `~${remainingMins} min remaining`
                    : isSwahili
                    ? 'Umemaliza'
                    : 'Completed'}
                </span>
              </div>
            </div>

            {/* Book Cover & Title Meta */}
            <div className="pb-6 border-b border-emerald-950/10 dark:border-emerald-500/15">
              {Boolean(material.coverUrl) && (
                <div className="mb-6 rounded-2xl overflow-hidden max-h-64 sm:max-h-72 w-full max-w-sm mx-auto bg-slate-900 border-2 border-[#ffd700]/30 shadow-xl">
                  <img
                    src={material.coverUrl || undefined}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-emerald-50 tracking-tight font-editorial leading-tight">
                {material.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-emerald-300/80 mt-4">
                {material.author && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {isSwahili ? 'Na' : 'By'} {material.author}
                  </span>
                )}

                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {displayReadTime}
                </span>

                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    isBookmarked ? 'text-emerald-600 dark:text-[#ffd700]' : 'hover:text-emerald-600'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? (isSwahili ? 'Imehifadhiwa' : 'Bookmarked') : 'Bookmark'}</span>
                </button>
              </div>

              {/* Chapter Navigator Selector Tabs (If structured chapters exist) */}
              {hasChapters && (
                <div className="mt-5 pt-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-emerald-300/70 block mb-2">
                    {isSwahili ? 'Chagua Sura ya Kusoma' : 'Select Chapter to Read'} ({chapters.length} {isSwahili ? 'sura' : 'chapters'}):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    {chapters.map((chap, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => {
                          setActiveChapterIndex(cIdx);
                          if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                        }}
                        className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                          activeChapterIndex === cIdx
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xs border border-[#ffd700]/40'
                            : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 border border-emerald-900/10 hover:border-[#ffd700]/40'
                        }`}
                      >
                        {chap.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Chapter Title (if viewing a chapter) */}
            {activeChapter && (
              <div className="pb-2">
                <span className="text-xs font-mono text-[#ffd700] uppercase font-bold tracking-wider">
                  Chapter {activeChapterIndex + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-emerald-100 font-editorial mt-1">
                  {activeChapter.title}
                </h2>
              </div>
            )}

            {/* Prose Content */}
            <div
              className={`font-editorial text-slate-800 dark:text-emerald-100/95 ${fontSizeClasses[fontSize]} whitespace-pre-line tracking-normal leading-relaxed`}
            >
              {renderHighlightedContent()}
            </div>

            {/* Chapter Navigation Buttons */}
            {hasChapters && (
              <div className="flex items-center justify-between pt-6 border-t border-emerald-950/10 dark:border-emerald-500/15">
                <button
                  type="button"
                  disabled={activeChapterIndex === 0}
                  onClick={() => {
                    setActiveChapterIndex((prev) => Math.max(0, prev - 1));
                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                  }}
                  className="px-4 py-2 rounded-xl border border-emerald-600/30 text-xs font-bold text-slate-700 dark:text-emerald-200 disabled:opacity-30 cursor-pointer"
                >
                  ← {isSwahili ? 'Sura Iliyopita' : 'Previous Chapter'}
                </button>

                <button
                  type="button"
                  disabled={activeChapterIndex >= chapters.length - 1}
                  onClick={() => {
                    setActiveChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1));
                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-30 cursor-pointer shadow-sm"
                >
                  {isSwahili ? 'Sura Inayofuata' : 'Next Chapter'} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: DIRECT PDF / EPUB VIEWER                         */}
        {/* ========================================================= */}
        {viewMode === 'pdf_view' && material.pdfUrl && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 bg-slate-900">
            <div className="flex items-center justify-between pb-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ffd700]" />
                <span className="font-bold text-white">
                  {material.pdfFileName || `${material.title}.pdf`}
                </span>
                {material.pdfFileSize && (
                  <span className="text-slate-400">({material.pdfFileSize})</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={material.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isSwahili ? 'Fungua Dirisha Jipya' : 'Open Full Screen'}</span>
                </a>
              </div>
            </div>

            {/* Embedded Native Viewer */}
            <div className="flex-1 min-h-[500px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30">
              <iframe
                src={`${material.pdfUrl}#toolbar=1&navpanes=1`}
                title={material.title}
                className="w-full h-full min-h-[500px] border-0"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 3: TYPE WITHIN / AUTHOR NOTES                       */}
        {/* ========================================================= */}
        {viewMode === 'type_within' && (
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-950/10 dark:border-emerald-500/15">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50 font-editorial flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#ffd700]" />
                  <span>{isSwahili ? 'Andika & Fanya Marejeo Ndani' : 'Type & Take Notes Within Book'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                  {isSwahili
                    ? 'Andika mawazo yako, maelezo, au rasimu ya sura mpya. Yatahifadhiwa kiotomatiki.'
                    : 'Type your reflections, study annotations, or draft new chapters directly inside this book.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f5d061] text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer hover:brightness-105"
              >
                {notesSavedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>{isSwahili ? 'Imehifadhiwa!' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSwahili ? 'Hifadhi Vidokezo' : 'Save Notes'}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              rows={12}
              placeholder={
                isSwahili
                  ? 'Andika maelezo yako au rasimu hapa...'
                  : 'Type your personal notes, summaries, or insights while reading this work...'
              }
              className="w-full p-4 text-sm bg-slate-50 dark:bg-[#03150b] border border-emerald-950/15 dark:border-emerald-500/30 rounded-2xl text-slate-900 dark:text-emerald-50 font-serif leading-relaxed focus:outline-none focus:border-[#ffd700]"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{userNotes.split(/\s+/).filter(Boolean).length} {isSwahili ? 'maneno' : 'words'}</span>
              <span>{isSwahili ? 'Imehifadhiwa ndani ya kifaa (LocalStorage)' : 'Autosaved locally'}</span>
            </div>
          </div>
        )}

        {/* Dedicated Bottom Footer Progress Bar */}
        <div className="px-5 py-2.5 bg-slate-50/95 dark:bg-[#07120d]/95 border-t border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between text-xs text-slate-500 dark:text-emerald-300/80 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md mr-4">
            <span className="font-bold text-[11px] whitespace-nowrap text-slate-700 dark:text-emerald-200">
              {isSwahili ? 'Maendeleo:' : 'Reading Progress:'}{' '}
              <span className="text-emerald-600 dark:text-[#ffd700]">{scrollProgress}%</span>
            </span>
            <div className="flex-1 h-2.5 bg-slate-200 dark:bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-950/5 dark:border-emerald-500/20 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#ffd700] to-emerald-400 transition-all duration-150 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-emerald-900/50 hover:bg-slate-200 dark:hover:bg-emerald-900/80 text-[11px] font-semibold flex items-center gap-1 transition-colors text-slate-700 dark:text-emerald-200 cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-3 h-3" />
              <span>{isSwahili ? 'Juu' : 'Top'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
