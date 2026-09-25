import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Play,
  Pause,
  Upload,
  Download,
  Share2,
  Sparkles,
  Scissors,
  Film,
  Music,
  Sliders,
  Volume2,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const VideoStudio: React.FC = () => {
  const { usage, recordUsageDeduction, setIsUpgradeModalOpen, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');

  // Generator State
  const [prompt, setPrompt] = useState('Bioluminescent manta ray soaring through deep neon violet cyber ocean, volumetric caustic light rays, 8k cinematic slow motion');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [motionStyle, setMotionStyle] = useState('Smooth Camera Orbit');
  const [visualStyle, setVisualStyle] = useState('Cinematic 8K');
  const [addMusic, setAddMusic] = useState(true);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );

  // Editor State
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState('');
  const [editAction, setEditAction] = useState('captions');
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [editedVideoResult, setEditedVideoResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRefInput = useRef<HTMLInputElement>(null);

  const motions = [
    'Smooth Camera Orbit',
    'Dynamic Forward Push',
    'Hyperlapse Zoom',
    'Slow Cinematic Pan',
    'Drone Aerial Descent',
    'Steady Subject Lock',
  ];

  const editPresets = [
    { id: 'captions', label: 'Generate AI Subtitles', prompt: 'Auto-detect spoken dialogue and overlay stylish animated kinetic subtitles' },
    { id: 'social', label: 'Convert to 9:16 Reel', prompt: 'Crop and reframe central subject dynamically for TikTok / Instagram Reels' },
    { id: 'denoise', label: 'Remove Audio Noise', prompt: 'Isolate vocal track, remove ambient background noise, and master vocal frequencies' },
    { id: 'style', label: 'Cyberpunk Color Grade', prompt: 'Apply cinematic high-contrast neon purple and cyan grading to the entire video' },
    { id: 'trim', label: 'Extract Highlight Clip', prompt: 'Identify most engaging visual climax and trim to 5-second dynamic teaser' },
  ];

  const handleStartGeneration = async () => {
    if (!prompt.trim()) return;

    if (usage?.isLimitReached) {
      showNotification("You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.", 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage('Prompt Scripting & Compositional Analysis');
    recordUsageDeduction();

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
          style: visualStyle,
          motion: motionStyle,
          music: addMusic,
          referenceImage,
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
      const taskId = data.taskId;

      // Poll progress simulation
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/video/status/${taskId}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            const task = statusData.task;
            setGenerationProgress(task.progress);
            setGenerationStage(task.stage);

            if (task.status === 'completed') {
              clearInterval(interval);
              setIsGenerating(false);
              if (task.videoUrl) {
                setCurrentVideoUrl(task.videoUrl);
              }
              showNotification('Video generated successfully!', 'success');
            }
          }
        } catch {
          // ignore transient poll error
        }
      }, 1000);
    } catch (err: any) {
      showNotification(err.message || 'Video generation failed', 'error');
      setIsGenerating(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setEditedVideoResult(null);
      showNotification(`Uploaded video: ${file.name}`, 'info');
    }
  };

  const handleProcessVideoEdit = async () => {
    if (!uploadedVideo || !editInstruction.trim()) return;

    if (usage?.isLimitReached) {
      showNotification("You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.", 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsProcessingEdit(true);
    recordUsageDeduction();

    try {
      const res = await fetch('/api/video/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: uploadedVideo,
          editInstruction,
          action: editAction,
        }),
      });

      const data = await res.json();
      if (data.editedVideo) {
        setEditedVideoResult(data.editedVideo);
        showNotification('AI video edit finished!', 'success');
      }
    } catch (err: any) {
      showNotification(err.message || 'Video edit failed', 'error');
    } finally {
      setIsProcessingEdit(false);
    }
  };

  const handleDownload = (videoUrl: string) => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `dodo-video-${Date.now()}.mp4`;
    a.target = '_blank';
    a.click();
    showNotification('Starting video download...', 'success');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/20">
        <div>
          <div className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">AI Video Studio & Editor</h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Generate cinematic AI video sequences from text or execute timeline edits on existing footage.
          </p>
        </div>

        {/* Workspace Mode Switcher */}
        <div className="flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Video Generation
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Video Editor
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        /* VIDEO GENERATION TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5 bg-[#131021] p-5 md:p-6 rounded-2xl border border-purple-900/20 shadow-xl">
            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
                <span>Cinematic Prompt</span>
                <span className="text-[10px] text-zinc-400 font-normal">Veo Neural Architecture</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 bg-[#0e0d16] border border-zinc-800 focus:border-purple-500 rounded-xl text-sm text-white focus:outline-none resize-none"
                placeholder="Describe lighting, camera trajectory, motion, and scene details..."
              />
            </div>

            {/* Starting Image Animation Option */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-400">
                  Animate Starting Image (Optional)
                </span>
                {referenceImage && (
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Clear Image
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={imageRefInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setReferenceImage(ev.target?.result as string);
                    reader.readAsDataURL(f);
                  }
                }}
                accept="image/*"
                className="hidden"
              />
              {referenceImage ? (
                <div className="relative rounded-xl overflow-hidden h-20 bg-zinc-950 border border-purple-600/40 flex items-center justify-center">
                  <img src={referenceImage} alt="Starting Frame" className="h-full w-auto object-cover" />
                  <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-purple-300">
                    Image to Video
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageRefInput.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-800 hover:border-purple-600/50 text-xs text-zinc-400 hover:text-purple-300 flex items-center justify-center space-x-2 transition-colors bg-[#0e0d16]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Reference Frame to Animate</span>
                </button>
              )}
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      aspectRatio === '16:9'
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    16:9 Wide
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      aspectRatio === '9:16'
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400'
                    }`}
                  >
                    9:16 Reel
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Duration</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[3, 5, 7].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        duration === sec
                          ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                          : 'bg-[#0e0d16] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Motion Trajectory */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Camera Motion</label>
              <select
                value={motionStyle}
                onChange={(e) => setMotionStyle(e.target.value)}
                className="w-full p-2.5 bg-[#0e0d16] border border-zinc-800 focus:border-purple-500 rounded-xl text-xs text-white focus:outline-none"
              >
                {motions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Audio & Music */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0d16] border border-zinc-800">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white">Generate Neural Ambient Soundscape</span>
              </div>
              <input
                type="checkbox"
                checked={addMusic}
                onChange={(e) => setAddMusic(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 bg-zinc-900 border-zinc-700"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleStartGeneration}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Video Stream...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Video Clip</span>
                </>
              )}
            </button>
          </div>

          {/* Video Player & Stage Progress (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex-1 bg-[#131021] rounded-2xl border border-purple-900/20 p-5 flex flex-col justify-between shadow-xl min-h-[460px]">
              {/* Progress State or Video Player */}
              <div className="relative flex-1 rounded-xl overflow-hidden bg-black flex items-center justify-center min-h-[380px]">
                {isGenerating ? (
                  <div className="text-center space-y-4 p-8 max-w-md">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-600/30 border-t-purple-400 animate-spin mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-white">{generationStage}</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        High-compute video diffusion models require a short synthesis cycle.
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${generationProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-purple-300 font-bold">{generationProgress}% Completed</span>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={currentVideoUrl}
                    className="w-full h-full max-h-[480px] object-contain rounded-lg"
                    controls
                    autoPlay
                    loop
                  />
                )}
              </div>

              {/* Video Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-300 font-medium">
                    {aspectRatio} • {duration}s • 60fps
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Veo Model Preview
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStartGeneration()}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={() => handleDownload(currentVideoUrl)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI VIDEO EDITOR TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5 bg-[#131021] p-5 md:p-6 rounded-2xl border border-purple-900/20 shadow-xl">
            {/* Upload Video */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Step 1: Upload Video (MP4, MOV, WEBM)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-xl border-2 border-dashed border-zinc-800 hover:border-purple-500/50 bg-[#0e0d16] flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 group"
              >
                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                <p className="text-xs font-semibold text-zinc-300">Select video file to edit</p>
                <p className="text-[11px] text-zinc-400">MP4, MOV, WEBM up to 100MB</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Step 2: Choose AI Editing Operation
              </label>
              <div className="space-y-1.5">
                {editPresets.map((ep) => (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => {
                      setEditAction(ep.id);
                      setEditInstruction(ep.prompt);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      editAction === ep.id
                        ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                        : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{ep.label}</span>
                    <Scissors className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Instruction */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Step 3: Detailed AI Instruction
              </label>
              <textarea
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                rows={3}
                className="w-full p-3 bg-[#0e0d16] border border-zinc-800 focus:border-purple-500 rounded-xl text-sm text-white focus:outline-none resize-none"
                placeholder="Describe your edits (trim, subtitles, background change, color grade)..."
              />
            </div>

            <button
              onClick={handleProcessVideoEdit}
              disabled={isProcessingEdit || !uploadedVideo || !editInstruction.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isProcessingEdit ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Video Timeline...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Apply AI Video Edit</span>
                </>
              )}
            </button>
          </div>

          {/* Editor Preview & Comparison (7 cols) */}
          <div className="lg:col-span-7 bg-[#131021] p-5 rounded-2xl border border-purple-900/20 shadow-xl flex flex-col justify-between space-y-4">
            <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Video Preview</span>
              {editedVideoResult && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Edits Rendered</span>
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center bg-black/60 rounded-xl p-4 min-h-[380px]">
              {uploadedVideo ? (
                <video
                  src={editedVideoResult || uploadedVideo}
                  controls
                  className="max-h-[440px] w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center space-y-2 text-zinc-500 p-8">
                  <Film className="w-12 h-12 mx-auto text-zinc-600" />
                  <p className="text-sm">Upload a video to preview and execute AI edits</p>
                </div>
              )}
            </div>

            {editedVideoResult && (
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleDownload(editedVideoResult)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Edited Video (MP4)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
