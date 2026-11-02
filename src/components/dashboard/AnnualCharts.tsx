import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { AnnualChartDataPoint } from '../../types';

interface AnnualChartsProps {
  annualData: AnnualChartDataPoint[];
}

export const AnnualCharts: React.FC<AnnualChartsProps> = ({ annualData }) => {
  // Active series toggles for Chart 3
  const [visibleSeries, setVisibleSeries] = React.useState<Record<string, boolean>>({
    rp: true,
    rpK: true,
    pab: true,
    pabK: true,
    binaAb: true,
    tidakTerbina: true,
    ppb: true,
  });

  const toggleSeries = (key: string) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formattedChartData = annualData.map((d) => ({
    ...d,
    totalAb:
      d.abAktif !== null && d.binaAb !== null && d.tidakTerbina !== null
        ? (d.abAktif || 0) + (d.binaAb || 0) + (d.tidakTerbina || 0)
        : null,
  }));

  const customTooltipStyle = {
    backgroundColor: '#0B2B55',
    color: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #163C6A',
    fontSize: '11px',
    padding: '8px 12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* PANEL 1: ANNUAL PERFORMANCE - RP & PAB */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F5BB00]" />
            <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
              Annual Performance – RP & PAB
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF]">
            2026
          </span>
        </div>

        {/* Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 140]} tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Line
                type="monotone"
                dataKey="rp"
                name="RP"
                stroke="#F5BB00"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#F5BB00', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              >
                <LabelList dataKey="rp" position="top" fill="#172B4D" fontSize={9} fontWeight="bold" />
              </Line>
              <Line
                type="monotone"
                dataKey="pab"
                name="PAB"
                stroke="#0B2B55"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0B2B55', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              >
                <LabelList dataKey="pab" position="top" fill="#0B2B55" fontSize={9} fontWeight="bold" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#E8EDF4] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5BB00]"></span>
            <span className="font-bold text-[#172B4D] text-[11px]">RP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-2 rounded bg-[#0B2B55]"></span>
            <span className="font-bold text-[#0B2B55] text-[11px]">PAB</span>
          </div>
        </div>
      </div>

      {/* PANEL 2: ANNUAL AB PERFORMANCE & DEVELOPMENT */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F5BB00]" />
            <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
              Annual AB Performance & Development
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF]">
            2026
          </span>
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 180]} tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="abAktif" name="AB Aktif" stackId="a" fill="#0B2B55" />
              <Bar dataKey="binaAb" name="Bina AB" stackId="a" fill="#F5BB00" />
              <Bar dataKey="tidakTerbina" name="Tidak Terbina" stackId="a" fill="#829DBE" radius={[3, 3, 0, 0]}>
                <LabelList dataKey="totalAb" position="top" fill="#0B2B55" fontSize={9} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#E8EDF4] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#0B2B55]"></span>
            <span className="font-bold text-[10px] text-[#172B4D]">AB Aktif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F5BB00]"></span>
            <span className="font-bold text-[10px] text-[#172B4D]">Bina AB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#829DBE]"></span>
            <span className="font-bold text-[10px] text-[#172B4D]">Tidak Terbina</span>
          </div>
        </div>
      </div>

      {/* PANEL 3: ANNUAL PERFORMANCE - COMPLETE INDICATORS */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F5BB00]" />
            <h4 className="font-extrabold text-xs text-[#0B2B55] uppercase tracking-wider">
              Annual Performance – Complete Indicators
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF]">
            2026
          </span>
        </div>

        {/* Multi-series chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF4" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 140]} tick={{ fontSize: 10, fill: '#69778C' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />

              {visibleSeries.rp && (
                <Line
                  type="monotone"
                  dataKey="rp"
                  name="RP"
                  stroke="#F5BB00"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#F5BB00' }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.rpK && (
                <Line
                  type="monotone"
                  dataKey="rpK"
                  name="RP-K"
                  stroke="#123765"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.pab && (
                <Line
                  type="monotone"
                  dataKey="pab"
                  name="PAB"
                  stroke="#0B2B55"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0B2B55' }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.pabK && (
                <Line
                  type="monotone"
                  dataKey="pabK"
                  name="PAB-K"
                  stroke="#2684C7"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.binaAb && (
                <Line
                  type="monotone"
                  dataKey="binaAb"
                  name="Bina AB"
                  stroke="#DCA400"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.tidakTerbina && (
                <Line
                  type="monotone"
                  dataKey="tidakTerbina"
                  name="Tidak Terbina"
                  stroke="#829DBE"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
              )}
              {visibleSeries.ppb && (
                <Line
                  type="monotone"
                  dataKey="ppb"
                  name="PPB"
                  stroke="#16865D"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Series Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-[#E8EDF4]">
          {[
            { key: 'rp', label: 'RP', color: '#F5BB00' },
            { key: 'rpK', label: 'RP-K', color: '#123765' },
            { key: 'pab', label: 'PAB', color: '#0B2B55' },
            { key: 'pabK', label: 'PAB-K', color: '#2684C7' },
            { key: 'binaAb', label: 'Bina AB', color: '#DCA400' },
            { key: 'tidakTerbina', label: 'Tidak Terbina', color: '#829DBE' },
            { key: 'ppb', label: 'PPB', color: '#16865D' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-opacity ${
                visibleSeries[s.key] ? 'opacity-100' : 'opacity-40 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span className="text-[#172B4D]">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
