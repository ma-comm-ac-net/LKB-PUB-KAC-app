import React from 'react';
import { Table, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { MomComparisonRow } from '../../types';

interface MomTableProps {
  rows: MomComparisonRow[];
  previousMonthLabel?: string;
  currentMonthLabel?: string;
}

export const MomTable: React.FC<MomTableProps> = ({
  rows,
  previousMonthLabel = 'Jul 2026',
  currentMonthLabel = 'Agt 2026',
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8EDF4]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#F5BB00]" />
          <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
            Month-Over-Month Performance Comparison
          </h4>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF3C4] border border-[#F5BB00]/40 text-[#8C6B00] font-bold text-[10px]">
          <span>{previousMonthLabel}</span>
          <span className="text-[#0B2B55] font-black">vs</span>
          <span className="text-[#0B2B55] font-black">{currentMonthLabel}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#DCE4EF] text-[#69778C] font-semibold text-[11px] bg-[#F5F7FB]">
              <th className="py-2 px-2.5 w-10">No</th>
              <th className="py-2 px-3">Indikator</th>
              <th className="py-2 px-3 text-right">Bulan Lalu</th>
              <th className="py-2 px-3 text-right">Bulan Ini</th>
              <th className="py-2 px-3 text-right">Selisih</th>
              <th className="py-2 px-3 text-right">Perubahan %</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF4]">
            {rows.map((row) => {
              const isImproved = row.status === 'IMPROVED';
              const isDeclined = row.status === 'DECLINED';

              return (
                <tr key={row.no} className="hover:bg-[#F5F7FB]/60 transition-colors">
                  <td className="py-1.5 px-2.5 font-bold text-[#69778C]">{row.no}</td>
                  <td className="py-1.5 px-3 font-bold text-[#172B4D]">{row.indikator}</td>
                  <td className="py-1.5 px-3 text-right text-[#69778C] font-medium">
                    {typeof row.bulanLalu === 'number'
                      ? row.bulanLalu.toLocaleString('id-ID')
                      : row.bulanLalu}
                  </td>
                  <td className="py-1.5 px-3 text-right font-black text-[#0B2B55]">
                    {typeof row.bulanIni === 'number'
                      ? row.bulanIni.toLocaleString('id-ID')
                      : row.bulanIni}
                  </td>
                  <td
                    className={`py-1.5 px-3 text-right font-black ${
                      String(row.selisih).startsWith('-')
                        ? 'text-[#D94848]'
                        : 'text-[#2684C7]'
                    }`}
                  >
                    {row.selisih}
                  </td>
                  <td
                    className={`py-1.5 px-3 text-right font-black ${
                      isImproved ? 'text-[#16865D]' : isDeclined ? 'text-[#D94848]' : 'text-[#69778C]'
                    }`}
                  >
                    {row.perubahanPercent}
                  </td>
                  <td className="py-1.5 px-3 text-center">
                    {isImproved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9]">
                        <ArrowUp className="w-2.5 h-2.5" />
                        Improved
                      </span>
                    ) : isDeclined ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFEBEE] text-[#D94848] border border-[#FFCDD2]">
                        <ArrowDown className="w-2.5 h-2.5" />
                        Declined
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F7FB] text-[#69778C]">
                        Unchanged
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
