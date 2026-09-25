import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Heart,
  Share2,
  Search,
  Flame,
  Clock,
  Sparkles,
  Flag,
  X,
  Copy,
  Download,
  ShieldAlert,
  User,
  Check
} from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  creatorName: string;
  creatorId: string;
  createdAt: string;
  likes: number;
  category: string;
  isPublic: boolean;
  aspectRatio: string;
  likedBy?: string[];
}

export const CommunityGallery: React.FC = () => {
  const { user, showNotification } = useApp();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'trending' | 'new'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox & details state
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Report Modal
  const [reportingPost, setReportingPost] = useState<CommunityPost | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const categories = ['All', 'Sci-Fi', 'Concept Art', 'Photorealistic', 'Characters', 'Landscapes', 'Anime'];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('sort', sortOrder);

      const res = await fetch(`/api/community/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load gallery posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
        );
        if (activePost && activePost.id === postId) {
          setActivePost({ ...activePost, likes: data.likes });
        }
      }
    } catch {
      showNotification('Failed to register like', 'error');
    }
  };

  const handleCopyPrompt = (promptText: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    showNotification('Prompt copied to clipboard!', 'success');
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost) return;

    setIsSubmittingReport(true);
    try {
      const res = await fetch(`/api/community/posts/${reportingPost.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (res.ok) {
        showNotification('Report submitted to moderation queue. Thank you.', 'info');
        setReportingPost(null);
        fetchPosts();
      }
    } catch {
      showNotification('Could not submit report', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header & Tagline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-900/20">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Public Community Gallery</h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Discover community-curated neural art. Only items explicitly marked <span className="text-purple-300 font-semibold">Public</span> are shared here.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts & creators..."
            className="w-full pl-10 pr-4 py-2 bg-[#131021] border border-zinc-800 focus:border-purple-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Filter Bar: Categories + Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort: Trending vs New */}
        <div className="flex p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shrink-0">
          <button
            onClick={() => setSortOrder('trending')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              sortOrder === 'trending' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setSortOrder('new')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              sortOrder === 'new' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 aspect-square animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 space-y-3 bg-[#131021] rounded-2xl border border-zinc-800">
          <Globe className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Public Posts Found</h3>
          <p className="text-xs text-zinc-400">
            Be the first to share! Head to Image Studio and publish with the "Public" toggle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative rounded-2xl overflow-hidden bg-[#131021] border border-purple-900/20 hover:border-purple-600/50 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="aspect-square w-full overflow-hidden bg-black/60 relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-purple-300 border border-purple-500/20">
                  {post.category}
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-4 space-y-2 bg-[#161326] border-t border-zinc-800/80">
                <p className="text-xs font-bold text-white truncate">{post.title}</p>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center space-x-1 truncate max-w-[120px]">
                    <User className="w-3 h-3 text-purple-400" />
                    <span>{post.creatorName}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center space-x-1 text-zinc-300 hover:text-rose-400 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportingPost(post);
                      }}
                      className="text-zinc-500 hover:text-amber-400 transition-colors"
                      title="Report content"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#12101c] border border-purple-800/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-black/50 hover:bg-black/80 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: High-Res Image View */}
            <div className="md:w-3/5 bg-black flex items-center justify-center p-4 overflow-hidden">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Right: Metadata, Creator, Prompt, & Actions */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-[#141124] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 mb-2">
                    {activePost.category}
                  </div>
                  <h3 className="text-lg font-bold text-white">{activePost.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Created by <strong className="text-zinc-200">{activePost.creatorName}</strong></span>
                  </p>
                </div>

                {/* Prompt block with copy button */}
                <div className="p-3.5 rounded-xl bg-[#0b0a12] border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase">
                    <span>Prompt</span>
                    <button
                      onClick={() => handleCopyPrompt(activePost.prompt, activePost.id)}
                      className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                    >
                      {copiedPromptId === activePost.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedPromptId === activePost.id ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                    {activePost.prompt}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => handleLike(activePost.id, e)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-900/30 border border-purple-600/40 text-xs font-semibold text-purple-200 hover:bg-purple-900/50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>{activePost.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => setReportingPost(activePost)}
                    className="text-xs text-zinc-500 hover:text-amber-400 flex items-center space-x-1"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Post</span>
                  </button>
                </div>

                <a
                  href={activePost.imageUrl}
                  download={`dodo-community-${activePost.id}.png`}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inappropriate Content Reporting Modal */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131021] border border-purple-800/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Report Content</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Help keep DODO.ai community safe. Reported posts are immediately reviewed by our content moderation team.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Inappropriate content">Inappropriate / Explicit imagery</option>
                  <option value="Copyright violation">Copyright or IP violation</option>
                  <option value="Hate speech">Hate speech or harassment</option>
                  <option value="Spam">Spam or misleading content</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingPost(null)}
                  className="px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
