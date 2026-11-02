import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  PartnerId,
  UpdateDataRow,
  AppSettingState,
  SyncStatus,
} from './types';
import { StorageService } from './services/storageService';
import { CalculationEngine } from './services/calculationEngine';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { UpdateDataView } from './components/updateData/UpdateDataView';
import { DataSheetsView } from './components/dataSheets/DataSheetsView';
import { AnalysisView } from './components/analysis/AnalysisView';
import { SettingsView } from './components/settings/SettingsView';
import { DeleteDataView } from './components/dangerZone/DeleteDataView';
import { GoogleSheetsSyncModal } from './components/common/GoogleSheetsSyncModal';
import { GitHubSyncModal } from './components/common/GitHubSyncModal';

export default function App() {
  // Navigation State
  const [activeDomain, setActiveDomain] = useState<string>('dashboard');
  const [activeSubDomain, setActiveSubDomain] = useState<string | undefined>(undefined);

  // Filter State
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Agustus 2026');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedPartner, setSelectedPartner] = useState<PartnerId>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Core Data State
  const [tableRows, setTableRows] = useState<UpdateDataRow[]>(() => StorageService.getRows());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => StorageService.getSyncStatus());
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Settings State
  const [appSettings, setAppSettings] = useState<AppSettingState>({
    theme: 'CORPORATE',
    appName: 'APP DASHBOARD LKB',
    appSubtitle: 'Central Management System',
    sidebarDensity: 'normal',
    fontFamily: 'Inter',
  });

  // Dynamic calculations based on global state and selected partner
  const kpis = useMemo(
    () => CalculationEngine.getKpisForPartner(selectedPartner, tableRows),
    [selectedPartner, tableRows]
  );

  const annualData = useMemo(
    () => CalculationEngine.getAnnualDataForPartner(selectedPartner),
    [selectedPartner]
  );

  const ratios = useMemo(
    () => CalculationEngine.getRatiosForPartner(selectedPartner, tableRows),
    [selectedPartner, tableRows]
  );

  const targetAchievements = useMemo(
    () => CalculationEngine.getTargetAchievementsForPartner(selectedPartner, tableRows),
    [selectedPartner, tableRows]
  );

  const momRows = useMemo(
    () => CalculationEngine.getMomComparisonForPartner(selectedPartner, tableRows),
    [selectedPartner, tableRows]
  );

  const handleSelectDomain = (domain: string, subDomain?: string) => {
    setActiveDomain(domain);
    setActiveSubDomain(subDomain);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRows = (newRows: UpdateDataRow[]) => {
    setTableRows(newRows);
    StorageService.saveRows(newRows);
    setSyncStatus(StorageService.getSyncStatus());
  };

  const handleProcessData = (newRows: UpdateDataRow[]) => {
    setTableRows(newRows);
    StorageService.saveRows(newRows);
    setSyncStatus(StorageService.getSyncStatus());
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshedRows = StorageService.getRows();
      const recalculated = CalculationEngine.recalculateTable(refreshedRows);
      setTableRows(recalculated);
      setSyncStatus(StorageService.getSyncStatus());
      setIsRefreshing(false);
    }, 400);
  };

  const handleExport = () => {
    const ws1 = XLSX.utils.json_to_sheet(tableRows);
    const ws2 = XLSX.utils.json_to_sheet(momRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'UPDATE DATA');
    XLSX.utils.book_append_sheet(wb, ws2, 'MOM COMPARISON');
    XLSX.writeFile(wb, `APP_DASHBOARD_LKB_${selectedPeriod.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] font-sans text-[#172B4D] antialiased">
      {/* 6-Domain Sidebar */}
      <Sidebar
        activeDomain={activeDomain}
        activeSubDomain={activeSubDomain}
        onSelectDomain={handleSelectDomain}
        syncStatus={syncStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar Header */}
        <Navbar
          selectedPeriod={selectedPeriod}
          onChangePeriod={setSelectedPeriod}
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
          selectedPartner={selectedPartner}
          onChangePartner={setSelectedPartner}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto">
          {activeDomain === 'dashboard' && (
            <DashboardView
              kpis={kpis}
              annualData={annualData}
              ratios={ratios}
              targetAchievements={targetAchievements}
              momRows={momRows}
              selectedPartner={selectedPartner}
              onSelectPartner={setSelectedPartner}
              syncStatus={syncStatus}
            />
          )}

          {activeDomain === 'update-data' && (
            <UpdateDataView
              rows={tableRows}
              onSaveRows={handleSaveRows}
              onProcessData={handleProcessData}
              onOpenGoogleSheetSyncModal={() => setIsGoogleSheetModalOpen(true)}
            />
          )}

          {activeDomain === 'data' && (
            <DataSheetsView
              sheetId={activeSubDomain || 'processing'}
              rows={tableRows}
            />
          )}

          {activeDomain === 'analysis' && (
            <AnalysisView
              selectedPartner={selectedPartner}
              selectedPeriod={selectedPeriod}
            />
          )}

          {activeDomain === 'settings' && (
            <SettingsView
              subDomain={activeSubDomain || 'appearance'}
              rows={tableRows}
              settings={appSettings}
              onUpdateSettings={setAppSettings}
              onRestoreRows={handleSaveRows}
              onOpenGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
              onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
            />
          )}

          {activeDomain === 'delete-data' && (
            <DeleteDataView
              rows={tableRows}
              onResetComplete={handleSaveRows}
            />
          )}
        </main>
      </div>

      {/* Google Sheets Sync & Configuration Dialog */}
      <GoogleSheetsSyncModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
        rows={tableRows}
        onSyncComplete={() => {
          setSyncStatus(StorageService.getSyncStatus());
        }}
      />

      {/* GitHub Automated Sync & Deployment Dialog */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onSyncSuccess={() => {
          setSyncStatus(StorageService.getSyncStatus());
        }}
      />
    </div>
  );
}
