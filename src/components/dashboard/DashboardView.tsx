import React from 'react';
import {
  KpiMetric,
  AnnualChartDataPoint,
  RatioMetric,
  TargetMetric,
  MomComparisonRow,
  PartnerId,
  SyncStatus,
} from '../../types';
import { KpiCards } from './KpiCards';
import { AnnualCharts } from './AnnualCharts';
import { RatioGauges } from './RatioGauges';
import { MomTable } from './MomTable';
import { PartnerSelector } from './PartnerSelector';
import { DataFooter } from './DataFooter';

interface DashboardViewProps {
  kpis: KpiMetric[];
  annualData: AnnualChartDataPoint[];
  ratios: RatioMetric[];
  targetAchievements: TargetMetric[];
  momRows: MomComparisonRow[];
  selectedPartner: PartnerId;
  onSelectPartner: (partner: PartnerId) => void;
  syncStatus: SyncStatus;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  kpis,
  annualData,
  ratios,
  targetAchievements,
  momRows,
  selectedPartner,
  onSelectPartner,
  syncStatus,
}) => {
  return (
    <div className="space-y-4 p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)]">
      {/* 1. Four KPI Panels */}
      <KpiCards kpis={kpis} />

      {/* 2. Three Annual Graph Panels */}
      <AnnualCharts annualData={annualData} />

      {/* 3. Two Percentage Summary Panels and MoM Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RatioGauges ratios={ratios} targetAchievements={targetAchievements} />
        </div>
        <div className="xl:col-span-1">
          <MomTable rows={momRows} />
        </div>
      </div>

      {/* 4. Partner Navigation */}
      <PartnerSelector
        selectedPartner={selectedPartner}
        onSelectPartner={onSelectPartner}
      />

      {/* 5. Data Status Footer */}
      <DataFooter syncStatus={syncStatus} />
    </div>
  );
};
