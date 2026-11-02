import React, { useState } from 'react';
import {
  Database,
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  History,
  FileText,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { UpdateDataRow, DataLineageItem } from '../../types';
import { PARTNERS_LIST, INITIAL_DATA_LINEAGE } from '../../data/initialData';

interface DataSheetsViewProps {
  sheetId: string;
  rows: UpdateDataRow[];
}

export const DataSheetsView: React.FC<DataSheetsViewProps> = ({ sheetId, rows }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineage, setSelectedLineage] = useState<DataLineageItem | null>(null);

  const sheetConfigs: Record<
    string,
    { title: string; subtitle: string; description: string; getColumns: () => string[]; getData: () => any[] }
  > = {
    processing: {
      title: 'Proccesing',
      subtitle: 'Raw calculation staging and ETL transformations from update batches',
      description: 'Sheet penampung hasil pemrosesan awal sebelum didistribusikan ke sheet agregat.',
      getColumns: () => ['Mitra', 'Status ETL', 'Raw Records', 'Cleaned Records', 'Validation Status', 'Execution Time', 'Batch ID'],
      getData: () =>
        PARTNERS_LIST.map((p, i) => ({
          Mitra: `${p.code} - ${p.name}`,
          'Status ETL': 'COMPLETED',
          'Raw Records': 24,
          'Cleaned Records': 24,
          'Validation Status': 'VALID (0 Error)',
          'Execution Time': '42 ms',
          'Batch ID': `BATCH-202608-${(i + 1).toString().padStart(2, '0')}`,
        })),
    },
    data_sheet: {
      title: 'Data',
      subtitle: 'Central Consolidated Operational Metrics',
      description: 'Kumpulan seluruh metrik transaksi operasional 14 mitra untuk periode berjalan.',
      getColumns: () => ['Kode', 'Mitra', 'RP UM', 'RP KHS', 'PAB L', 'PAB P', 'TTL AB', 'Bina AB', 'PPB'],
      getData: () =>
        rows
          .filter((r) => !['TTL', 'BLL', 'EVA', '%', 'TRGT'].includes(r.partnerId))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'RP UM': r.rp_um,
            'RP KHS': r.rp_khs,
            'PAB L': r.pab_l,
            'PAB P': r.pab_p,
            'TTL AB': r.ttl_ab_sigma,
            'Bina AB': r.pembinaan_ab,
            PPB: r.ppb_sigma,
          })),
    },
    control: {
      title: 'Control',
      subtitle: 'Data Integrity Constraints & Balance Checks',
      description: 'Memastikan tidak ada selisih antara input, relasi kolom, dan batas toleransi.',
      getColumns: () => ['Mitra', 'Check RP Σ', 'Check PAB Σ', 'Check TTL AB Σ', 'Check PPB Σ', 'Status'],
      getData: () =>
        PARTNERS_LIST.map((p) => ({
          Mitra: `${p.code} - ${p.name}`,
          'Check RP Σ': 'MATCH (=UM+KHS)',
          'Check PAB Σ': 'MATCH (=L+P+KHS)',
          'Check TTL AB Σ': 'MATCH (=L+P+KHS)',
          'Check PPB Σ': 'MATCH (=L+P+KHS)',
          Status: 'BALANCED',
        })),
    },
    target_2026: {
      title: 'Target 2026',
      subtitle: 'Master Targets & Annual KPI Allocations',
      description: 'Target kinerja tahun 2026 yang ditetapkan dalam Rencana Kerja Anggaran.',
      getColumns: () => ['Indikator', 'Target Tahunan', 'Target Semester I', 'Target Semester II', 'Target Bulanan Rata-Rata', 'Bobot'],
      getData: () => [
        { Indikator: 'PAB (Peserta Aktif Baru)', 'Target Tahunan': 762, 'Target Semester I': 380, 'Target Semester II': 382, 'Target Bulanan Rata-Rata': 63.5, Bobot: '35%' },
        { Indikator: 'PAB-KHS (Khusus)', 'Target Tahunan': 129, 'Target Semester I': 64, 'Target Semester II': 65, 'Target Bulanan Rata-Rata': 10.75, Bobot: '15%' },
        { Indikator: 'BINA AB (Pembinaan)', 'Target Tahunan': 67, 'Target Semester I': 33, 'Target Semester II': 34, 'Target Bulanan Rata-Rata': 5.58, Bobot: '25%' },
        { Indikator: 'PPB (Peserta Pasca Bina)', 'Target Tahunan': 382, 'Target Semester I': 190, 'Target Semester II': 192, 'Target Bulanan Rata-Rata': 31.83, Bobot: '25%' },
      ],
    },
    kpi_2026: {
      title: 'KPI 2026',
      subtitle: 'Key Performance Indicators Achievement Matrix',
      description: 'Pencapaian KPI tahun 2026 dengan perbandingan target vs realisasi.',
      getColumns: () => ['Kode KPI', 'Nama Indikator', 'Target 2026', 'Realisasi s/d Agt 2026', 'Persentase Capaian', 'Status'],
      getData: () => [
        { 'Kode KPI': 'KPI-01', 'Nama Indikator': 'PAB (Peserta Aktif Baru)', 'Target 2026': 762, 'Realisasi s/d Agt 2026': 229, 'Persentase Capaian': '30,10%', Status: 'ON TRACK' },
        { 'Kode KPI': 'KPI-02', 'Nama Indikator': 'PAB - Khusus', 'Target 2026': 129, 'Realisasi s/d Agt 2026': 5, 'Persentase Capaian': '3,88%', Status: 'BELOW TARGET' },
        { 'Kode KPI': 'KPI-03', 'Nama Indikator': 'Bina AB', 'Target 2026': 67, 'Realisasi s/d Agt 2026': 110, 'Persentase Capaian': '60,91%', Status: 'ACHIEVED' },
        { 'Kode KPI': 'KPI-04', 'Nama Indikator': 'PPB', 'Target 2026': 382, 'Realisasi s/d Agt 2026': 49, 'Persentase Capaian': '12,83%', Status: 'BELOW TARGET' },
      ],
    },
    output_pku: {
      title: 'OUTPUT_PKU (QLY)',
      subtitle: 'Peningkatan Kualitas Usaha (PKU) Quality Audits',
      description: 'Hasil evaluasi kualitas program pembinaan dan monitoring mutu PKU.',
      getColumns: () => ['Kode Mitra', 'Nama Mitra', 'Total PKU', 'Rasio RP:PKU', 'Rasio BINA:PKU', 'Kategori Kualitas'],
      getData: () =>
        PARTNERS_LIST.map((p, idx) => ({
          'Kode Mitra': p.code,
          'Nama Mitra': p.name,
          'Total PKU': 110 + idx * 8,
          'Rasio RP:PKU': '27,3%',
          'Rasio BINA:PKU': '23,8%',
          'Kategori Kualitas': idx % 3 === 0 ? 'Sangat Baik (A)' : 'Baik (B+)',
        })),
    },
    rp_u: {
      title: 'RP-U',
      subtitle: 'Rencana Pelaksanaan - Usaha (Umum)',
      description: 'Laporan perkembangan rencana pelaksanaan kategori umum seluruh mitra.',
      getColumns: () => ['Kode', 'Mitra', 'RP-U Bulan Lalu', 'RP-U Bulan Ini', 'Pertumbuhan', 'Status Target'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'RP-U Bulan Lalu': Math.max(1, r.rp_um - 1),
            'RP-U Bulan Ini': r.rp_um,
            Pertumbuhan: '+1',
            'Status Target': 'Memenuhi Target',
          })),
    },
    pab_u: {
      title: 'PAB-U',
      subtitle: 'Peserta Aktif Baru - Umum',
      description: 'Distribusi Peserta Aktif Baru kategori umum berdasarkan gender (Laki-laki & Perempuan).',
      getColumns: () => ['Kode', 'Mitra', 'PAB-U (Laki-laki)', 'PAB-U (Perempuan)', 'Total PAB-U', 'Rasio L/P'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'PAB-U (Laki-laki)': r.pab_l,
            'PAB-U (Perempuan)': r.pab_p,
            'Total PAB-U': r.pab_l + r.pab_p,
            'Rasio L/P': `${r.pab_l}:${r.pab_p}`,
          })),
    },
    rp_k: {
      title: 'RP-K',
      subtitle: 'Rencana Pelaksanaan - Khusus',
      description: 'Laporan perkembangan rencana pelaksanaan kategori khusus.',
      getColumns: () => ['Kode', 'Mitra', 'RP-K Target', 'RP-K Realisasi', 'Deviasi', 'Persentase'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'RP-K Target': 5,
            'RP-K Realisasi': r.rp_khs,
            Deviasi: r.rp_khs - 5,
            Persentase: `${((r.rp_khs / 5) * 100).toFixed(1)}%`,
          })),
    },
    pab_k: {
      title: 'PAB-K',
      subtitle: 'Peserta Aktif Baru - Khusus',
      description: 'Peserta aktif baru kategori program khusus di masing-masing wilayah mitra.',
      getColumns: () => ['Kode', 'Mitra', 'PAB-K Realisasi', 'PAB-K Target', 'Status Capaian'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'PAB-K Realisasi': r.pab_khs,
            'PAB-K Target': 2,
            'Status Capaian': r.pab_khs >= 2 ? 'Tercapai' : 'Perlu Pendampingan',
          })),
    },
    bina_ab_u: {
      title: 'BINA AB-U',
      subtitle: 'Pembinaan Anggota Baru - Umum',
      description: 'Aktivitas pembinaan dan modul materi yang diselesaikan oleh anggota baru reguler.',
      getColumns: () => ['Kode', 'Mitra', 'Anggota Dibina', 'Persentase Kehadiran', 'Tingkat Kelulusan'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'Anggota Dibina': r.pembinaan_ab,
            'Persentase Kehadiran': `${r.pembinaan_persen}%`,
            'Tingkat Kelulusan': '92%',
          })),
    },
    bina_ab_k: {
      title: 'BINA AB-K',
      subtitle: 'Pembinaan Anggota Baru - Khusus',
      description: 'Laporan pembinaan peserta program khusus dan pendampingan intensif.',
      getColumns: () => ['Kode', 'Mitra', 'Bina Khusus (Orang)', 'Sesi Dilaksanakan', 'Evaluasi Mutu'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'Bina Khusus (Orang)': r.pembinaan_ab_khs,
            'Sesi Dilaksanakan': '4 Sesi/Bln',
            'Evaluasi Mutu': 'Sangat Memuaskan',
          })),
    },
    ppb_u: {
      title: 'PPB-U',
      subtitle: 'Peserta Pasca Bina - Umum',
      description: 'Peserta yang telah menuntaskan seluruh kurikulum pembinaan umum.',
      getColumns: () => ['Kode', 'Mitra', 'PPB-U Laki-laki', 'PPB-U Perempuan', 'Total PPB-U'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'PPB-U Laki-laki': r.ppb_l,
            'PPB-U Perempuan': r.ppb_p,
            'Total PPB-U': r.ppb_l + r.ppb_p,
          })),
    },
    ppb_k: {
      title: 'PPB-K',
      subtitle: 'Peserta Pasca Bina - Khusus',
      description: 'Peserta yang telah menuntaskan kurikulum pasca bina khusus.',
      getColumns: () => ['Kode', 'Mitra', 'PPB Khusus', 'Sertifikasi Diterbitkan', 'Status Mandiri'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'PPB Khusus': r.ppb_khs,
            'Sertifikasi Diterbitkan': r.ppb_khs,
            'Status Mandiri': 'Aktif Berdaya',
          })),
    },
    media: {
      title: 'MEDIA',
      subtitle: 'Media Komunikasi & Publikasi Program',
      description: 'Publikasi materi pembinaan melalui media cetak, online, dan modul pendamping.',
      getColumns: () => ['Kode', 'Mitra', 'Media Mandiri (M)', 'Hasil Informasi (HI)', 'Total Publikasi'],
      getData: () =>
        rows
          .filter((r) => r.partnerId.startsWith('KA'))
          .map((r) => ({
            Kode: r.partnerId,
            Mitra: r.label,
            'Media Mandiri (M)': r.media_m,
            'Hasil Informasi (HI)': r.media_hi,
            'Total Publikasi': r.media_m + r.media_hi,
          })),
    },
    scoring: {
      title: 'SCORING',
      subtitle: 'Scoring Engine & Weighted Evaluation 2026',
      description: 'Perhitungan skor berbobot komprehensif seluruh mitra berdasarkan 4 pilar utama.',
      getColumns: () => ['Kode', 'Mitra', 'Skor PAB (35%)', 'Skor PAB-K (15%)', 'Skor BINA (25%)', 'Skor PPB (25%)', 'Total Skor Akhir', 'Peringkat'],
      getData: () => [
        { Kode: 'KA02', Mitra: 'Mitra Wilayah Barat 02', 'Skor PAB (35%)': 92, 'Skor PAB-K (15%)': 88, 'Skor BINA (25%)': 95, 'Skor PPB (25%)': 90, 'Total Skor Akhir': 91.85, Peringkat: '#1' },
        { Kode: 'KA07', Mitra: 'Mitra Wilayah Timur 07', 'Skor PAB (35%)': 90, 'Skor PAB-K (15%)': 85, 'Skor BINA (25%)': 92, 'Skor PPB (25%)': 88, 'Total Skor Akhir': 89.25, Peringkat: '#2' },
        { Kode: 'KA11', Mitra: 'Mitra Sulawesi 11', 'Skor PAB (35%)': 88, 'Skor PAB-K (15%)': 84, 'Skor BINA (25%)': 90, 'Skor PPB (25%)': 86, 'Total Skor Akhir': 87.40, Peringkat: '#3' },
        { Kode: 'KA01', Mitra: 'Mitra Wilayah Barat 01', 'Skor PAB (35%)': 85, 'Skor PAB-K (15%)': 80, 'Skor BINA (25%)': 88, 'Skor PPB (25%)': 82, 'Total Skor Akhir': 84.25, Peringkat: '#4' },
        { Kode: 'KA03', Mitra: 'Mitra Wilayah Barat 03', 'Skor PAB (35%)': 84, 'Skor PAB-K (15%)': 78, 'Skor BINA (25%)': 85, 'Skor PPB (25%)': 80, 'Total Skor Akhir': 82.35, Peringkat: '#5' },
        { Kode: 'KA06', Mitra: 'Mitra Wilayah Timur 06', 'Skor PAB (35%)': 82, 'Skor PAB-K (15%)': 75, 'Skor BINA (25%)': 82, 'Skor PPB (25%)': 78, 'Total Skor Akhir': 79.95, Peringkat: '#6' },
      ],
    },
  };

  const currentConfig = sheetConfigs[sheetId] || sheetConfigs.processing;
  const columns = currentConfig.getColumns();
  const rawData = currentConfig.getData();

  const filteredData = rawData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleExportSheet = () => {
    const ws = XLSX.utils.json_to_sheet(rawData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, currentConfig.title);
    XLSX.writeFile(wb, `${currentConfig.title}_LKB_2026.xlsx`);
  };

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)] space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B55] flex items-center justify-center">
            <Database className="w-5 h-5 text-[#F5BB00]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0B2B55] uppercase tracking-wide">
              {currentConfig.title}
            </h2>
            <p className="text-xs text-[#69778C]">{currentConfig.subtitle}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Trace Data Lineage Button */}
          <button
            onClick={() => setSelectedLineage(INITIAL_DATA_LINEAGE[0])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F5F7FB] hover:bg-[#E8EDF4] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors"
          >
            <History className="w-3.5 h-3.5 text-[#2684C7]" />
            <span>Trace Lineage</span>
          </button>

          {/* Export */}
          <button
            onClick={handleExportSheet}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#16865D]" />
            <span>Export XLSX</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#F5F7FB] text-[#0B2B55] border border-[#DCE4EF] text-xs font-bold transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#0B2B55]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-white rounded-lg border border-[#DCE4EF] p-3 text-xs text-[#172B4D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#F5BB00] shrink-0" />
          <span>{currentConfig.description}</span>
        </div>
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#69778C]" />
          <input
            type="text"
            placeholder="Cari dalam tabel ini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DCE4EF] bg-[#F5F7FB] text-xs text-[#172B4D] focus:outline-none focus:ring-1 focus:ring-[#0B2B55]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0B2B55] text-white font-bold text-[11px]">
              {columns.map((col, idx) => (
                <th key={idx} className="py-2.5 px-3 border-r border-[#163C6A] last:border-r-0 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF4]">
            {filteredData.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[#F5F7FB] transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="py-2 px-3 border-r border-[#E8EDF4] last:border-r-0 font-medium text-[#172B4D]">
                    {String(row[col] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Lineage Modal */}
      {selectedLineage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#DCE4EF]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EF]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#F5BB00]" />
                <h3 className="text-base font-extrabold text-[#0B2B55]">
                  Data Lineage &amp; Provenance Trace
                </h3>
              </div>
              <button onClick={() => setSelectedLineage(null)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F5F7FB] border border-[#DCE4EF]">
                <span className="text-[#69778C] font-semibold block text-[10px] uppercase">Indikator Terpilih</span>
                <span className="font-extrabold text-[#0B2B55] text-sm">{selectedLineage.indicator}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">Worksheet Sumber</span>
                  <span className="font-bold text-[#172B4D]">{selectedLineage.sourceSheet}</span>
                </div>
                <div className="p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">Sel Excel Asli</span>
                  <span className="font-bold text-[#172B4D]">{selectedLineage.sourceCell}</span>
                </div>
                <div className="p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">Import Batch ID</span>
                  <span className="font-bold text-[#172B4D]">{selectedLineage.importBatchId}</span>
                </div>
                <div className="p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">Versi Calculation Engine</span>
                  <span className="font-bold text-[#172B4D]">{selectedLineage.calculationVersion}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Diimpor Oleh &amp; Waktu</span>
                <span className="font-medium text-[#172B4D]">
                  {selectedLineage.importedBy} • {selectedLineage.importedAt}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLineage(null)}
                className="px-4 py-2 rounded-lg bg-[#0B2B55] text-white text-xs font-bold hover:bg-[#163C6A]"
              >
                Tutup Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
