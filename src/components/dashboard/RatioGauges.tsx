import React from 'react';
import { RatioMetric, TargetMetric } from '../../types';
import { ArrowUp, ArrowDown, PieChart, Target } from 'lucide-react';

interface RatioGaugesProps {
  ratios: RatioMetric[];
  targetAchievements: TargetMetric[];
}

export const RatioGauges: React.FC<RatioGaugesProps> = ({ ratios, targetAchievements }) => {
  const renderCircleProgress = (percent: number, strokeColor = '#F5BB00') => {
    const strokeDash = Math.min(Math.max(percent, 0), 100);
    return (
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[#E8EDF4]"
            strokeWidth="3.2"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            stroke={strokeColor}
            strokeDasharray={`${strokeDash}, 100`}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute text-[11px] font-black text-[#0B2B55]">
          {percent.toFixed(1).replace('.', ',')}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* PANEL 1: KINERJA RASIO DAN PEMBINAAN */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8EDF4]">
          <PieChart className="w-4 h-4 text-[#F5BB00]" />
          <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
            Kinerja Rasio dan Pembinaan
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ratios.map((item) => {
            const isUp = item.momDiffPercent >= 0;
            return (
              <div key={item.id} className="flex flex-col items-center text-center p-2 rounded-lg bg-[#F5F7FB]/50 border border-[#E8EDF4]">
                <span className="text-[10px] font-extrabold text-[#0B2B55] mb-1.5 h-6 flex items-center">
                  {item.name}
                </span>

                {renderCircleProgress(item.percentage, '#F5BB00')}

                <span className="text-[10px] font-bold text-[#172B4D] mt-2">
                  {item.numerator.toLocaleString('id-ID')} : {item.denominator.toLocaleString('id-ID')}
                </span>

                <div
                  className={`flex items-center gap-0.5 text-[10px] font-bold mt-0.5 ${
                    isUp ? 'text-[#16865D]' : 'text-[#D94848]'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3 h-3 text-[#16865D]" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-[#D94848]" />
                  )}
                  <span>
                    {isUp ? '+' : ''}
                    {item.momDiffPercent.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PANEL 2: TARGET ACHIEVEMENT & BINA AB */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8EDF4]">
          <Target className="w-4 h-4 text-[#F5BB00]" />
          <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
            Target Achievement & Bina AB
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {targetAchievements.map((item) => {
            const isUp = item.momDiffPercent >= 0;
            return (
              <div key={item.id} className="flex flex-col items-center text-center p-2 rounded-lg bg-[#F5F7FB]/50 border border-[#E8EDF4]">
                <span className="text-[10px] font-extrabold text-[#0B2B55] mb-1.5 h-6 flex items-center">
                  {item.name}
                </span>

                {renderCircleProgress(item.percentage, '#0B2B55')}

                <span className="text-[10px] font-bold text-[#172B4D] mt-2">
                  {item.realisasi.toLocaleString('id-ID')} : {item.target.toLocaleString('id-ID')}
                </span>

                <div
                  className={`flex items-center gap-0.5 text-[10px] font-bold mt-0.5 ${
                    isUp ? 'text-[#16865D]' : 'text-[#D94848]'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3 h-3 text-[#16865D]" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-[#D94848]" />
                  )}
                  <span>
                    {isUp ? '+' : ''}
                    {item.momDiffPercent.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
