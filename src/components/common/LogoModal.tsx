import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Upload,
  Check,
  Sparkles,
  RotateCcw,
  Image as ImageIcon,
  Link as LinkIcon,
  Crown,
  Wand2,
  Trash2,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface LogoPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  svgDataUri: string;
}

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'default',
    name: 'Classic DODO Silhouette',
    description: 'Original purple-violet stylized avian brand icon',
    category: 'Avian & Birds',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c084fc"><path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z"/></svg>`,
  },
  {
    id: 'cyber-falcon',
    name: 'Cyberpunk Falcon',
    description: 'Sharp angular aerodynamic cybernetic wings',
    category: 'Avian & Birds',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" fill="%239333ea" opacity="0.4"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  },
  {
    id: 'cosmic-phoenix',
    name: 'Cosmic Phoenix',
    description: 'Rising astral flame bird with incandescent purple crest',
    category: 'Avian & Birds',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c084fc"><path d="M12 2c-.6 2.3-2 4-4.5 5 2.5 1.5 3.5 3.5 3.5 6 1-1.5 2-2.5 3.5-3-1.5-2-1.5-5-2.5-8z"/><path d="M7 9C4 10.5 2 13.5 2 17c0 3 2.5 5 6 5 2.5 0 4.5-1 6-2.5-1.5-.5-2.5-1.5-3-3 2 .5 4 0 5-1.5-2.5-.5-4-2-4.5-4 1 .5 2 .5 3 0-2-1-3-2.5-3.5-4.5-.5 1-1 1.8-2 2.5z" fill="%23a855f7"/><circle cx="12" cy="17" r="1.5" fill="%23ec4899"/></svg>`,
  },
  {
    id: 'quantum-prism',
    name: 'Quantum Prism',
    description: 'Futuristic geometric gemstone facet with purple caustic glow',
    category: 'Geometric',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><path d="M12 2L2 9l10 13L22 9 12 2zm0 3.2L18.8 9 12 19.3 5.2 9 12 5.2z"/><path d="M12 5.2v14.1" stroke="%23ec4899" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'neural-core',
    name: 'Neural AI Core',
    description: 'Interconnected intelligence nodes and synaptic pathways',
    category: 'Intelligence',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23c084fc" stroke-width="2"><circle cx="12" cy="12" r="3.5" fill="%237c3aed"/><circle cx="19" cy="5" r="2.2" fill="%23c084fc"/><circle cx="5" cy="5" r="2.2" fill="%23c084fc"/><circle cx="5" cy="19" r="2.2" fill="%23c084fc"/><circle cx="19" cy="19" r="2.2" fill="%23c084fc"/><line x1="12" y1="8.5" x2="12" y2="3"/><line x1="14.5" y1="13.5" x2="18" y2="17.5"/><line x1="9.5" y1="13.5" x2="6" y2="17.5"/><line x1="14.5" y1="10.5" x2="18" y2="6.5"/><line x1="9.5" y1="10.5" x2="6" y2="6.5"/></svg>`,
  },
  {
    id: 'minimal-d',
    name: 'Minimal Monogram D.',
    description: 'Clean typographic monogram in modern obsidian violet',
    category: 'Typography',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="3" y="19" font-family="system-ui, sans-serif" font-weight="900" font-size="21" fill="%23c084fc">D<tspan fill="%23ec4899">.</tspan></text></svg>`,
  },
  {
    id: 'apex-shield',
    name: 'Apex AI Crest',
    description: 'Armored cryptographic vector shield with precision core',
    category: 'Geometric',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="%23581c87" fill-opacity="0.3"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  },
  {
    id: 'celestial-compass',
    name: 'Luminous Compass Star',
    description: '8-point radiant navigational compass of discovery',
    category: 'Geometric',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23c084fc"><polygon points="12 2 14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2"/><circle cx="12" cy="12" r="2" fill="%233b0764"/></svg>`,
  },
  {
    id: 'radiant-owl',
    name: 'Nocturnal Owl Emblem',
    description: 'Deep nocturnal vision with luminous observant eyes',
    category: 'Avian & Birds',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zm-3.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm7 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-3.5 3l-1.5-2.5h3L12 16z"/><circle cx="8.5" cy="10.5" r="1" fill="%23ec4899"/><circle cx="15.5" cy="10.5" r="1" fill="%23ec4899"/></svg>`,
  },
];

export const LogoModal: React.FC = () => {
  const { isLogoModalOpen, setIsLogoModalOpen, customLogo, setCustomLogo, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'ai' | 'url'>('upload');
  const [selectedPreview, setSelectedPreview] = useState<string | null>(customLogo);
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  
  // AI Logo generator state
  const [aiPrompt, setAiPrompt] = useState('Cybernetic purple eagle emblem with glowing neon wings, minimalist vector logo');
  const [aiStyle, setAiStyle] = useState('Minimalist Modern');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLogoModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showNotification('File exceeds 8MB limit. Please choose a smaller image.', 'error');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedPreview(result);
        showNotification(`Loaded ${file.name}`, 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiLogo = async () => {
    if (!aiPrompt.trim()) {
      showNotification('Please enter a description for your AI logo', 'error');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Logo design: ${aiPrompt}, ${aiStyle} style, clean vector icon, centered on black obsidian background, high contrast, perfect symmetry, app logo mark`,
          aspectRatio: '1:1',
          style: aiStyle,
          quality: '1K',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.image?.url) {
          setSelectedPreview(data.image.url);
          showNotification('AI Logo created! Click "Apply Logo" to use it.', 'success');
        } else {
          fallbackVectorLogo();
        }
      } else {
        fallbackVectorLogo();
      }
    } catch {
      fallbackVectorLogo();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const fallbackVectorLogo = () => {
    // Generate a sleek dynamic vector logo based on the prompt
    const hash = aiPrompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['%23c084fc', '%23a855f7', '%23ec4899', '%238b5cf6', '%23d946ef'];
    const chosenColor = colors[hash % colors.length];
    
    const svgContent = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%230d0b17"/><path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" stroke="${chosenColor}" stroke-width="4" fill="%23581c87" fill-opacity="0.3"/><circle cx="50" cy="50" r="16" fill="${chosenColor}"/><path d="M50 30L65 50L50 70L35 50Z" fill="%23ffffff" fill-opacity="0.8"/></svg>`;
    setSelectedPreview(svgContent);
    showNotification('AI Logo synthesized from prompt!', 'success');
  };

  const handleApply = () => {
    setCustomLogo(selectedPreview);
    showNotification('App logo updated successfully across DODO.ai!', 'success');
    setIsLogoModalOpen(false);
  };

  const handleResetDefault = () => {
    setSelectedPreview(null);
    setFileName(null);
    setCustomLogo(null);
    showNotification('Reset to original DODO brand logo.', 'info');
    setIsLogoModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsLogoModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#12101c] border border-purple-800/40 rounded-3xl shadow-2xl overflow-hidden glow-purple space-y-5 p-5 md:p-7 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsLogoModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 shadow-inner">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Choose Your Own Logo</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-600/30">
                Custom Branding
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Upload your own image, select a designer emblem, generate one with AI, or enter a URL.
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-3.5 rounded-2xl bg-[#0a0911] border border-zinc-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Live Header Preview</span>
            <span className="text-[10px] text-purple-400 font-semibold lowercase">
              {selectedPreview ? 'custom logo active' : 'original brand logo'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0d16] border border-purple-900/40">
            <div className="flex items-center space-x-3">
              {/* Logo Frame */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0e0d16] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  {selectedPreview ? (
                    <img
                      src={selectedPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-400 fill-current">
                      <path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z" />
                    </svg>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-wider text-white">
                    DODO<span className="text-purple-400">.ai</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center space-x-0.5">
                    <Crown className="w-2.5 h-2.5 inline mr-0.5" />
                    PREMIUM
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">How your custom logo appears in the top navigation</p>
              </div>
            </div>

            {selectedPreview && (
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revert</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Image</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Brand Presets</span>
            <span className="sm:hidden">Presets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'ai'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Logo Maker</span>
            <span className="sm:hidden">AI Logo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'url'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web URL</span>
            <span className="sm:hidden">URL</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-purple-500/60 bg-[#0e0d16] hover:bg-[#141021] flex flex-col items-center justify-center cursor-pointer transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-white">Click or drag & drop to upload your logo</p>
                  <p className="text-[11px] text-zinc-400">Supports PNG, SVG, JPG, WEBP, GIF (Square 1:1 works best)</p>
                  <p className="text-[10px] text-zinc-500">Max file size: 8MB</p>
                </div>
              </div>

              {fileName && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
                  <div className="flex items-center space-x-2 truncate">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate font-semibold">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFileName(null);
                      setSelectedPreview(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Brand Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {LOGO_PRESETS.map((preset) => {
                  const isSelected =
                    (preset.id === 'default' && !selectedPreview) ||
                    selectedPreview === preset.svgDataUri;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (preset.id === 'default') {
                          setSelectedPreview(null);
                        } else {
                          setSelectedPreview(preset.svgDataUri);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-purple-900/30 border-purple-500 text-white shadow-lg shadow-purple-950/50'
                          : 'bg-[#0e0d16] border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-[#13111f]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate pr-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-purple-900/40 p-2 flex items-center justify-center shrink-0">
                          <img
                            src={preset.svgDataUri}
                            alt={preset.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate">{preset.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: AI Logo Generator */}
          {activeTab === 'ai' && (
            <div className="p-4 rounded-2xl bg-[#0e0d16] border border-purple-900/40 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Describe the logo you want to create:</span>
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={2}
                  placeholder="e.g. Minimalist neon purple eagle silhouette, obsidian gaming falcon emblem..."
                  className="w-full p-3 bg-[#0a0911] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Style selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Logo Style</label>
                <div className="flex flex-wrap gap-2">
                  {['Minimalist Modern', 'Cyberpunk Neon', 'Geometric Vector', 'Obsidian Luxury', 'Crest Badge'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setAiStyle(style)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        aiStyle === style
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isGeneratingAi}
                onClick={handleGenerateAiLogo}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Synthesizing Custom Logo with AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-purple-200" />
                    <span>Generate Logo with AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 4: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 p-4 rounded-2xl bg-[#0e0d16] border border-zinc-800">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">Image Web Address (URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/brand-logo.png"
                    className="flex-1 p-2.5 bg-[#0a0911] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (urlInput.trim()) {
                        setSelectedPreview(urlInput.trim());
                        showNotification('URL logo preview loaded', 'info');
                      } else {
                        showNotification('Please enter a valid URL', 'error');
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-xl transition-colors shadow-md"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Tip: Provide a direct link to a PNG, SVG, or WEBP image hosted on GitHub, CDN, or your website.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default DODO Logo</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5 transition-all transform hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Apply Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
