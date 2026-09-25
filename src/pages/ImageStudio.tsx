import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Upload,
  Download,
  Share2,
  RefreshCw,
  Layers,
  Wand2,
  Sliders,
  Eye,
  Check,
  Globe,
  Lock,
  ArrowRight,
  Maximize2,
  Scissors,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const { usage, recordUsageDeduction, setIsUpgradeModalOpen, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('Cybernetic peregrine falcon perched over futuristic neon rooftops of Lahore, atmospheric volumetric purple lighting, 8k resolution');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('Cinematic');
  const [quality, setQuality] = useState('1K');
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

  // Edit Tab State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editOperation, setEditOperation] = useState('replace_background');
  const [editedResult, setEditedResult] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'toggle'>('side-by-side');
  const [showOriginalInToggle, setShowOriginalInToggle] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const styles = [
    'Cinematic',
    'Photorealistic',
    'Cyberpunk Neon',
    '3D Octane Render',
    'Anime & Manga',
    'Digital Concept Art',
    'Oil Painting',
    'Dark Fantasy',
  ];

  const aspectRatios = [
    { label: '1:1 Square', value: '1:1' },
    { label: '16:9 Landscape', value: '16:9' },
    { label: '9:16 Reel / Story', value: '9:16' },
    { label: '4:3 Classic', value: '4:3' },
    { label: '3:4 Portrait', value: '3:4' },
  ];

  const quickEditActions = [
    { label: 'Replace Background', op: 'replace_background', prompt: 'Replace the background with a futuristic cyberpunk cityscape at night' },
    { label: 'Remove Background', op: 'remove_bg', prompt: 'Isolate the subject on a completely transparent studio background' },
    { label: 'Remove Objects', op: 'remove_object', prompt: 'Cleanly remove unwanted foreground clutter' },
    { label: 'Upscale & Enhance', op: 'upscale', prompt: 'Enhance details, sharpen edges, and upscale resolution to 4K' },
    { label: 'Change Clothing / Style', op: 'change_style', prompt: 'Change outfit to futuristic obsidian leather jacket with glowing purple accents' },
    { label: 'Color Grade to Neon Purple', op: 'color_grade', prompt: 'Color grade with cinematic deep violet shadows and cyan highlights' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (usage?.isLimitReached) {
      showNotification("You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.", 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsGenerating(true);
    recordUsageDeduction();

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style,
          quality,
          isPublic,
        }),
      });

      if (res.status === 429) {
        const errJson = await res.json();
        showNotification(errJson.error, 'error');
        setIsUpgradeModalOpen(true);
        setIsGenerating(false);
        return;
      }

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        showNotification('Image generated successfully!', 'success');
        if (isPublic) {
          showNotification('Published to DODO Public Community Gallery!', 'info');
        }
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err: any) {
      showNotification(err.message || 'Image generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setUploadedImage(res);
        setEditedResult(null);
        showNotification(`Uploaded ${file.name}`, 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessEdit = async () => {
    if (!uploadedImage || !editPrompt.trim()) return;

    if (usage?.isLimitReached) {
      showNotification("You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.", 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsEditing(true);
    recordUsageDeduction();

    try {
      const res = await fetch('/api/image/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          editInstruction: editPrompt,
          operationType: editOperation,
          isPublic,
        }),
      });

      if (res.status === 429) {
        const errJson = await res.json();
        showNotification(errJson.error, 'error');
        setIsUpgradeModalOpen(true);
        setIsEditing(false);
        return;
      }

      const data = await res.json();
      if (data.editedUrl) {
        setEditedResult(data.editedUrl);
        showNotification('AI editing complete!', 'success');
      }
    } catch (err: any) {
      showNotification(err.message || 'Edit processing failed', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = (imageUrl: string, format: 'png' | 'jpg' | 'webp' = 'png') => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `dodo-creation-${Date.now()}.${format}`;
    a.click();
    showNotification(`Downloaded image as .${format.toUpperCase()}`, 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Created with DODO.ai',
        text: prompt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/20">
        <div>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Image Studio & Workspace</h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Generate high-fidelity concepts from text or upload & execute surgical AI image manipulations.
          </p>
        </div>

        {/* Tab Switcher: Generate vs Edit */}
        <div className="flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Generate from Text
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upload & Edit Image
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        /* GENERATE TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5 bg-[#131021] p-5 md:p-6 rounded-2xl border border-purple-900/20 shadow-xl">
            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
                <span>Prompt Description</span>
                <span className="text-[10px] text-zinc-400 font-normal">Supports detailed styles & camera setups</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 bg-[#0e0d16] border border-zinc-800 focus:border-purple-500 rounded-xl text-sm text-white focus:outline-none resize-none"
                placeholder="Describe your scene in detail..."
              />
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Artistic Style</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left truncate transition-all ${
                      style === s
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    type="button"
                    onClick={() => setAspectRatio(ar.value)}
                    className={`px-2 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      aspectRatio === ar.value
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Quality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-400">Quality Output</span>
                {usage?.plan === 'free' && (
                  <span className="text-[10px] text-purple-400">4K available on Premium (₨300/mo)</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['1K', '2K', '4K'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      if (q === '4K' && usage?.plan === 'free') {
                        setIsUpgradeModalOpen(true);
                      } else {
                        setQuality(q);
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      quality === q
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {q} {q === '4K' && usage?.plan === 'free' ? '👑' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Setting (Default Private) */}
            <div className="p-3.5 rounded-xl bg-[#0e0d16] border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                  {isPublic ? <Globe className="w-3.5 h-3.5 text-purple-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{isPublic ? 'Public Community Post' : 'Private Creation (Default)'}</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {isPublic ? 'Will appear in DODO.ai public gallery' : 'Private to your account only'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  isPublic ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Neural Art...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>

          {/* Canvas & Preview Panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex-1 bg-[#131021] rounded-2xl border border-purple-900/20 p-4 flex flex-col justify-between shadow-xl min-h-[460px]">
              <div className="relative flex-1 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-3 p-8">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-600/30 border-t-purple-500 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-purple-200">Rendering visual layers with Gemini...</p>
                    <p className="text-xs text-zinc-500">Aspect ratio: {aspectRatio} • Style: {style}</p>
                  </div>
                ) : (
                  <img
                    src={generatedImage}
                    alt={prompt}
                    className="max-h-[520px] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                  />
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-400 truncate max-w-[200px]">
                    {style} • {aspectRatio}
                  </span>
                  {isPublic ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                      Public
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">
                      Private
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenerate()}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    title="Regenerate with same settings"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  {/* Download dropdowns */}
                  <div className="flex items-center rounded-lg bg-purple-600/20 border border-purple-500/30 overflow-hidden text-xs">
                    <button
                      onClick={() => handleDownload(generatedImage, 'png')}
                      className="px-2.5 py-1.5 text-purple-200 hover:bg-purple-600/30 font-semibold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => handleDownload(generatedImage, 'jpg')}
                      className="px-2 py-1.5 text-purple-300 hover:bg-purple-600/30 border-l border-purple-500/30"
                    >
                      JPG
                    </button>
                    <button
                      onClick={() => handleDownload(generatedImage, 'webp')}
                      className="px-2 py-1.5 text-purple-300 hover:bg-purple-600/30 border-l border-purple-500/30"
                    >
                      WEBP
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* UPLOAD & EDIT WORKFLOW TAB */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Upload & Commands Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-5 bg-[#131021] p-5 md:p-6 rounded-2xl border border-purple-900/20 shadow-xl">
              {/* Step 1: Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Step 1: Upload Source Image (PNG, JPG, WEBP)
                </label>
                <input
                  type="file"
                  ref={editFileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-zinc-800 hover:border-purple-500/50 bg-[#0e0d16] flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 group"
                >
                  <Upload className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                  <p className="text-xs font-semibold text-zinc-300">Click to upload your image</p>
                  <p className="text-[11px] text-zinc-400">JPG, PNG, WEBP up to 50MB</p>
                </div>
              </div>

              {/* Step 2: Quick Operations */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Step 2: Choose Desired Edit Operation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickEditActions.map((qa) => (
                    <button
                      key={qa.op}
                      type="button"
                      onClick={() => {
                        setEditOperation(qa.op);
                        setEditPrompt(qa.prompt);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                        editOperation === qa.op
                          ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                          : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Specific Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Step 3: Describe Specific Changes
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-[#0e0d16] border border-zinc-800 focus:border-purple-500 rounded-xl text-sm text-white focus:outline-none resize-none"
                  placeholder="e.g. remove background, change background to a moody rain street, add sunglasses..."
                />
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcessEdit}
                disabled={isEditing || !uploadedImage || !editPrompt.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AI Processing Image...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Apply AI Edit</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Comparison & Result Preview Panel (7 cols) */}
            <div className="lg:col-span-7 bg-[#131021] p-5 rounded-2xl border border-purple-900/20 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Result & Original Comparison
                </span>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setCompareMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg ${
                      compareMode === 'side-by-side' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    onClick={() => setCompareMode('toggle')}
                    className={`px-2.5 py-1 rounded-lg ${
                      compareMode === 'toggle' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Toggle View
                  </button>
                </div>
              </div>

              {/* Image Display */}
              <div className="flex-1 flex items-center justify-center min-h-[400px] bg-black/40 rounded-xl p-3">
                {!uploadedImage ? (
                  <div className="text-center space-y-2 text-zinc-500 p-8">
                    <ImageIcon className="w-10 h-10 mx-auto text-zinc-600" />
                    <p className="text-sm">Upload an image on the left to start editing</p>
                  </div>
                ) : compareMode === 'side-by-side' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                    {/* Original */}
                    <div className="flex flex-col space-y-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase">Original</span>
                      <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-square flex items-center justify-center">
                        <img src={uploadedImage} alt="Original" className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col space-y-1.5">
                      <span className="text-[11px] font-bold text-purple-400 uppercase">
                        AI Edited Result
                      </span>
                      <div className="rounded-xl overflow-hidden bg-zinc-950 border border-purple-600/30 aspect-square flex items-center justify-center">
                        {isEditing ? (
                          <div className="text-center space-y-2 p-4">
                            <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin mx-auto" />
                            <p className="text-xs text-purple-300">Applying changes...</p>
                          </div>
                        ) : editedResult ? (
                          <img src={editedResult} alt="Edited Result" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="text-center text-xs text-zinc-500 p-4">
                            Click "Apply AI Edit" to generate
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Toggle View */
                  <div className="relative w-full h-full max-h-[460px] flex flex-col items-center justify-center">
                    <img
                      src={showOriginalInToggle ? uploadedImage : (editedResult || uploadedImage)}
                      alt="Preview"
                      className="max-h-[420px] max-w-full object-contain rounded-lg"
                    />
                    <button
                      onMouseDown={() => setShowOriginalInToggle(true)}
                      onMouseUp={() => setShowOriginalInToggle(false)}
                      onTouchStart={() => setShowOriginalInToggle(true)}
                      onTouchEnd={() => setShowOriginalInToggle(false)}
                      className="mt-3 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg"
                    >
                      {showOriginalInToggle ? 'Showing Original' : 'Hold to View Original'}
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              {editedResult && (
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => handleDownload(editedResult, 'png')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Edited Result (PNG)</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
