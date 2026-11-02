import React, { useState } from 'react';
import { Sheet, CheckCircle, RefreshCw, Unlink, Link, ExternalLink, ShieldCheck } from 'lucide-react';
import { GoogleSheetsConfig, UpdateDataRow } from '../../types';
import { GoogleSheetsService } from '../../services/googleSheetsService';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: UpdateDataRow[];
  onSyncComplete?: (message: string) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  rows,
  onSyncComplete,
}) => {
  const [config, setConfig] = useState<GoogleSheetsConfig>(GoogleSheetsService.getConfig());
  const [email, setEmail] = useState(config.accountEmail || 'ma.comm.ac.net@gmail.com');
  const [spreadsheetId, setSpreadsheetId] = useState(
    config.spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  );
  const [sheetName, setSheetName] = useState(config.sheetName || 'UPDATE DATA');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = () => {
    GoogleSheetsService.connect(email, spreadsheetId, sheetName);
    setConfig(GoogleSheetsService.getConfig());
    setStatusMessage('Berhasil menghubungkan akun Google Workspace & Spreadsheet.');
  };

  const handleDisconnect = () => {
    GoogleSheetsService.disconnect();
    setConfig(GoogleSheetsService.getConfig());
    setStatusMessage('Koneksi Google Sheets diputus.');
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await GoogleSheetsService.syncWithSheet(rows);
      setStatusMessage(res.message);
      setConfig(GoogleSheetsService.getConfig());
      if (onSyncComplete) onSyncComplete(res.message);
    } catch (err: any) {
      setStatusMessage(err.message || 'Gagal melakukan sinkronisasi.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-[#DCE4EF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8EDF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
              <Sheet className="w-6 h-6 text-[#0F9D58]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0B2B55]">
                Google Sheets Connector &amp; Sync Engine
              </h3>
              <p className="text-xs text-[#69778C]">
                Sinkronisasi 2-arah tabel UPDATE DATA ke Google Spreadsheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-3 rounded-lg text-xs font-bold bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Connection Status Card */}
        <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DCE4EF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                config.connected ? 'bg-[#0F9D58] animate-pulse' : 'bg-gray-300'
              }`}
            ></span>
            <div>
              <span className="text-xs font-extrabold text-[#172B4D] block">
                {config.connected ? 'Terhubung ke Google Workspace' : 'Belum Terhubung'}
              </span>
              <span className="text-[11px] text-[#69778C]">
                {config.connected
                  ? `Akun: ${config.accountEmail || 'ma.comm.ac.net@gmail.com'}`
                  : 'Klik Hubungkan untuk mengaktifkan sinkronisasi otomatis'}
              </span>
            </div>
          </div>
          {config.connected ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Putus</span>
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F9D58] text-white hover:bg-[#0B8043] text-xs font-bold transition-colors"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Hubungkan</span>
            </button>
          )}
        </div>

        {/* Config Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[#172B4D] font-bold mb-1">
              Google Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#DCE4EF] bg-white text-[#172B4D] font-medium focus:ring-2 focus:ring-[#0B2B55] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#172B4D] font-bold mb-1">
              Google Spreadsheet ID / URL
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full p-2.5 rounded-lg border border-[#DCE4EF] bg-white font-mono text-[#172B4D] focus:ring-2 focus:ring-[#0B2B55] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#172B4D] font-bold mb-1">
                Nama Worksheet / Tab
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#DCE4EF] bg-white text-[#172B4D] font-medium focus:ring-2 focus:ring-[#0B2B55] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#172B4D] font-bold mb-1">
                Terakhir Sinkron
              </label>
              <div className="p-2.5 rounded-lg border border-[#DCE4EF] bg-[#F5F7FB] text-[#69778C] font-medium truncate">
                {config.lastSyncedAt
                  ? new Date(config.lastSyncedAt).toLocaleString('id-ID')
                  : 'Belum pernah'}
              </div>
            </div>
          </div>
        </div>

        {/* Security / Principle info */}
        <div className="p-3 rounded-lg bg-[#E3F2FD] border border-[#BBDEFB] text-[11px] text-[#0B2B55] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2684C7] shrink-0 mt-0.5" />
          <span>
            <strong>Prinsip Kedaulatan Data:</strong> Database lokal &amp; PostgreSQL adalah sumber utama. Google Sheets bertindak sebagai jalur pelaporan eksekutif sinkron tanpa menimpa formula asli.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8EDF4]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#DCE4EF] text-xs font-bold text-[#69778C] hover:bg-[#F5F7FB]"
          >
            Tutup
          </button>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing || !config.connected}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-extrabold text-white shadow-md transition-all ${
              !config.connected
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0F9D58] hover:bg-[#0B8043] ring-2 ring-[#0F9D58]/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Mulai Sinkronisasi Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
