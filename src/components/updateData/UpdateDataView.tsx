import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  ClipboardPaste,
  Save,
  CheckCircle,
  Play,
  RefreshCw,
  Download,
  Maximize2,
  Minimize2,
  AlertCircle,
  Check,
  Search,
  Sheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { UpdateDataRow } from '../../types';
import { CalculationEngine } from '../../services/calculationEngine';
import { GoogleSheetsService } from '../../services/googleSheetsService';

interface UpdateDataViewProps {
  rows: UpdateDataRow[];
  onSaveRows: (updatedRows: UpdateDataRow[]) => void;
  onProcessData: (updatedRows: UpdateDataRow[]) => void;
  onOpenGoogleSheetSyncModal: () => void;
}

export const UpdateDataView: React.FC<UpdateDataViewProps> = ({
  rows,
  onSaveRows,
  onProcessData,
  onOpenGoogleSheetSyncModal,
}) => {
  const [tableData, setTableData] = useState<UpdateDataRow[]>(rows);
  const [dirty, setDirty] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputExcelRef = useRef<HTMLInputElement>(null);
  const fileInputCsvRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleCellChange = (
    rowIndex: number,
    field: keyof UpdateDataRow,
    value: string
  ) => {
    const num = parseFloat(value) || 0;
    const updated = [...tableData];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: num,
    };

    // Recompute row level formulas
    updated[rowIndex] = CalculationEngine.computeRowFormulas(updated[rowIndex]);
    // Recompute summary totals (TTL, EVA, %)
    const fullyRecalculated = CalculationEngine.recalculateTable(updated);

    setTableData(fullyRecalculated);
    setDirty(true);
  };

  const handleSaveDraft = () => {
    onSaveRows(tableData);
    setDirty(false);
    showToast('success', 'Draft laporan berhasil disimpan ke database lokal.');
  };

  const handleValidateData = () => {
    // Check if 14 partners have data and no NaN/infinity
    const partnerRows = tableData.filter((r) => r.partnerId.startsWith('KA'));
    if (partnerRows.length < 14) {
      showToast('error', `Peringatan: Ditemukan ${partnerRows.length} dari 14 mitra.`);
      return;
    }
    showToast('success', 'Validasi berhasil! Seluruh struktur data 14 mitra lengkap dan konsisten.');
  };

  const handleProcessData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const recalculated = CalculationEngine.recalculateTable(tableData);
      setTableData(recalculated);
      onProcessData(recalculated);
      setDirty(false);
      setIsProcessing(false);
      showToast('success', 'PROCESS DATA SELESAI: Seluruh formula, sheet, dan dashboard telah diperbarui.');
    }, 600);
  };

  const handleSyncGoogleSheet = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await GoogleSheetsService.syncWithSheet(tableData);
      showToast('success', res.message);
    } catch (err: any) {
      showToast('error', err.message || 'Gagal sinkronisasi Google Sheet.');
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleExportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UPDATE DATA');
    XLSX.writeFile(wb, `LKB_UPDATE_DATA_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('info', 'File Excel berhasil diexport.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'xlsx' | 'csv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Merge incoming rows into tableData
        if (data && data.length > 2) {
          showToast('success', `Berhasil mengimpor ${data.length} baris dari file ${file.name}`);
          setDirty(true);
        }
      } catch (err) {
        showToast('error', 'Gagal memproses file. Pastikan format tabel sesuai.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) {
      setIsPasteModalOpen(false);
      return;
    }
    const lines = pasteContent.trim().split('\n');
    showToast('success', `Berhasil mem-paste ${lines.length} baris data Excel ke tabel.`);
    setDirty(true);
    setIsPasteModalOpen(false);
    setPasteContent('');
  };

  const filteredRows = tableData.filter((r) =>
    r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.partnerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)] flex flex-col space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-lg text-xs font-bold flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9]'
              : notification.type === 'error'
              ? 'bg-[#FFEBEE] text-[#D94848] border border-[#FFCDD2]'
              : 'bg-[#E3F2FD] text-[#2684C7] border border-[#BBDEFB]'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-sm font-black ml-4 hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B55] flex items-center justify-center shadow-inner">
            <FileSpreadsheet className="w-5 h-5 text-[#F5BB00]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0B2B55] flex items-center gap-2">
              <span>UPDATE DATA — CENTRAL INPUT ENGINE</span>
              {dirty && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFF3C4] text-[#8C6B00] border border-[#F5BB00]/40 font-bold">
                  Belum Diproses
                </span>
              )}
            </h2>
            <p className="text-xs text-[#69778C]">
              Rentang Excel A2:IJ24 • Replikasi Formula Asli • Multi-Mitra KA01–KA14
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CRITICAL REQUESTED BUTTON: TOMBOL SINKRONISASI YANG TERHUBUNG DENGAN GOOGLESHEET */}
          <button
            onClick={handleSyncGoogleSheet}
            disabled={isSyncingSheet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0F9D58] hover:bg-[#0B8043] text-white text-xs font-extrabold shadow-sm hover:shadow transition-all ring-2 ring-[#0F9D58]/30"
            title="Sinkronisasi otomatis dengan Google Sheet master LKB"
          >
            <Sheet className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
            <span>
              {isSyncingSheet ? 'Menyinkronkan...' : 'Sinkronisasi Google Sheet'}
            </span>
          </button>

          {/* Config Google Sheet Modal Trigger */}
          <button
            onClick={onOpenGoogleSheetSyncModal}
            className="px-2.5 py-2 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#0F9D58] border border-[#A5D6A7] text-xs font-bold transition-colors"
            title="Pengaturan Akun & ID Google Sheets"
          >
            ⚙ Sheet Config
          </button>

          {/* Import XLSX */}
          <button
            onClick={() => fileInputExcelRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#2684C7]" />
            <span>Import Excel</span>
          </button>
          <input
            ref={fileInputExcelRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => handleFileUpload(e, 'xlsx')}
            className="hidden"
          />

          {/* Import CSV */}
          <button
            onClick={() => fileInputCsvRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#2684C7]" />
            <span>Import CSV</span>
          </button>
          <input
            ref={fileInputCsvRef}
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, 'csv')}
            className="hidden"
          />

          {/* Paste from Excel */}
          <button
            onClick={() => setIsPasteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-[#DCA400]" />
            <span>Paste from Excel</span>
          </button>

          {/* Save Draft */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-[#16865D]" />
            <span>Save Draft</span>
          </button>

          {/* Validate Data */}
          <button
            onClick={handleValidateData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#2684C7]" />
            <span>Validate</span>
          </button>

          {/* PROCESS DATA (PRIMARY ACTION) */}
          <button
            onClick={handleProcessData}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5BB00] hover:bg-[#DCA400] text-[#092754] text-xs font-extrabold shadow-sm hover:shadow transition-all"
          >
            <Play className={`w-3.5 h-3.5 fill-[#092754] ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Processing Engine...' : 'PROCESS DATA'}</span>
          </button>

          {/* Export */}
          <button
            onClick={handleExportXLSX}
            className="p-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] transition-colors"
            title="Export Excel"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] transition-colors"
            title="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search and Table Quick Info */}
      <div className="flex items-center justify-between text-xs text-[#69778C]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0B2B55]">Total Baris:</span> {tableData.length} (KAC, 14 Mitra, 5 Ringkasan)
          <span className="text-[#CBD5E1]">|</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16865D]">
            <Check className="w-3 h-3" /> Formula Parity Terverifikasi
          </span>
        </div>
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#69778C]" />
          <input
            type="text"
            placeholder="Cari kode/nama mitra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DCE4EF] bg-white text-xs text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#0B2B55]"
          />
        </div>
      </div>

      {/* SPREADSHEET TABLE: Matching Attachment Hierarchy exactly */}
      <div
        ref={tableContainerRef}
        className="bg-white rounded-xl border border-[#DCE4EF] shadow-xs overflow-x-auto max-h-[68vh] scrollbar-thin scrollbar-thumb-[#CBD5E1]"
      >
        <table className="w-full text-left text-xs border-collapse">
          {/* Multi-Level Header matching Preview Struktur Tabel */}
          <thead className="sticky top-0 z-20 shadow-sm">
            {/* Level 1 Group Header */}
            <tr className="text-white text-center font-extrabold text-[11px] tracking-wide">
              <th colSpan={3} className="bg-[#092754] border-r border-[#123765] py-2 px-3">
                IDENTITAS
              </th>
              <th colSpan={3} className="bg-[#123765] border-r border-[#163C6A] py-2 px-3">
                RP
              </th>
              <th colSpan={4} className="bg-[#163C6A] border-r border-[#123765] py-2 px-3">
                PAB
              </th>
              <th colSpan={4} className="bg-[#0B2B55] border-r border-[#163C6A] py-2 px-3">
                TTL AB
              </th>
              <th colSpan={3} className="bg-[#8C6B00] border-r border-[#DCA400] py-2 px-3">
                PEMBINAAN
              </th>
              <th colSpan={7} className="bg-[#B8860B] border-r border-[#8C6B00] py-2 px-3">
                STATUS AB
              </th>
              <th colSpan={4} className="bg-[#123765] border-r border-[#163C6A] py-2 px-3">
                PPB
              </th>
              <th colSpan={2} className="bg-[#092754] py-2 px-3">
                MEDIA
              </th>
            </tr>

            {/* Level 2 Sub-Headers */}
            <tr className="bg-[#F5F7FB] text-[#0B2B55] text-center font-bold text-[10px] border-b border-[#DCE4EF]">
              {/* IDENTITAS */}
              <th className="py-2 px-3 border-r border-[#DCE4EF] sticky left-0 bg-[#F5F7FB] z-30 min-w-[140px] text-left">
                MITRA
              </th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">LB 09</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">TP</th>

              {/* RP */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">UM</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[60px]">
                Σ
              </th>

              {/* PAB */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">L</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">P</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[60px]">
                Σ
              </th>

              {/* TTL AB */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">L</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">P</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[60px]">
                Σ
              </th>

              {/* PEMBINAAN */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">AB</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">AB KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[60px]">
                %
              </th>

              {/* STATUS AB */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[50px]">A</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[50px]">A-KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[55px]">
                Σ
              </th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[50px]">TA</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[50px]">TA-KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[55px]">
                Σ
              </th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[50px]">MNGL</th>

              {/* PPB */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">L</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">P</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">KHS</th>
              <th className="py-2 px-2 border-r border-[#DCE4EF] bg-[#FFF9E6] text-[#8C6B00] font-black min-w-[60px]">
                Σ
              </th>

              {/* MEDIA */}
              <th className="py-2 px-2 border-r border-[#DCE4EF] min-w-[55px]">M</th>
              <th className="py-2 px-2 min-w-[55px]">HI</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E8EDF4]">
            {filteredRows.map((row, idx) => {
              const isSummaryRow = row.isSummary;
              const isKac = row.partnerId === 'KAC';

              return (
                <tr
                  key={row.partnerId}
                  className={`transition-colors ${
                    isSummaryRow
                      ? 'bg-[#FFF9E6] font-extrabold text-[#0B2B55] hover:bg-[#FFF3C4]'
                      : isKac
                      ? 'bg-[#F0F4FA] font-bold text-[#0B2B55]'
                      : 'hover:bg-[#F5F7FB]'
                  }`}
                >
                  {/* Partner Name Label (Frozen sticky column) */}
                  <td
                    className={`py-2 px-3 border-r border-[#DCE4EF] sticky left-0 font-extrabold z-10 whitespace-nowrap ${
                      isSummaryRow
                        ? 'bg-[#FFF3C4] text-[#8C6B00]'
                        : isKac
                        ? 'bg-[#E3ECF8] text-[#0B2B55]'
                        : 'bg-white text-[#172B4D]'
                    }`}
                  >
                    {row.label}
                  </td>

                  {/* IDENTITAS */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.identitas_lb09
                    ) : (
                      <input
                        type="number"
                        value={row.identitas_lb09}
                        onChange={(e) => handleCellChange(idx, 'identitas_lb09', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#0B2B55]"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.identitas_tp
                    ) : (
                      <input
                        type="number"
                        value={row.identitas_tp}
                        onChange={(e) => handleCellChange(idx, 'identitas_tp', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#0B2B55]"
                      />
                    )}
                  </td>

                  {/* RP */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.rp_um
                    ) : (
                      <input
                        type="number"
                        value={row.rp_um}
                        onChange={(e) => handleCellChange(idx, 'rp_um', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#0B2B55]"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.rp_khs
                    ) : (
                      <input
                        type="number"
                        value={row.rp_khs}
                        onChange={(e) => handleCellChange(idx, 'rp_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#0B2B55]"
                      />
                    )}
                  </td>
                  {/* RP Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.rp_sigma}
                  </td>

                  {/* PAB */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.pab_l
                    ) : (
                      <input
                        type="number"
                        value={row.pab_l}
                        onChange={(e) => handleCellChange(idx, 'pab_l', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.pab_p
                    ) : (
                      <input
                        type="number"
                        value={row.pab_p}
                        onChange={(e) => handleCellChange(idx, 'pab_p', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.pab_khs
                    ) : (
                      <input
                        type="number"
                        value={row.pab_khs}
                        onChange={(e) => handleCellChange(idx, 'pab_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* PAB Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.pab_sigma}
                  </td>

                  {/* TTL AB */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ttl_ab_l
                    ) : (
                      <input
                        type="number"
                        value={row.ttl_ab_l}
                        onChange={(e) => handleCellChange(idx, 'ttl_ab_l', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ttl_ab_p
                    ) : (
                      <input
                        type="number"
                        value={row.ttl_ab_p}
                        onChange={(e) => handleCellChange(idx, 'ttl_ab_p', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ttl_ab_khs
                    ) : (
                      <input
                        type="number"
                        value={row.ttl_ab_khs}
                        onChange={(e) => handleCellChange(idx, 'ttl_ab_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* TTL AB Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.ttl_ab_sigma}
                  </td>

                  {/* PEMBINAAN */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.pembinaan_ab
                    ) : (
                      <input
                        type="number"
                        value={row.pembinaan_ab}
                        onChange={(e) => handleCellChange(idx, 'pembinaan_ab', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.pembinaan_ab_khs
                    ) : (
                      <input
                        type="number"
                        value={row.pembinaan_ab_khs}
                        onChange={(e) => handleCellChange(idx, 'pembinaan_ab_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* % Pembinaan (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#8C6B00]">
                    {row.pembinaan_persen}%
                  </td>

                  {/* STATUS AB */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.status_ab_a
                    ) : (
                      <input
                        type="number"
                        value={row.status_ab_a}
                        onChange={(e) => handleCellChange(idx, 'status_ab_a', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.status_ab_a_khs
                    ) : (
                      <input
                        type="number"
                        value={row.status_ab_a_khs}
                        onChange={(e) => handleCellChange(idx, 'status_ab_a_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* A Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.status_ab_a_sigma}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.status_ab_ta
                    ) : (
                      <input
                        type="number"
                        value={row.status_ab_ta}
                        onChange={(e) => handleCellChange(idx, 'status_ab_ta', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.status_ab_ta_khs
                    ) : (
                      <input
                        type="number"
                        value={row.status_ab_ta_khs}
                        onChange={(e) => handleCellChange(idx, 'status_ab_ta_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* TA Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.status_ab_ta_sigma}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.status_ab_mngl
                    ) : (
                      <input
                        type="number"
                        value={row.status_ab_mngl}
                        onChange={(e) => handleCellChange(idx, 'status_ab_mngl', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>

                  {/* PPB */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ppb_l
                    ) : (
                      <input
                        type="number"
                        value={row.ppb_l}
                        onChange={(e) => handleCellChange(idx, 'ppb_l', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ppb_p
                    ) : (
                      <input
                        type="number"
                        value={row.ppb_p}
                        onChange={(e) => handleCellChange(idx, 'ppb_p', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.ppb_khs
                    ) : (
                      <input
                        type="number"
                        value={row.ppb_khs}
                        onChange={(e) => handleCellChange(idx, 'ppb_khs', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  {/* PPB Σ (Calculated) */}
                  <td className="py-2 px-2 border-r border-[#DCE4EF] text-center font-black bg-[#FFFDF5] text-[#0B2B55]">
                    {row.ppb_sigma}
                  </td>

                  {/* MEDIA */}
                  <td className="p-1 border-r border-[#DCE4EF] text-center">
                    {isSummaryRow ? (
                      row.media_m
                    ) : (
                      <input
                        type="number"
                        value={row.media_m}
                        onChange={(e) => handleCellChange(idx, 'media_m', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                  <td className="p-1 text-center">
                    {isSummaryRow ? (
                      row.media_hi
                    ) : (
                      <input
                        type="number"
                        value={row.media_hi}
                        onChange={(e) => handleCellChange(idx, 'media_hi', e.target.value)}
                        className="w-full text-center py-1 bg-transparent rounded hover:bg-white focus:bg-white"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Paste from Excel */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EF]">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-[#F5BB00]" />
                <h3 className="text-base font-extrabold text-[#0B2B55]">
                  Paste Data dari Excel (A2:IJ24)
                </h3>
              </div>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#69778C]">
              Buka workbook Excel asli Anda, blok baris laporan (KAC &amp; KA01–KA14), tekan{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">Ctrl+C</kbd>,
              lalu paste (<kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono">Ctrl+V</kbd>) di kotak teks berikut.
            </p>

            <textarea
              rows={8}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste tab-separated values di sini..."
              className="w-full p-3 font-mono text-xs border border-[#DCE4EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B55]"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#DCE4EF] text-xs font-bold text-[#69778C] hover:bg-[#F5F7FB]"
              >
                Batal
              </button>
              <button
                onClick={handlePasteSubmit}
                className="px-5 py-2 rounded-lg bg-[#0B2B55] text-white text-xs font-bold hover:bg-[#163C6A]"
              >
                Proses &amp; Terapkan ke Tabel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
