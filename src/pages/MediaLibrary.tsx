import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Trash2,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  MessageSquare,
  Lock,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'docx' | 'txt' | 'audio';
  size: number;
  url: string;
  status: 'Uploading' | 'Processing' | 'Completed' | 'Failed';
  isPublic: boolean;
  createdAt: string;
  description?: string;
}

export const MediaLibrary: React.FC = () => {
  const { usage, showNotification } = useApp();
  const navigate = useNavigate();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      showNotification('File exceeds the 100MB upload limit', 'error');
      return;
    }

    setIsUploading(true);

    let detectedType: MediaItem['type'] = 'image';
    if (file.type.startsWith('video/')) detectedType = 'video';
    else if (file.type === 'application/pdf') detectedType = 'pdf';
    else if (file.type.startsWith('audio/')) detectedType = 'audio';
    else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) detectedType = 'docx';
    else if (file.type.startsWith('text/')) detectedType = 'txt';

    const tempId = `media_${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: detectedType,
          size: file.size,
          url: previewUrl,
          isPublic: false, // Default private!
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showNotification(`Uploaded ${file.name} successfully`, 'success');
        fetchMedia();
      }
    } catch (err) {
      showNotification('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMediaList(mediaList.filter((m) => m.id !== id));
        showNotification('File removed from cloud library', 'info');
      }
    } catch {
      showNotification('Delete failed', 'error');
    }
  };

  const handleAnalyzeInChat = (file: MediaItem) => {
    showNotification(`Loading ${file.name} into AI Chat for factual summarization...`, 'info');
    navigate('/chat');
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIconForType = (type: MediaItem['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-indigo-400" />;
      case 'pdf':
      case 'docx':
      case 'txt':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-emerald-400" />;
      default:
        return <ImageIcon className="w-5 h-5 text-purple-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-900/20">
        <div>
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Cloud Media Library</h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Store, analyze, and manage multi-format media. Secure, encrypted, and private by default.
          </p>
        </div>

        {/* Upload Action */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf,.docx,.txt,audio/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading to Cloud...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Media (All Formats)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Storage Bar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131021] p-4 rounded-2xl border border-purple-900/20">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'image', 'video', 'pdf', 'docx', 'audio'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                selectedType === t
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#0e0d16] border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2" />
        </div>
      </div>

      {/* Media Files Table / Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 text-sm">Loading media library...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-[#131021] rounded-2xl border border-zinc-800 space-y-3">
          <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Files Found</h3>
          <p className="text-xs text-zinc-400">Upload your images, videos, or PDFs to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-xl bg-[#131021] border border-zinc-800/80 hover:border-purple-600/40 transition-all flex flex-col justify-between space-y-3 shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 truncate pr-2">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    {getIconForType(file.type)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate group-hover:text-purple-300">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {formatBytes(file.size)} • {file.type.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              {file.description && (
                <p className="text-[11px] text-zinc-400 line-clamp-1 italic">
                  {file.description}
                </p>
              )}

              {/* Actions Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-zinc-500 flex items-center space-x-1">
                    {file.isPublic ? <Globe className="w-3 h-3 text-purple-400" /> : <Lock className="w-3 h-3" />}
                    <span>{file.isPublic ? 'Public' : 'Private'}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {(file.type === 'pdf' || file.type === 'docx' || file.type === 'txt') && (
                    <button
                      onClick={() => handleAnalyzeInChat(file)}
                      className="p-1.5 text-purple-400 hover:text-purple-300 rounded hover:bg-zinc-800 flex items-center space-x-1 text-[11px]"
                      title="Summarize with AI Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Summarize</span>
                    </button>
                  )}

                  <a
                    href={file.url}
                    download={file.name}
                    className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
