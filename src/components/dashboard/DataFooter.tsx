import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import { SyncStatus } from '../../types';

interface DataFooterProps {
  syncStatus: SyncStatus;
}

export const DataFooter: React.FC<DataFooterProps> = ({ syncStatus }) => {
  return (
    <footer className="bg-white rounded-xl border border-[#DCE4EF] p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#69778C]">
      {/* Left side info */}
      <div className="flex flex-wrap items-center gap-2 font-medium">
        <Info className="w-4 h-4 text-[#F5BB00] shrink-0" />
        <span>
          <strong className="text-[#172B4D]">Terakhir Proses :</strong>{' '}
          {syncStatus.lastProcessed}
        </span>
        <span className="text-[#CBD5E1]">|</span>
        <span>
          <strong className="text-[#172B4D]">Terakhir Sinkronisasi :</strong>{' '}
          {syncStatus.lastSync}
        </span>
        <span className="text-[#CBD5E1]">|</span>
        <span>
          <strong className="text-[#172B4D]">Sumber Data :</strong>{' '}
          {syncStatus.engineVersion}
        </span>
      </div>

      {/* Right side status badge */}
      <div className="flex items-center gap-1.5 font-extrabold text-[#172B4D]">
        <CheckCircle2 className="w-4 h-4 text-[#F5BB00] shrink-0 fill-[#FFF3C4]" />
        <span>Data Lengkap &amp; Valid</span>
      </div>
    </footer>
  );
};
