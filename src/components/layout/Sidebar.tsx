import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Database,
  TrendingUp,
  Settings,
  Trash2,
  ChevronDown,
  ChevronRight,
  WifiOff,
  HardDrive,
  RefreshCw,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { SyncStatus } from '../../types';

interface SidebarProps {
  activeDomain: string;
  activeSubDomain?: string;
  onSelectDomain: (domain: string, subDomain?: string) => void;
  syncStatus: SyncStatus;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDomain,
  activeSubDomain,
  onSelectDomain,
  syncStatus,
}) => {
  const [dataOpen, setDataOpen] = React.useState(activeDomain === 'data');
  const [settingOpen, setSettingOpen] = React.useState(activeDomain === 'settings');

  const dataSubmenus = [
    { id: 'processing', label: 'Proccesing' },
    { id: 'data_sheet', label: 'Data' },
    { id: 'control', label: 'Control' },
    { id: 'target_2026', label: 'Target 2026' },
    { id: 'kpi_2026', label: 'KPI 2026' },
    { id: 'output_pku', label: 'OUTPUT_PKU (QLY)' },
    { id: 'rp_u', label: 'RP-U' },
    { id: 'pab_u', label: 'PAB-U' },
    { id: 'rp_k', label: 'RP-K' },
    { id: 'pab_k', label: 'PAB-K' },
    { id: 'bina_ab_u', label: 'BINA AB-U' },
    { id: 'bina_ab_k', label: 'BINA AB-K' },
    { id: 'ppb_u', label: 'PPB-U' },
    { id: 'ppb_k', label: 'PPB-K' },
    { id: 'media', label: 'MEDIA' },
    { id: 'scoring', label: 'SCORING' },
  ];

  const settingSubmenus = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'content_editor', label: 'Content Editor' },
    { id: 'master_data', label: 'Master Data' },
    { id: 'user_access', label: 'User & Access' },
    { id: 'sync_control', label: 'Sync Control' },
    { id: 'google_sheets', label: 'Google Sheets' },
    { id: 'rules', label: 'Rules & Constitution' },
    { id: 'test_center', label: 'QA Test Center' },
    { id: 'database_health', label: 'Database & Backup' },
    { id: 'monitoring', label: 'Monitoring & Logs' },
    { id: 'deploy_center', label: 'Deployment Center' },
  ];

  return (
    <aside className="w-64 bg-[#092754] text-white flex flex-col h-screen shrink-0 border-r border-[#123765] select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#123765] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#0B2B55] border border-[#F5BB00]/40 flex items-center justify-center shadow-inner">
          <BarChart3 className="w-5 h-5 text-[#F5BB00]" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white leading-tight">
            APP DASHBOARD LKB
          </h1>
          <p className="text-[10px] text-gray-300 tracking-wider uppercase font-medium">
            Central Management System
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[#163C6A]">
        {/* DOMAIN 1: DASHBOARD */}
        <button
          onClick={() => onSelectDomain('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeDomain === 'dashboard'
              ? 'bg-[#F5BB00] text-[#092754] shadow-md'
              : 'text-gray-200 hover:bg-[#123765] hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* DOMAIN 2: UPDATE DATA */}
        <button
          onClick={() => onSelectDomain('update-data')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeDomain === 'update-data'
              ? 'bg-[#F5BB00] text-[#092754] shadow-md'
              : 'text-gray-200 hover:bg-[#123765] hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          <span>Update Data</span>
        </button>

        {/* DOMAIN 3: DATA (16 Submenus) */}
        <div>
          <button
            onClick={() => {
              setDataOpen(!dataOpen);
              if (activeDomain !== 'data') {
                onSelectDomain('data', 'processing');
              }
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeDomain === 'data'
                ? 'bg-[#163C6A] text-white border-l-4 border-[#F5BB00]'
                : 'text-gray-200 hover:bg-[#123765] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 shrink-0 text-[#F5BB00]" />
              <span>Data</span>
            </div>
            {dataOpen ? (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>

          {dataOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-[#163C6A] space-y-0.5">
              {dataSubmenus.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectDomain('data', sub.id)}
                  className={`w-full text-left py-1.5 px-2 rounded text-[11px] font-medium transition-colors ${
                    activeDomain === 'data' && activeSubDomain === sub.id
                      ? 'text-[#F5BB00] font-bold bg-[#123765]'
                      : 'text-gray-300 hover:text-white hover:bg-[#123765]/50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DOMAIN 4: ANALISA, EVALUASI & REKOMENDASI */}
        <button
          onClick={() => onSelectDomain('analysis')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeDomain === 'analysis'
              ? 'bg-[#F5BB00] text-[#092754] shadow-md'
              : 'text-gray-200 hover:bg-[#123765] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="text-left leading-tight">Analisa, Evaluasi & Rekomendasi</span>
        </button>

        {/* DOMAIN 5: SETTINGS (11 Submenus) */}
        <div>
          <button
            onClick={() => {
              setSettingOpen(!settingOpen);
              if (activeDomain !== 'settings') {
                onSelectDomain('settings', 'appearance');
              }
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeDomain === 'settings'
                ? 'bg-[#163C6A] text-white border-l-4 border-[#F5BB00]'
                : 'text-gray-200 hover:bg-[#123765] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0 text-[#F5BB00]" />
              <span>Setting</span>
            </div>
            {settingOpen ? (
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            )}
          </button>

          {settingOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-[#163C6A] space-y-0.5">
              {settingSubmenus.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectDomain('settings', sub.id)}
                  className={`w-full text-left py-1.5 px-2 rounded text-[11px] font-medium transition-colors ${
                    activeDomain === 'settings' && activeSubDomain === sub.id
                      ? 'text-[#F5BB00] font-bold bg-[#123765]'
                      : 'text-gray-300 hover:text-white hover:bg-[#123765]/50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DOMAIN 6: HAPUS DATA APLIKASI */}
        <button
          onClick={() => onSelectDomain('delete-data')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeDomain === 'delete-data'
              ? 'bg-[#D94848] text-white shadow-md'
              : 'text-red-300 hover:bg-red-950/40 hover:text-red-200'
          }`}
        >
          <Trash2 className="w-4 h-4 shrink-0 text-red-400" />
          <span>Hapus Data Aplikasi</span>
        </button>
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3 m-3 bg-[#0B2B55] rounded-xl border border-[#163C6A] text-[11px] space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5BB00] animate-pulse"></span>
          <span className="font-semibold text-amber-300">Mode Offline</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <HardDrive className="w-3.5 h-3.5 text-blue-300 shrink-0" />
          <span>Data Lokal : Aktif</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${
              syncStatus.syncState === 'SYNCING' ? 'animate-spin text-[#F5BB00]' : 'text-gray-400'
            }`}
          />
          <span>
            Sync :{' '}
            {syncStatus.unpushedChangesCount > 0
              ? 'Menunggu'
              : 'Tersinkron'}
          </span>
        </div>
      </div>
    </aside>
  );
};
