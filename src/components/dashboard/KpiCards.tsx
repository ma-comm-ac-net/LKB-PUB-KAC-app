import React from 'react';
import {
  Target,
  Award,
  Users,
  Layers,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { KpiMetric } from '../../types';

interface KpiCardsProps {
  kpis: KpiMetric[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-5 h-5 text-[#F5BB00]" />;
      case 'ribbon':
        return <Award className="w-5 h-5 text-[#F5BB00]" />;
      case 'users':
        return <Users className="w-5 h-5 text-[#F5BB00]" />;
      case 'layers':
      default:
        return <Layers className="w-5 h-5 text-[#F5BB00]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const isUp = kpi.momDiffPercent >= 0;
        const diffAbs = Math.abs(kpi.momDiffPercent).toFixed(1).replace('.', ',');

        return (
          <div
            key={kpi.id}
            className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B2B55] flex items-center justify-center">
                  {getIcon(kpi.iconName)}
                </div>
                <h3 className="font-extrabold text-[#0B2B55] text-base tracking-wide">
                  {kpi.title}
                </h3>
              </div>
              <BarChart2 className="w-4 h-4 text-[#F5BB00]" />
            </div>

            {/* Numbers Row */}
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-[10px] text-[#69778C] font-semibold uppercase">
                    KPI
                  </span>
                  <span className="text-xl font-black text-[#172B4D]">
                    {kpi.kpi.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#69778C] font-semibold uppercase">
                    Target
                  </span>
                  <span className="text-xl font-black text-[#172B4D]">
                    {kpi.target.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#69778C] font-semibold uppercase">
                    Realisasi
                  </span>
                  <span className="text-xl font-black text-[#172B4D]">
                    {kpi.realisasi.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Circular Achievement Badge */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#E8EDF4]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0B2B55]"
                    strokeDasharray={`${Math.min(kpi.achievementPercent, 100)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[10px] font-black text-[#0B2B55] block leading-tight">
                    {kpi.achievementPercent.toFixed(2).replace('.', ',')}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row Badges */}
            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E8EDF4] text-xs">
              {/* Status Badge */}
              {kpi.status === 'ACHIEVED' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B2B55] text-white font-bold text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#F5BB00]" />
                  <span>Achieved</span>
                </div>
              ) : kpi.status === 'ON_TRACK' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5BB00] text-[#092754] font-bold text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#092754]" />
                  <span>On Track</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3C4] text-[#8C6B00] border border-[#F5BB00]/30 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#DCA400]" />
                  <span>Below Target</span>
                </div>
              )}

              {/* Month-over-Month Delta */}
              <div
                className={`flex items-center gap-0.5 font-bold text-[11px] ${
                  isUp ? 'text-[#16865D]' : 'text-[#D94848]'
                }`}
              >
                {isUp ? (
                  <ArrowUp className="w-3.5 h-3.5 text-[#16865D]" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 text-[#D94848]" />
                )}
                <span>
                  {isUp ? '+' : '-'}
                  {diffAbs}% {kpi.previousMonthLabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
