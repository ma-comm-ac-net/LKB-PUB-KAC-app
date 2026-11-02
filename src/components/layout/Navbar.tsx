import React from 'react';
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
  BarChart3,
  Layers,
  GitBranch,
} from 'lucide-react';
import { PartnerId } from '../../types';
import { PARTNERS_LIST } from '../../data/initialData';

interface NavbarProps {
  selectedPeriod: string;
  onChangePeriod: (period: string) => void;
  selectedYear: string;
  onChangeYear: (year: string) => void;
  selectedPartner: PartnerId;
  onChangePartner: (partner: PartnerId) => void;
  onRefresh: () => void;
  onExport: () => void;
  onOpenGitHubModal?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedPeriod,
  onChangePeriod,
  selectedYear,
  onChangeYear,
  selectedPartner,
  onChangePartner,
  onRefresh,
  onExport,
  onOpenGitHubModal,
  isRefreshing,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const months = [
    'Januari 2026',
    'Februari 2026',
    'Maret 2026',
    'April 2026',
    'Mei 2026',
    'Juni 2026',
    'Juli 2026',
    'Agustus 2026',
    'September 2026',
    'Oktober 2026',
    'November 2026',
    'Desember 2026',
  ];

  return (
    <header className="h-16 bg-white border-b border-[#DCE4EF] px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 bg-[#F5BB00] rounded-full"></div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#0B2B55] leading-none">
            APP DASHBOARD LKB
          </h1>
          <p className="text-xs text-[#69778C] font-medium tracking-wide mt-0.5">
            Central Management System
          </p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Periode Data Selector */}
        <div className="flex items-center bg-[#F5F7FB] border border-[#DCE4EF] rounded-lg px-3 py-1.5 text-xs">
          <Calendar className="w-4 h-4 text-[#F5BB00] mr-2 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-[#69778C] font-semibold uppercase leading-tight">
              Periode Data
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => onChangePeriod(e.target.value)}
              className="bg-transparent font-bold text-[#172B4D] focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tahun Selector */}
        <div className="flex items-center bg-[#F5F7FB] border border-[#DCE4EF] rounded-lg px-3 py-1.5 text-xs">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-[#69778C] font-semibold uppercase leading-tight">
              Tahun
            </span>
            <select
              value={selectedYear}
              onChange={(e) => onChangeYear(e.target.value)}
              className="bg-transparent font-bold text-[#172B4D] focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Mitra Selector */}
        <div className="flex items-center bg-[#F5F7FB] border border-[#DCE4EF] rounded-lg px-3 py-1.5 text-xs">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-[#69778C] font-semibold uppercase leading-tight">
              Mitra
            </span>
            <select
              value={selectedPartner}
              onChange={(e) => onChangePartner(e.target.value as PartnerId)}
              className="bg-transparent font-bold text-[#172B4D] focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="ALL">Keseluruhan</option>
              {PARTNERS_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 ml-2 border-l border-[#DCE4EF] pl-3">
          {/* Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh Data & Calculations"
            className="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F7FB] text-[#172B4D] border border-transparent hover:border-[#DCE4EF] transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#0B2B55] ${isRefreshing ? 'animate-spin text-[#F5BB00]' : ''}`}
            />
            <span className="text-[9px] font-medium text-[#69778C] mt-0.5">Refresh</span>
          </button>

          {/* Export */}
          <button
            onClick={onExport}
            title="Export Dashboard / Excel"
            className="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F5F7FB] text-[#172B4D] border border-transparent hover:border-[#DCE4EF] transition-colors"
          >
            <Download className="w-4 h-4 text-[#0B2B55]" />
            <span className="text-[9px] font-medium text-[#69778C] mt-0.5">Export</span>
          </button>

          {/* GitHub Sync */}
          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              title="GitHub Pull & Push (ma-comm-ac-net/LKB-PUB-KAC-app)"
              className="flex flex-col items-center justify-center w-11 h-10 rounded-lg bg-[#0B2B55] hover:bg-[#163C6A] text-white transition-colors shadow-xs"
            >
              <GitBranch className="w-4 h-4 text-[#F5BB00]" />
              <span className="text-[9px] font-bold text-white mt-0.5">GitHub</span>
            </button>
          )}

          {/* Full Screen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex flex-col items-center justify-center w-11 h-10 rounded-lg hover:bg-[#F5F7FB] text-[#172B4D] border border-transparent hover:border-[#DCE4EF] transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#0B2B55]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[#0B2B55]" />
            )}
            <span className="text-[9px] font-medium text-[#69778C] mt-0.5">Full Screen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
