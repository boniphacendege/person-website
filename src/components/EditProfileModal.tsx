import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Check,
  User,
  Sparkles,
  Upload,
} from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>;
  language?: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
}) => {
  const isSwahili = language === 'Swahili';
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(profile.coverUrl);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setHandle(profile.handle);
      setTitle(profile.title);
      setBio(profile.bio);
      setAvatarUrl(profile.avatarUrl);
      setCoverUrl(profile.coverUrl);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Handle local image file upload for avatar
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local image file upload for cover banner
  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({
        name,
        handle,
        title,
        bio,
        avatarUrl,
        coverUrl,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const presetAvatars = [
    { label: 'Original Headshot', url: '/src/assets/images/boniphace_avatar_1791315268492.jpg' },
    { label: 'Executive Blazer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Studio Minimal', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { label: 'Creative Dark', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  ];

  const presetCovers = [
    { label: 'Architectural Studio', url: '/src/assets/images/boniphace_cover_1791315258070.jpg' },
    { label: 'Global Marketplace', url: '/src/assets/images/marketplace_banner_1791315289481.jpg' },
    { label: 'Digital Skyline', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85' },
    { label: 'Minimalist Workspace', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0e1d15] w-full max-w-2xl rounded-3xl border border-emerald-950/10 dark:border-emerald-500/20 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 px-6 border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between bg-slate-50/50 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-emerald-50">
                {isSwahili ? 'Hariri Wasifu & Taarifa za Chapa' : 'Edit Profile & Brand Information'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSwahili
                  ? 'Sasisha picha zako, wadhifa, maelezo binafsi na jina wakati wowote'
                  : 'Update your photos, title, bio and name anytime'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visual Showcase: Live Banner & Avatar Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/80 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Live Visual Preview (Banner & Avatar)
            </label>

            <div className="relative rounded-2xl overflow-hidden border border-emerald-950/15 dark:border-emerald-500/30 shadow-md">
              {/* Banner Image Preview */}
              <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                <img
                  src={coverUrl || '/src/assets/images/boniphace_cover_1791315258070.jpg'}
                  alt="Cover Banner Preview"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Cover File Upload Trigger */}
                <label className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5 cursor-pointer border border-white/20 transition-all shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFile}
                    className="hidden"
                  />
                </label>

                {/* Banner Live Text Preview */}
                <div className="absolute bottom-3 left-4 text-white max-w-md">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-300 block truncate">
                    {title || 'PERSONAL BRAND · CREATOR · ENTREPRENEUR'}
                  </span>
                  <strong className="text-lg font-black font-editorial block leading-none my-0.5 truncate">
                    {name || 'Ev Dr. Boniphace J. Ndege'}
                  </strong>
                </div>
              </div>

              {/* Avatar Image Overlay Preview */}
              <div className="p-4 bg-white dark:bg-[#0e1d15] flex items-center gap-4">
                <div className="relative -mt-12 shrink-0">
                  <img
                    src={avatarUrl || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                    alt="Avatar Preview"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-[#0e1d15] shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md ring-2 ring-white dark:ring-[#0e1d15] transition-all">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 min-w-0">
                  <strong className="block text-sm font-bold text-slate-900 dark:text-emerald-50 truncate">
                    {name}
                  </strong>
                  <span className="text-xs text-slate-400 block truncate">
                    {handle}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-100/70 truncate mt-0.5">
                    {bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset Imagery Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="block text-[11px] font-bold text-slate-500 dark:text-emerald-400/80 mb-2">
                Choose Avatar Photo Preset
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presetAvatars.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      avatarUrl === preset.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-emerald-700'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-500 dark:text-emerald-400/80 mb-2">
                Choose Cover Banner Preset
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presetCovers.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      coverUrl === preset.url
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-emerald-700'
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Direct URL Inputs for Custom External Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                Avatar Image URL / Path
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://... or /src/assets/..."
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                Banner Image URL / Path
              </label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://... or /src/assets/..."
                className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <hr className="border-emerald-950/10 dark:border-emerald-500/15" />

          {/* Profile Identity Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                  {isSwahili ? 'Jina Kamili la Kuonekana' : 'Full Display Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ev Dr. Boniphace J. Ndege"
                  required
                  className="w-full h-10 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                  {isSwahili ? 'Jina la Mtandao (Handle)' : 'Handle / Username'}
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@boniphacendege"
                  required
                  className="w-full h-10 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                {isSwahili ? 'Wadhifa / Kichwa cha Chapa' : 'Headline / Eyebrow Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isSwahili ? 'CHAPA BINAFSI · MUUNDAJI · MWEKEZAJI' : 'PERSONAL BRAND · CREATOR · ENTREPRENEUR'}
                required
                className="w-full h-10 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-emerald-400/70 mb-1">
                {isSwahili ? 'Wasifu / Maelezo ya Utume' : 'Bio / Mission Description'}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder={
                  isSwahili
                    ? 'Waeleze wageni kuhusu maono yako, vitabu, video na soko la dunia...'
                    : 'Tell visitors about your vision, ecosystem, books, videos and shopping...'
                }
                required
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-slate-900 dark:text-emerald-50 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-emerald-950/10 dark:border-emerald-500/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800/40 text-slate-700 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-950/50 text-xs font-bold transition-colors cursor-pointer"
            >
              {isSwahili ? 'Ghairi' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isSwahili ? 'Inahifadhi...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isSwahili ? 'Hifadhi Mabadiliko ya Wasifu' : 'Save Profile Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
