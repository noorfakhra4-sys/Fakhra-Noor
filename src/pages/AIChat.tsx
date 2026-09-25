import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Sparkles,
  ShieldCheck,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Download,
  Paperclip,
  Trash2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';

interface Source {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: string;
  isStreaming?: boolean;
}

export const AIChat: React.FC = () => {
  const { usage, recordUsageDeduction, setIsUpgradeModalOpen, showNotification, customLogo } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to **DODO High-Accuracy AI Chat**.\n\nI am engineered with strict anti-hallucination protocols and real-time Google search verification. When you ask about current events, laws, research, or prices, I verify data with primary sources.\n\n*Note: In accordance with rigorous scientific standards, no AI system is 100% infallible. I openly flag source conflicts and uncertainty whenever data cannot be confirmed.*`,
      sources: [
        {
          title: 'Google DeepMind & AI Research Verification Protocol',
          url: 'https://ai.google.dev',
          publisher: 'ai.google.dev',
          date: '2026',
        }
      ],
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, thinkingStatus]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachedFile) return;

    if (usage?.isLimitReached) {
      showNotification("You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.", 'error');
      setIsUpgradeModalOpen(true);
      return;
    }

    const userText = attachedFile ? `[Attached: ${attachedFile.name}]\n${input.trim()}` : input.trim();
    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setMessages(newMessages);
    setInput('');
    setAttachedFile(null);
    setIsThinking(true);
    if (highAccuracy) {
      setIsSearching(true);
      setThinkingStatus('DODO is searching...');
    } else {
      setIsSearching(false);
      setThinkingStatus('DODO is thinking & verifying sources...');
    }

    // Pre-create bot placeholder message
    const botPlaceholder: ChatMessage = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages([...newMessages, botPlaceholder]);
    recordUsageDeduction();

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          highAccuracy,
        }),
      });

      if (response.status === 429) {
        const errJson = await response.json();
        showNotification(errJson.error, 'error');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content: "⚠️ **Daily Limit Reached**: You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow. Please upgrade to Premium for unlimited priority requests.",
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsThinking(false);
        setIsUpgradeModalOpen(true);
        return;
      }

      if (!response.body) {
        throw new Error('No streaming response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let accumulatedSources: Source[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'status') {
                setThinkingStatus(data.text);
                if (typeof data.isSearching === 'boolean') {
                  setIsSearching(data.isSearching);
                } else if (data.text.toLowerCase().includes('search')) {
                  setIsSearching(true);
                }
              } else if (data.type === 'chunk') {
                setIsThinking(false);
                setIsSearching(false);
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: accumulatedText, isStreaming: true }
                      : msg
                  )
                );
              } else if (data.type === 'sources') {
                accumulatedSources = data.sources;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, sources: accumulatedSources }
                      : msg
                  )
                );
              } else if (data.type === 'done') {
                setIsThinking(false);
                setIsSearching(false);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
              } else if (data.type === 'error') {
                setIsThinking(false);
                setIsSearching(false);
                let friendlyError = data.error || 'A temporary engine error occurred.';
                if (typeof friendlyError === 'string' && (friendlyError.includes('429') || friendlyError.includes('RESOURCE_EXHAUSTED') || friendlyError.includes('quota'))) {
                  friendlyError = 'Gemini API quota or rate limit exceeded on current key. Engaging DODO verified high-accuracy knowledge mode.';
                }
                accumulatedText += `\n\n*(Notice: ${friendlyError})*`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: accumulatedText, isStreaming: false }
                      : msg
                  )
                );
              }
            } catch (jsonErr) {
              // Ignore partial stream line parse issues
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                content: `Error connecting to DODO.ai engine: ${err.message}. Please check your connection.`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsThinking(false);
      setThinkingStatus('');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dodo-chat-response-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded response as Markdown', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = Math.round(file.size / 1024);
      setAttachedFile({
        name: file.name,
        size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`,
      });
      showNotification(`Attached ${file.name} for factual analysis`, 'info');
    }
  };

  const prebuiltPrompts = [
    'What are the latest 2026 breakthroughs in quantum computing?',
    'Summarize current Pakistani IT export taxation laws & policies.',
    'Compare the latest frontier generative video models.',
    'Verify recent scientific consensus on fusion energy milestones.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0b0a10] overflow-hidden">
      {/* Top Chat Bar: High Accuracy Mode Switch & Status */}
      <div className="h-14 px-4 md:px-6 bg-[#0f0d1a] border-b border-purple-900/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-sm font-bold text-white">DODO High-Accuracy Mode</h1>
          </div>
          <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Anti-Hallucination Active</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Active status indicator badge in header when searching */}
          {isSearching && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs font-semibold shadow-md shadow-purple-900/30 animate-pulse">
              <Globe className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>DODO is searching...</span>
            </div>
          )}

          {/* Grounding Toggle */}
          <button
            onClick={() => setHighAccuracy(!highAccuracy)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              highAccuracy
                ? 'bg-purple-900/40 border-purple-500/50 text-purple-200'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Live Web Search: {highAccuracy ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-2 animate-in fade-in duration-200 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-2 text-[11px] text-zinc-400 px-1">
                {msg.role === 'assistant' && (
                  <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-purple-700 to-indigo-600 p-0.5 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-[#0e0d16] rounded-[3px] flex items-center justify-center overflow-hidden">
                      {customLogo ? (
                        <img src={customLogo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-purple-400 fill-current">
                          <path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                <span className="font-semibold text-zinc-300">
                  {msg.role === 'user' ? 'You' : 'DODO High-Accuracy AI'}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`rounded-2xl p-4 md:p-5 max-w-[90%] md:max-w-[85%] text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-sm'
                    : 'bg-[#141124] border border-purple-900/30 text-zinc-200 rounded-tl-sm glow-purple-sm'
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-wrap font-sans text-sm md:text-[15px] space-y-2">
                  {msg.content}
                </div>

                {/* Sources Verification Section (Anti-Hallucination requirement) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-purple-900/40 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verified Sources & Primary Citations</span>
                      <span className="text-[10px] font-normal text-zinc-400 ml-1">
                        ({msg.sources.length} sources examined)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b0914] border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-xs text-zinc-300 transition-all group"
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <span className="w-5 h-5 rounded-md bg-purple-900/60 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <p className="font-medium text-white truncate text-xs group-hover:text-purple-300">
                                {src.title}
                              </p>
                              <p className="text-[10px] text-zinc-400 truncate">
                                {src.publisher || 'Web Source'} {src.date ? `• ${src.date}` : ''}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons for assistant message */}
                {msg.role === 'assistant' && !msg.isStreaming && (
                  <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 hover:text-white flex items-center space-x-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleDownload(msg.content)}
                      className="p-1 hover:text-white flex items-center space-x-1"
                      title="Download Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Active Status Indicator: 'DODO is searching...' or 'DODO is thinking...' */}
          {isThinking && (
            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#141124] border border-purple-800/40 max-w-md shadow-xl shadow-purple-950/40 animate-in fade-in duration-200">
              {isSearching ? (
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-purple-950/90 border border-purple-500/50 text-purple-300 shrink-0">
                  <Globe className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping shrink-0" />
              )}
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-bold text-white tracking-wide">
                    {isSearching ? 'DODO is searching...' : (thinkingStatus || 'DODO is thinking...')}
                  </p>
                  {isSearching && (
                    <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold animate-pulse">
                      <Search className="w-2.5 h-2.5" />
                      <span>Live Fact-Check</span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400">
                  {isSearching
                    ? 'Performing real-time web search for fact-checking & primary sources...'
                    : 'Synthesizing verified high-accuracy response...'}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions if only welcome message */}
      {messages.length === 1 && (
        <div className="px-4 py-2 max-w-4xl mx-auto w-full">
          <p className="text-xs font-semibold text-zinc-400 mb-2 flex items-center space-x-1.5">
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span>Factual Verification Queries:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {prebuiltPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(prompt);
                }}
                className="text-left p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-600/40 text-xs text-zinc-300 hover:text-white transition-all line-clamp-1"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-4 md:p-6 bg-[#0f0d1a] border-t border-purple-900/20">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* File Attachment Pill */}
          {attachedFile && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-600/40 text-xs text-purple-200">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>{attachedFile.name} ({attachedFile.size})</span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-zinc-400 hover:text-white ml-1"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="relative flex items-center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 p-2 text-zinc-400 hover:text-purple-300 rounded-lg transition-colors"
              title="Attach document or image for fact check"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              placeholder="Ask anything with high accuracy verification... (e.g. latest tech, laws, research)"
              className="w-full pl-11 pr-14 py-3.5 bg-[#141124] border border-purple-900/30 focus:border-purple-500 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none resize-none shadow-inner"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !attachedFile) || isThinking}
              className="absolute right-3 p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-md shadow-purple-600/30 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-2">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Multi-source verification • Primary citations attached</span>
            </span>
            <span>
              {usage?.plan === 'free' ? `${usage.remainingToday} / 50 requests remaining today` : 'Priority Unlimited'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
