import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  Sparkles,
  Zap,
  Globe,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Download,
  Share2,
  Heart,
  FileText,
  Clock,
  Flame,
  CheckCircle2,
  HardDrive,
  Palette
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { usage, user, setIsUpgradeModalOpen, showNotification, customLogo, setIsLogoModalOpen } = useApp();

  const isFree = usage?.plan === 'free';
  const remaining = usage?.remainingToday ?? 47;
  const limit = usage?.limitToday ?? 50;
  const used = usage?.usedToday ?? 3;
  const storageUsed = usage?.storageUsedMB ?? 38;
  const storageLimit = usage?.storageLimitMB ?? 500;

  // Dashboard mock recent data
  const [favorites, setFavorites] = useState<string[]>(['fav-1', 'fav-2']);

  const recentChats = [
    { id: 'c1', title: 'Factual Verification: Quantum Supremacy 2026', time: '18 mins ago', sources: 4 },
    { id: 'c2', title: 'Pakistan Renewable Energy Tax Law 2026', time: '2 hours ago', sources: 6 },
    { id: 'c3', title: 'Neural Video Diffusion Benchmarks', time: 'Yesterday', sources: 3 },
  ];

  const recentGeneratedImages = [
    {
      id: 'img-1',
      title: 'Neon Peregrine Falcon',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      style: 'Cyberpunk',
      ratio: '16:9',
      isPublic: true,
    },
    {
      id: 'img-2',
      title: 'Amethyst Crystal Lotus',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
      style: 'Concept Art',
      ratio: '1:1',
      isPublic: true,
    },
    {
      id: 'img-3',
      title: 'Karakoram Twilight Peaks',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      style: 'Photorealistic',
      ratio: '16:9',
      isPublic: false,
    },
  ];

  const recentVideos = [
    {
      id: 'vid-1',
      title: 'Bioluminescent Ocean Current',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '5s',
      fps: '60fps',
    },
    {
      id: 'vid-2',
      title: 'Futuristic Cyber Highway',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '7s',
      fps: '60fps',
    },
  ];

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
      showNotification('Removed from favorites', 'info');
    } else {
      setFavorites([...favorites, id]);
      showNotification('Added to favorites', 'success');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner & Plan Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181427] via-[#120f20] to-[#0d0b16] border border-purple-800/30 p-6 md:p-8 shadow-2xl glow-purple-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-600/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Next-Gen Factual AI Suite</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-purple-950/60 border border-purple-800/40 text-zinc-300 hover:text-purple-200 text-xs font-medium transition-colors"
                title="Choose your own logo"
              >
                <Palette className="w-3 h-3 text-purple-400" />
                <span>{customLogo ? 'Custom Logo Active' : 'Choose Your Own Logo'}</span>
              </button>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">DODO.ai</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl">
              High-accuracy conversational intelligence with real-time web search verification, studio image generator and editor, and cinematic video creation.
            </p>
          </div>

          {/* Usage & Plan Summary Box */}
          <div className="bg-[#1c182d]/80 backdrop-blur-md border border-purple-700/30 rounded-2xl p-5 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-400">Current Plan</span>
              {isFree ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                  FREE PLAN
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center space-x-1">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>PREMIUM (₨300/mo)</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-zinc-400 text-xs">Daily AI Requests:</span>
                <span className="font-bold text-white text-base">
                  {isFree ? `${remaining} / ${limit} remaining` : 'Priority Unlimited'}
                </span>
              </div>

              {/* Progress bar */}
              {isFree && (
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-300"
                    style={{ width: `${(remaining / limit) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {isFree ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Premium (₨300/mo)</span>
              </button>
            ) : (
              <div className="text-[11px] text-emerald-400 flex items-center space-x-1 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active PKR Subscription • Priority Speed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launch Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Workspace Modules</span>
          </h2>
          <span className="text-xs text-zinc-400">All tools powered by verified Gemini architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AI Chat Card */}
          <Link
            to="/chat"
            className="group p-5 rounded-2xl bg-[#141122] border border-purple-900/20 hover:border-purple-600/50 hover:bg-[#19152b] transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  High-Accuracy AI Chat
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Anti-hallucination engine with live Google search grounding and verified primary source citations.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold pt-2 border-t border-zinc-800/60">
              <span>Start factual chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* AI Image Studio Card */}
          <Link
            to="/image-studio"
            className="group p-5 rounded-2xl bg-[#141122] border border-purple-900/20 hover:border-purple-600/50 hover:bg-[#19152b] transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                  AI Image Studio & Editor
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Text-to-image synthesis, upload & edit, background replacement, object removal, and upscaling.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-fuchsia-400 font-semibold pt-2 border-t border-zinc-800/60">
              <span>Open image studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* AI Video Studio Card */}
          <Link
            to="/video-studio"
            className="group p-5 rounded-2xl bg-[#141122] border border-purple-900/20 hover:border-purple-600/50 hover:bg-[#19152b] transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  AI Video Creation & Editor
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Generate cinematic video clips from text/image, animate frames, and perform AI timeline video edits.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold pt-2 border-t border-zinc-800/60">
              <span>Launch video studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Public Community Gallery Card */}
          <Link
            to="/community"
            className="group p-5 rounded-2xl bg-[#141122] border border-purple-900/20 hover:border-purple-600/50 hover:bg-[#19152b] transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Public Community Gallery
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  Explore trending creations from artists worldwide, share your art publicly, and find inspiring prompts.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold pt-2 border-t border-zinc-800/60">
              <span>Explore community</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Section: Recent Chats + Recent Generated Media */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Generated Images & Videos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Images Showcase */}
          <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">Recent Generated Images</h2>
              </div>
              <Link to="/image-studio" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentGeneratedImages.map((img) => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <div className="aspect-video sm:aspect-square w-full overflow-hidden bg-zinc-950">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-[#161326] border-t border-zinc-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-[120px]">{img.title}</p>
                      <p className="text-[10px] text-purple-400">{img.style}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleFavorite(img.id)}
                        className={`p-1.5 rounded-lg hover:bg-zinc-800 text-xs transition-colors ${
                          favorites.includes(img.id) ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Videos Showcase */}
          <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Recent Generated Videos</h2>
              </div>
              <Link to="/video-studio" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
                <span>Video Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentVideos.map((vid) => (
                <div key={vid.id} className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 p-3 space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      src={vid.url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      preload="metadata"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-xs font-semibold text-white">{vid.title}</p>
                      <p className="text-[10px] text-zinc-400">{vid.duration} • {vid.fps}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Factual Chats & Media Storage */}
        <div className="space-y-6">
          {/* Recent Chats Card */}
          <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">Recent AI Chats</h2>
              </div>
              <Link to="/chat" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                New Chat
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to="/chat"
                  className="block p-3 rounded-xl bg-zinc-900/50 hover:bg-purple-900/20 border border-zinc-800/80 hover:border-purple-600/30 transition-all"
                >
                  <p className="text-xs font-semibold text-zinc-200 line-clamp-1">{chat.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5">
                    <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{chat.sources} verified sources</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>{chat.time}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Storage & Files Summary */}
          <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">Storage & Files</h2>
              </div>
              <Link to="/library" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                View All
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Cloud Storage</span>
                <span className="text-white font-bold">{storageUsed} MB / {storageLimit} MB</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${Math.min(100, (storageUsed / storageLimit) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1">
                <span>PDFs, Videos, Models</span>
                <Link to="/library" className="text-purple-400 hover:underline">
                  + Upload files
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
