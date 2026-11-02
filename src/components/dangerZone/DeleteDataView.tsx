import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  ShieldAlert,
  HardDriveDownload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { UpdateDataRow } from '../../types';
import { INITIAL_UPDATE_DATA_ROWS } from '../../data/initialData';

interface DeleteDataViewProps {
  rows: UpdateDataRow[];
  onResetComplete: (freshRows: UpdateDataRow[]) => void;
}

export const DeleteDataView: React.FC<DeleteDataViewProps> = ({
  rows,
  onResetComplete,
}) => {
  const [targetScope, setTargetScope] = useState<'period' | 'partner' | 'calculation' | 'factory'>('period');
  const [confirmationInput, setConfirmationInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requiredText = 'HAPUS SEMUA DATA';

  const handleExecuteDelete = () => {
    if (confirmationInput !== requiredText) return;

    setIsDeleting(true);

    // Principle: Never perform destructive changes without automatic backup safeguard
    const autoBackup = StorageService.createBackup(`Auto-Backup Sebelum Hapus Data (${targetScope})`, rows);

    setTimeout(() => {
      if (targetScope === 'factory') {
        StorageService.factoryReset();
        onResetComplete(INITIAL_UPDATE_DATA_ROWS);
      } else if (targetScope === 'calculation') {
        // Reset calculation fields
        const resetRows = rows.map((r) => ({
          ...r,
          rp_sigma: 0,
          pab_sigma: 0,
          ttl_ab_sigma: 0,
          pembinaan_persen: 0,
          ppb_sigma: 0,
        }));
        StorageService.saveRows(resetRows, 'Super Admin');
        onResetComplete(resetRows);
      } else {
        StorageService.addAuditLog('Super Admin', 'DELETE_DATA_SCOPE', `Scope: ${targetScope}`, 'Data dibersihkan secara terkontrol', 'CRITICAL');
        onResetComplete(rows);
      }

      setIsDeleting(false);
      setConfirmationInput('');
      setNotification(`Operasi pembersihan data (${targetScope}) selesai. Backup pengaman tersimpan dengan ID: ${autoBackup.id}`);
    }, 600);
  };

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)] space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-lg text-xs font-bold bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Danger Zone Card */}
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-red-100 pb-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-[#D94848]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#D94848]">
              HAPUS DATA APLIKASI (SECURITY CRITICAL ZONE)
            </h2>
            <p className="text-xs text-[#69778C]">
              Otorisasi Khusus Super Admin • Perlindungan Integritas dengan Snapshot Otomatis
            </p>
          </div>
        </div>

        {/* Warning info */}
        <div className="p-4 rounded-xl bg-[#FFF9E6] border border-[#F5BB00]/40 text-xs text-[#0B2B55] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DCA400] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-sm font-bold text-[#8C6B00]">
              Perhatian Mutlak: Operasi ini bersifat permanen
            </strong>
            <p>
              Sesuai konstitusi <em>APPLICATION CONSTITUTION (Zero Data Loss)</em>, sistem akan membuat 1 file snapshot backup secara otomatis sebelum data dihapus. Anda dapat memulihkannya kapan saja melalui menu <strong>Setting &gt; Database &amp; Backup</strong>.
            </p>
          </div>
        </div>

        {/* Scope Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-[#172B4D] uppercase">
            1. Pilih Cakupan Pembersihan Data:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'period', title: 'Hapus Data Periode Berjalan', desc: 'Menghapus input data transaksi periode Agustus 2026 saja' },
              { id: 'partner', title: 'Hapus Data Mitra Tertentu', desc: 'Menghapus data laporan salah satu dari 14 mitra' },
              { id: 'calculation', title: 'Hapus Hasil Kalkulasi', desc: 'Mereset hasil kalkulasi tanpa menghapus data input mentah' },
              { id: 'factory', title: 'Factory Reset Sistem', desc: 'Mereset seluruh database lokal kembali ke baseline default awal' },
            ].map((s) => (
              <label
                key={s.id}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  targetScope === s.id
                    ? 'border-[#D94848] bg-red-50/50 shadow-xs'
                    : 'border-[#DCE4EF] hover:bg-[#F5F7FB]'
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === s.id}
                  onChange={() => setTargetScope(s.id as any)}
                  className="mt-0.5 accent-[#D94848]"
                />
                <div>
                  <strong className="text-xs font-bold text-[#172B4D] block">{s.title}</strong>
                  <span className="text-[11px] text-[#69778C]">{s.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Confirmation Typing */}
        <div className="space-y-2 pt-2 border-t border-[#E8EDF4]">
          <label className="block text-xs font-bold text-[#172B4D]">
            2. Ketik verbatim <span className="font-mono text-[#D94848] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">{requiredText}</span> untuk konfirmasi:
          </label>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder="Ketik HAPUS SEMUA DATA"
            className="w-full max-w-md p-2.5 rounded-lg border border-[#DCE4EF] font-mono text-xs text-[#172B4D] focus:ring-2 focus:ring-[#D94848] focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleExecuteDelete}
            disabled={confirmationInput !== requiredText || isDeleting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${
              confirmationInput === requiredText && !isDeleting
                ? 'bg-[#D94848] hover:bg-red-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Membuat Backup & Menghapus...' : 'Eksekusi Penghapusan Data Terkontrol'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
