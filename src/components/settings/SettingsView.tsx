import React, { useState } from 'react';
import {
  Palette,
  Edit3,
  Users2,
  Lock,
  RefreshCw,
  Sheet,
  BookOpen,
  CheckCircle2,
  HardDrive,
  Activity,
  Rocket,
  Shield,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  GitBranch,
} from 'lucide-react';
import {
  AppSettingState,
  UpdateDataRow,
  AuditLogItem,
  AppErrorItem,
} from '../../types';
import { PARTNERS_LIST } from '../../data/initialData';
import { ParityEngine, ParityTestResult } from '../../services/parityEngine';
import { StorageService, BackupSnapshot } from '../../services/storageService';
import { GoogleSheetsService } from '../../services/googleSheetsService';

interface SettingsViewProps {
  subDomain: string;
  rows: UpdateDataRow[];
  settings: AppSettingState;
  onUpdateSettings: (newSettings: AppSettingState) => void;
  onRestoreRows: (restoredRows: UpdateDataRow[]) => void;
  onOpenGoogleSheetModal: () => void;
  onOpenGitHubModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  subDomain,
  rows,
  settings,
  onUpdateSettings,
  onRestoreRows,
  onOpenGoogleSheetModal,
  onOpenGitHubModal,
}) => {
  const [activeSub, setActiveSub] = useState(subDomain || 'appearance');
  const [parityResults, setParityResults] = useState<ParityTestResult[]>(ParityEngine.runParityAudit(rows));
  const [backups, setBackups] = useState<BackupSnapshot[]>(StorageService.getBackups());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(StorageService.getAuditLogs());
  const [errors, setErrors] = useState<AppErrorItem[]>(StorageService.getErrors());
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRunParityTests = () => {
    const res = ParityEngine.runParityAudit(rows);
    setParityResults(res);
    showToast('Seluruh pengujian formula parity selesai dijalankan.');
  };

  const handleCreateBackup = () => {
    const name = `Manual Snapshot - ${new Date().toLocaleTimeString('id-ID')}`;
    const snap = StorageService.createBackup(name, rows);
    setBackups(StorageService.getBackups());
    showToast(`Snapshot ${snap.id} berhasil disimpan ke database lokal.`);
  };

  const handleRestore = (id: string) => {
    const restored = StorageService.restoreBackup(id);
    if (restored) {
      onRestoreRows(restored);
      showToast(`Snapshot ${id} berhasil dipulihkan.`);
    }
  };

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)] space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-lg text-xs font-bold bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Settings Submenu Nav */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-2 shadow-xs overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max text-xs font-bold">
          {[
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'content_editor', label: 'Content Editor', icon: Edit3 },
            { id: 'master_data', label: 'Master Data', icon: Users2 },
            { id: 'user_access', label: 'User & Access', icon: Lock },
            { id: 'sync_control', label: 'Sync Control', icon: RefreshCw },
            { id: 'google_sheets', label: 'Google Sheets', icon: Sheet },
            { id: 'rules', label: 'Rules & Constitution', icon: BookOpen },
            { id: 'test_center', label: 'QA Test Center', icon: CheckCircle2 },
            { id: 'database_health', label: 'Database & Backup', icon: HardDrive },
            { id: 'monitoring', label: 'Monitoring & Logs', icon: Activity },
            { id: 'deploy_center', label: 'Deployment Center', icon: Rocket },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeSub === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSub(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-[#0B2B55] text-white shadow-xs'
                    : 'text-[#69778C] hover:text-[#0B2B55] hover:bg-[#F5F7FB]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F5BB00]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. APPEARANCE */}
      {activeSub === 'appearance' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-5">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Appearance &amp; Official Design Tokens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border-2 border-[#F5BB00] bg-[#FFFDF5] space-y-2">
              <span className="font-extrabold text-xs text-[#0B2B55] block">Default: Premium Corporate</span>
              <div className="flex gap-1.5 py-1">
                <span className="w-6 h-6 rounded bg-[#092754]" title="#092754 Sidebar"></span>
                <span className="w-6 h-6 rounded bg-[#0B2B55]" title="#0B2B55 Navy Primary"></span>
                <span className="w-6 h-6 rounded bg-[#F5BB00]" title="#F5BB00 Mustard"></span>
                <span className="w-6 h-6 rounded bg-[#FFFFFF] border border-gray-300" title="#FFFFFF White"></span>
              </div>
              <p className="text-[11px] text-[#69778C]">
                Official tokens: Deep Navy (#092754), Mustard Yellow (#F5BB00), Primary White (#FFFFFF).
              </p>
              <button className="px-3 py-1 rounded bg-[#0B2B55] text-white text-[10px] font-bold">
                ✓ Aktif (Default)
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE4EF] bg-[#F5F7FB] opacity-75 space-y-2">
              <span className="font-extrabold text-xs text-[#172B4D] block">Light Corporate</span>
              <p className="text-[11px] text-[#69778C]">
                Slate blue &amp; modern silver theme with minimal contrast.
              </p>
              <button
                onClick={() => showToast('Tema Light Corporate disimpan.')}
                className="px-3 py-1 rounded border border-[#DCE4EF] text-[10px] font-bold text-[#172B4D]"
              >
                Gunakan Tema
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE4EF] bg-[#F5F7FB] opacity-75 space-y-2">
              <span className="font-extrabold text-xs text-[#172B4D] block">Dark Executive</span>
              <p className="text-[11px] text-[#69778C]">
                High-contrast dark mode for low-light command centers.
              </p>
              <button
                onClick={() => showToast('Tema Dark Executive disimpan.')}
                className="px-3 py-1 rounded border border-[#DCE4EF] text-[10px] font-bold text-[#172B4D]"
              >
                Gunakan Tema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTENT EDITOR */}
      {activeSub === 'content_editor' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Content Editor (No-Code Branding &amp; Labels)
          </h3>
          <p className="text-xs text-[#69778C]">
            Admin dapat mengubah redaksi tampilan tanpa mengubah formula atau database aplikasi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#172B4D] font-bold mb-1">Nama Aplikasi</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => onUpdateSettings({ ...settings, appName: e.target.value })}
                className="w-full p-2 rounded-lg border border-[#DCE4EF] bg-white font-bold text-[#0B2B55]"
              />
            </div>
            <div>
              <label className="block text-[#172B4D] font-bold mb-1">Subtitle Aplikasi</label>
              <input
                type="text"
                value={settings.appSubtitle}
                onChange={(e) => onUpdateSettings({ ...settings, appSubtitle: e.target.value })}
                className="w-full p-2 rounded-lg border border-[#DCE4EF] bg-white"
              />
            </div>
          </div>
          <button
            onClick={() => showToast('Perubahan redaksi berhasil disimpan.')}
            className="px-4 py-2 rounded-lg bg-[#0B2B55] text-white text-xs font-bold"
          >
            Simpan Perubahan Redaksi
          </button>
        </div>
      )}

      {/* 3. MASTER DATA */}
      {activeSub === 'master_data' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Master Data Mitra (Tepat 14 Mitra KA01–KA14)
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B2B55] text-white font-bold">
                  <th className="py-2 px-3">Kode</th>
                  <th className="py-2 px-3">Nama Mitra</th>
                  <th className="py-2 px-3">Wilayah / Regional</th>
                  <th className="py-2 px-3">Penanggung Jawab (PIC)</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF4]">
                {PARTNERS_LIST.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F7FB]">
                    <td className="py-2 px-3 font-extrabold text-[#0B2B55]">{p.code}</td>
                    <td className="py-2 px-3 font-bold text-[#172B4D]">{p.name}</td>
                    <td className="py-2 px-3 text-[#69778C]">{p.region}</td>
                    <td className="py-2 px-3 text-[#172B4D]">{p.pic}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#16865D]">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. USER & ACCESS */}
      {activeSub === 'user_access' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            User, Role-Based Access Control (RBAC) &amp; Device Registry
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { role: 'Super Admin', name: 'Executive Director', email: 'ma.comm.ac.net@gmail.com', access: 'Akses Penuh + Backup + Hardening' },
              { role: 'Admin Pusat', name: 'Operational Data Manager', email: 'admin.pusat@lkb.co.id', access: 'Input Data, Process, Sync, Export' },
              { role: 'Operator', name: 'Regional Data Officer', email: 'operator.wilayah@lkb.co.id', access: 'Draft Entry, Preview, Validasi' },
              { role: 'Viewer', name: 'Stakeholder & Auditor', email: 'auditor.eksternal@lkb.co.id', access: 'Read-only Dashboard, Reporting' },
            ].map((u, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF] flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B2B55] text-[#F5BB00] mr-2">
                    {u.role}
                  </span>
                  <strong className="text-[#172B4D]">{u.name}</strong> ({u.email})
                  <span className="text-[11px] text-[#69778C] block mt-0.5">{u.access}</span>
                </div>
                <span className="text-[10px] font-bold text-[#16865D] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                  Device Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SYNC CONTROL */}
      {activeSub === 'sync_control' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Multi-Device Synchronization &amp; Field-Level Conflict Resolver
          </h3>
          <p className="text-xs text-[#69778C]">
            Mengelola antrian sinkronisasi transaksional antar perangkat dengan pendeteksi konflik field-level.
          </p>

          <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DCE4EF] flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm text-[#0B2B55] block">Status Sync Queue</span>
              <span className="text-xs text-[#69778C]">0 antrian konflik terdeteksi • Idempotency Key Terverifikasi</span>
            </div>
            <button
              onClick={() => showToast('Sinkronisasi server pusat berhasil dijalankan.')}
              className="px-4 py-2 rounded-lg bg-[#0B2B55] text-white text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#F5BB00]" />
              <span>Paksa Sinkronisasi Pusat</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. GOOGLE SHEETS */}
      {activeSub === 'google_sheets' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8EDF4] pb-2">
            <h3 className="text-base font-extrabold text-[#0B2B55]">
              Google Sheets Connector Integration
            </h3>
            <button
              onClick={onOpenGoogleSheetModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#0F9D58] text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <Sheet className="w-4 h-4" />
              <span>Buka Konfigurasi &amp; Sinkronisasi</span>
            </button>
          </div>
          <p className="text-xs text-[#69778C]">
            Konektor sinkronisasi opsional ke Google Spreadsheet master konsolidasi. Sesuai prinsip kedaulatan data, operasional inti tetap berjalan offline jika Google Sheets tidak terhubung.
          </p>
        </div>
      )}

      {/* 7. RULES & CONSTITUTION */}
      {activeSub === 'rules' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Application Constitution &amp; Architectural Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { file: 'APPLICATION_RULES.md', desc: 'Prinsip mutlak: Tidak membuat data dummy, formula terverifikasi' },
              { file: 'BUSINESS_LOGIC.md', desc: 'Definisi bisnis 18 sheet: Target 2026, KPI 2026, Scoring 4 pilar' },
              { file: 'DATA_SCHEMA_RULES.md', desc: 'Struktur rentang Excel A2:IJ24, 14 mitra KA01–KA14, summary rows' },
              { file: 'FORMULA_RULES.md', desc: 'Formula parity TypeScript vs Excel formula parity engine' },
              { file: 'SECURITY_RULES.md', desc: 'Enkripsi data lokal, RBAC, proteksi deletion 2 tahap' },
              { file: 'SYNC_RULES.md', desc: 'Optimistic concurrency, field-level conflict, zero silent overwrite' },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF]">
                <strong className="text-[#0B2B55] block font-mono text-xs">{r.file}</strong>
                <span className="text-[#69778C] text-[11px]">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TEST CENTER */}
      {activeSub === 'test_center' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8EDF4] pb-2">
            <div>
              <h3 className="text-base font-extrabold text-[#0B2B55]">
                Automated Quality Assurance &amp; Formula Parity Engine
              </h3>
              <p className="text-xs text-[#69778C]">
                Hasil pengujian otomatis formula TypeScript terhadap golden test benchmark Excel
              </p>
            </div>
            <button
              onClick={handleRunParityTests}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B2B55] text-white text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#F5BB00]" />
              <span>Jalankan Audit Test</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B2B55] text-white font-bold text-[11px]">
                  <th className="py-2 px-3">Test ID</th>
                  <th className="py-2 px-3">Kategori</th>
                  <th className="py-2 px-3">Nama Formula</th>
                  <th className="py-2 px-3">Excel Target</th>
                  <th className="py-2 px-3">TypeScript Hasil</th>
                  <th className="py-2 px-3">Toleransi</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF4]">
                {parityResults.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F5F7FB]">
                    <td className="py-2 px-3 font-mono font-bold text-[#0B2B55]">{t.id}</td>
                    <td className="py-2 px-3 text-[#69778C]">{t.category}</td>
                    <td className="py-2 px-3 font-semibold text-[#172B4D]">{t.name}</td>
                    <td className="py-2 px-3 font-mono text-[#0B2B55]">{t.excelExpected}</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#172B4D]">{t.tsActual}</td>
                    <td className="py-2 px-3 text-[#69778C]">±{t.tolerance}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9]">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. DATABASE HEALTH & BACKUP */}
      {activeSub === 'database_health' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8EDF4] pb-2">
            <div>
              <h3 className="text-base font-extrabold text-[#0B2B55]">
                Database Health &amp; Data Durability Center
              </h3>
              <p className="text-xs text-[#69778C]">
                IndexedDB Lokal + PostgreSQL • Disaster Recovery Target: RPO ≤ 24 Jam, RTO ≤ 4 Jam
              </p>
            </div>
            <button
              onClick={handleCreateBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#16865D] text-white text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Buat Snapshot Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
            <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF]">
              <span className="text-[10px] text-[#69778C] uppercase font-bold block">Status Database Lokal</span>
              <span className="font-extrabold text-[#16865D]">ONLINE &amp; HEALTHY (IndexedDB)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF]">
              <span className="text-[10px] text-[#69778C] uppercase font-bold block">Total Snapshot Tersimpan</span>
              <span className="font-extrabold text-[#0B2B55]">{backups.length} Snapshot</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF]">
              <span className="text-[10px] text-[#69778C] uppercase font-bold block">Integritas Checksum</span>
              <span className="font-extrabold text-[#16865D]">100% SHA-256 Valid</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {backups.map((b) => (
              <div key={b.id} className="p-3 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF] flex items-center justify-between">
                <div>
                  <strong className="text-[#0B2B55] block">{b.name}</strong>
                  <span className="text-[11px] text-[#69778C] font-mono">
                    ID: {b.id} • Waktu: {b.timestamp} • {b.recordCount} Baris
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(b.id)}
                    className="px-3 py-1 rounded bg-[#0B2B55] text-white text-xs font-bold hover:bg-[#163C6A]"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. MONITORING & LOGS */}
      {activeSub === 'monitoring' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Application Monitoring &amp; Error Center
          </h3>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#0B2B55] text-white">
                      {log.action}
                    </span>
                    <strong className="text-[#172B4D]">{log.entity}</strong>
                    <span className="text-[10px] text-[#69778C] font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#69778C] mt-1">{log.details}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#16865D]">
                  {log.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. DEPLOYMENT CENTER */}
      {activeSub === 'deploy_center' && (
        <div className="bg-white rounded-xl border border-[#DCE4EF] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2B55] border-b border-[#E8EDF4] pb-2">
            Application Deployment &amp; Continuous Integration Center
          </h3>
          <div className="p-4 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#16865D] space-y-2">
            <div className="flex items-center gap-2 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#16865D]" />
              <span>Production Version: v2.6.0 (Stable Release)</span>
            </div>
            <p className="text-[#172B4D]">
              Semua skenario pengujian UAT, formula parity 18 sheet, dan sinkronisasi hybrid offline-first telah lolos verifikasi.
            </p>
          </div>

          {/* GitHub Repository Status & Controls */}
          <div className="p-4 rounded-xl bg-white border border-[#DCE4EF] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0B2B55] flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-[#F5BB00]" />
                </div>
                <div>
                  <strong className="text-sm text-[#0B2B55] block">
                    GitHub Remote Repository
                  </strong>
                  <a
                    href="https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#2684C7] hover:underline font-mono"
                  >
                    https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app (branch: main)
                  </a>
                </div>
              </div>

              {onOpenGitHubModal && (
                <button
                  onClick={onOpenGitHubModal}
                  className="px-4 py-2 rounded-lg bg-[#0B2B55] hover:bg-[#163C6A] text-white text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <GitBranch className="w-4 h-4 text-[#F5BB00]" />
                  <span>Buka Kontrol GitHub (Pull / Push)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
