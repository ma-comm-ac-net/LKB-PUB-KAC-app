import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitPullRequest,
  ArrowUpCircle,
  ArrowDownCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  RefreshCw,
  Clock,
  Check,
} from 'lucide-react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess,
}) => {
  const [repoStatus, setRepoStatus] = useState<any>(null);
  const [token, setToken] = useState('');
  const [commitMessage, setCommitMessage] = useState(
    `feat: sync LKB PUB KAC dashboard & data - ${new Date().toLocaleDateString('id-ID')}`
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lastOutput, setLastOutput] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/git/status');
      if (res.ok) {
        const data = await res.json();
        setRepoStatus(data);
        if (data.maskedToken) {
          setToken(data.maskedToken);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch git status', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setFeedback(null);
      setLastOutput(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveToken = async () => {
    if (!token.trim() || token.includes('...')) return;
    try {
      const res = await fetch('/api/git/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Token GitHub berhasil disimpan.' });
        fetchStatus();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Gagal menyimpan token.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Koneksi error.' });
    }
  };

  const handlePull = async () => {
    setIsPulling(true);
    setFeedback(null);
    setLastOutput(null);
    try {
      const res = await fetch('/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.includes('...') ? undefined : token.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setLastOutput(data.output || 'Already up to date.');
        if (onSyncSuccess) onSyncSuccess();
        fetchStatus();
      } else {
        setFeedback({ type: 'error', message: data.error });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal pull dari GitHub.' });
    } finally {
      setIsPulling(false);
    }
  };

  const handlePush = async () => {
    setIsPushing(true);
    setFeedback(null);
    setLastOutput(null);
    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.includes('...') ? undefined : token.trim(),
          message: commitMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setLastOutput(data.output || 'Pushed successfully to origin/main.');
        if (onSyncSuccess) onSyncSuccess();
        fetchStatus();
      } else {
        setFeedback({ type: 'error', message: data.error });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal push ke GitHub.' });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-[#DCE4EF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8EDF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2B55] flex items-center justify-center shadow-xs">
              <GitBranch className="w-6 h-6 text-[#F5BB00]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0B2B55]">
                Otomatisasi GitHub Sync &amp; Deployment
              </h3>
              <a
                href="https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#2684C7] hover:underline flex items-center gap-1 font-medium"
              >
                <span>github.com/ma-comm-ac-net/LKB-PUB-KAC-app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9]'
                : 'bg-[#FFEBEE] text-[#D94848] border border-[#FFCDD2]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Repo Status Card */}
        <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4EF] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16865D] animate-pulse"></span>
              <strong className="text-[#0B2B55]">Branch:</strong>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#DCE4EF] font-bold text-[#172B4D]">
                {repoStatus?.branch || 'main'}
              </span>
            </div>
            <button
              onClick={fetchStatus}
              disabled={isLoadingStatus}
              className="text-[11px] text-[#2684C7] font-semibold flex items-center gap-1 hover:underline"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="text-[11px] text-[#69778C] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#F5BB00] shrink-0" />
            <span className="truncate">
              <strong>Commit Terakhir:</strong> {repoStatus?.lastCommit || 'Belum ada commit'}
            </span>
          </div>
        </div>

        {/* Token Authentication Input */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-[#172B4D] font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#F5BB00]" />
              <span>GitHub Personal Access Token (PAT)</span>
            </label>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=LKB-PUB-KAC-Sync"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#2684C7] hover:underline"
            >
              Buat Token Baru (Scope: repo) ↗
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="flex-1 p-2.5 rounded-lg border border-[#DCE4EF] bg-white font-mono text-xs text-[#172B4D] focus:ring-2 focus:ring-[#0B2B55] focus:outline-none"
            />
            <button
              onClick={handleSaveToken}
              disabled={!token.trim() || token.includes('...')}
              className="px-4 py-2 rounded-lg bg-[#0B2B55] hover:bg-[#163C6A] text-white font-bold text-xs disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </div>

        {/* Commit Message */}
        <div className="space-y-1 text-xs">
          <label className="text-[#172B4D] font-bold block">Pesan Commit (Push)</label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-[#DCE4EF] bg-white text-xs text-[#172B4D] focus:ring-2 focus:ring-[#0B2B55] focus:outline-none"
          />
        </div>

        {/* Console output display */}
        {lastOutput && (
          <div className="p-2.5 rounded-lg bg-gray-900 text-green-400 font-mono text-[10px] max-h-24 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{lastOutput}</pre>
          </div>
        )}

        {/* Action Buttons: PULL & PUSH */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8EDF4]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#DCE4EF] text-xs font-bold text-[#69778C] hover:bg-[#F5F7FB]"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {/* PULL BUTTON */}
            <button
              onClick={handlePull}
              disabled={isPulling}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#0B2B55] text-[#0B2B55] hover:bg-[#F5F7FB] text-xs font-extrabold transition-all shadow-xs"
            >
              <ArrowDownCircle className={`w-4 h-4 text-[#2684C7] ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'Pulling...' : 'PULL dari GitHub'}</span>
            </button>

            {/* PUSH BUTTON */}
            <button
              onClick={handlePush}
              disabled={isPushing}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0B2B55] hover:bg-[#163C6A] text-white text-xs font-extrabold shadow-md transition-all ring-2 ring-[#F5BB00]/30"
            >
              <ArrowUpCircle className={`w-4 h-4 text-[#F5BB00] ${isPushing ? 'animate-bounce' : ''}`} />
              <span>{isPushing ? 'Pushing...' : 'PUSH ke GitHub'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
