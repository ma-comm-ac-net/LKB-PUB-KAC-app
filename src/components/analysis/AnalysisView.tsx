import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Award,
  Users,
  Target,
  FileCheck2,
  Download,
  Filter,
} from 'lucide-react';
import { PartnerId } from '../../types';
import { PARTNERS_LIST } from '../../data/initialData';

interface AnalysisViewProps {
  selectedPartner: PartnerId;
  selectedPeriod: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  selectedPartner,
  selectedPeriod,
}) => {
  const [activeTab, setActiveTab] = useState<'analisa' | 'evaluasi' | 'rekomendasi'>('analisa');

  const partnerLabel =
    selectedPartner === 'ALL'
      ? 'Konsolidasi 14 Mitra (KAC)'
      : `${selectedPartner} - ${PARTNERS_LIST.find((p) => p.id === selectedPartner)?.name}`;

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-[calc(100vh-4rem)] space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B55] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#F5BB00]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0B2B55] uppercase tracking-wide">
              Analisa, Evaluasi &amp; Rekomendasi
            </h2>
            <p className="text-xs text-[#69778C]">
              Executive Business Intelligence • Scope: <strong>{partnerLabel}</strong> • Periode:{' '}
              <strong>{selectedPeriod}</strong>
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-[#F5F7FB] border border-[#DCE4EF] rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('analisa')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'analisa'
                ? 'bg-[#0B2B55] text-white shadow-xs'
                : 'text-[#69778C] hover:text-[#0B2B55]'
            }`}
          >
            Analisa Tren &amp; Ranking
          </button>
          <button
            onClick={() => setActiveTab('evaluasi')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'evaluasi'
                ? 'bg-[#0B2B55] text-white shadow-xs'
                : 'text-[#69778C] hover:text-[#0B2B55]'
            }`}
          >
            Evaluasi Capaian
          </button>
          <button
            onClick={() => setActiveTab('rekomendasi')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'rekomendasi'
                ? 'bg-[#0B2B55] text-white shadow-xs'
                : 'text-[#69778C] hover:text-[#0B2B55]'
            }`}
          >
            Rekomendasi Berbasis Bukti
          </button>
        </div>
      </div>

      {/* TAB 1: ANALISA */}
      {activeTab === 'analisa' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-[#F5BB00]" />
                <h4 className="font-extrabold text-sm text-[#0B2B55]">Mitra Berprestasi Terbaik</h4>
              </div>
              <p className="text-xs text-[#69778C] mb-3">
                Berdasarkan komposit weighted scoring engine 2026.
              </p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#F5F7FB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0B2B55] text-[#F5BB00] font-black flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span className="font-bold text-[#172B4D]">KA02 - DKI Jakarta</span>
                  </div>
                  <span className="font-black text-[#16865D]">91,85 Pts</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F7FB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0B2B55] text-white font-black flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span className="font-bold text-[#172B4D]">KA07 - Bali &amp; NTB</span>
                  </div>
                  <span className="font-black text-[#16865D]">89,25 Pts</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F5F7FB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0B2B55] text-white font-black flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span className="font-bold text-[#172B4D]">KA11 - Sulawesi Utara</span>
                  </div>
                  <span className="font-black text-[#16865D]">87,40 Pts</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#DCA400]" />
                <h4 className="font-extrabold text-sm text-[#0B2B55]">Perlu Pendampingan Khusus</h4>
              </div>
              <p className="text-xs text-[#69778C] mb-3">
                Mitra dengan realisasi PAB-K &amp; PPB di bawah 20% target.
              </p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#FFF3C4]/40 border border-[#F5BB00]/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B2B55]">KA14 - Papua Pegunungan</span>
                  <span className="font-black text-[#D94848]">Capaian 50,0%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FFF3C4]/40 border border-[#F5BB00]/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B2B55]">KA13 - Papua Barat</span>
                  <span className="font-black text-[#D94848]">Capaian 60,0%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FFF3C4]/40 border border-[#F5BB00]/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B2B55]">KA12 - Maluku</span>
                  <span className="font-black text-[#DCA400]">Capaian 60,0%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="w-5 h-5 text-[#16865D]" />
                <h4 className="font-extrabold text-sm text-[#0B2B55]">Integritas &amp; Konsistensi</h4>
              </div>
              <p className="text-xs text-[#69778C] mb-3">
                Kelengkapan laporan 14 mitra per 21 Agustus 2026.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#172B4D] mb-1">
                    <span>Laporan Masuk Tepat Waktu</span>
                    <span className="text-[#16865D]">14 / 14 (100%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8EDF4] overflow-hidden">
                    <div className="w-full h-full bg-[#16865D] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[#172B4D] mb-1">
                    <span>Kesesuaian Validasi Formula</span>
                    <span className="text-[#0B2B55]">100% Lolos Uji</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8EDF4] overflow-hidden">
                    <div className="w-full h-full bg-[#0B2B55] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVALUASI */}
      {activeTab === 'evaluasi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
              <h4 className="font-extrabold text-sm text-[#16865D] flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Indikator Unggul (Pencapaian Tinggi)
              </h4>
              <ul className="space-y-2.5 text-xs text-[#172B4D]">
                <li className="p-2.5 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9]">
                  <strong className="block text-[#16865D]">BINA AB (Pembinaan Anggota Baru)</strong>
                  Realisasi 110 dari target 67 (Capaian <strong>164,18%</strong> dari target bulanan rata-rata, 60,91% dari target tahunan penuh). Pertumbuhan MoM naik <strong>+7,8%</strong>.
                </li>
                <li className="p-2.5 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9]">
                  <strong className="block text-[#16865D]">Rencana Pelaksanaan (RP Total)</strong>
                  Realisasi Agustus mencapai 125, meningkat <strong>+62,34%</strong> dibandingkan Juli (77). Seluruh mitra aktif berkontribusi.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs">
              <h4 className="font-extrabold text-sm text-[#D94848] flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" /> Indikator Kritis (Perlu Perhatian Cepat)
              </h4>
              <ul className="space-y-2.5 text-xs text-[#172B4D]">
                <li className="p-2.5 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]">
                  <strong className="block text-[#D94848]">PAB - KHS (Khusus)</strong>
                  Realisasi hanya 5 dari target tahunan 129 (3,88%). Penurunan MoM sebesar <strong>-37,50%</strong>. Diperlukan revitalisasi program khusus di wilayah timur.
                </li>
                <li className="p-2.5 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2]">
                  <strong className="block text-[#D94848]">PPB (Peserta Pasca Bina)</strong>
                  Realisasi 49 dari target tahunan 382 (12,83%). Terjadi penurunan MoM <strong>-22,22%</strong> dibandingkan bulan Juli (63).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REKOMENDASI BERBASIS BUKTI (AI GOVERNANCE COMPLIANT) */}
      {activeTab === 'rekomendasi' && (
        <div className="space-y-4">
          <div className="bg-[#FFFDF5] border border-[#F5BB00]/40 rounded-xl p-3 text-xs text-[#0B2B55] flex items-center justify-between">
            <span>
              <strong>Kepatuhan Tata Kelola BI (AI Governance):</strong> Seluruh rekomendasi wajib menyertakan bukti numerik aktual (Verified Fact), temuan analitis (Finding), dan tindakan konkret (Suggested Action).
            </span>
            <span className="px-2.5 py-1 rounded bg-[#F5BB00] text-[#092754] font-black text-[10px]">
              VERIFIED FACTUAL AUDIT
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'REC-01',
                partner: 'Mitra KA10, KA12, KA13, KA14 (Wilayah Timur & Maluku-Papua)',
                period: 'Agustus 2026',
                indicator: 'PAB-KHS (Peserta Aktif Baru Khusus)',
                actual: '0 - 1 per mitra (Total 5)',
                target: '129 Tahunan (10.75 / Bulan)',
                evidence: 'Data sheet PAB-K kolom pab_khs menunjukkan 8 dari 14 mitra melaporkan angka 0.',
                finding: 'Kesenjangan logistik pendataan dan kurangnya sosialisasi modul khusus di wilayah kepulauan timur.',
                priority: 'HIGH PRIORITY',
                action: 'Lakukan supervisi lapangan terfokus dan fasilitasi verifikasi jemput bola peserta di 4 mitra prioritas pada September 2026.',
              },
              {
                id: 'REC-02',
                partner: 'Seluruh 14 Mitra (Konsolidasi KAC)',
                period: 'Agustus 2026',
                indicator: 'PPB (Peserta Pasca Bina)',
                actual: '49 Orang (Turun dari 63 di bulan Juli)',
                target: '382 Tahunan (31.8 / Bulan)',
                evidence: 'Penurunan MoM sebesar -22,22% pada sheet PPB-U & PPB-K.',
                finding: 'Banyak peserta yang menuntaskan pembinaan belum langsung tercatat dalam administrasi pasca bina.',
                priority: 'MEDIUM PRIORITY',
                action: 'Percepat penerbitan sertifikat kelulusan pembinaan dan sinkronkan data BINA AB ke PPB dalam waktu maksimal 7 hari kerja.',
              },
              {
                id: 'REC-03',
                partner: 'KA02, KA07, KA11',
                period: 'Agustus 2026',
                indicator: 'BINA AB & Media Publikasi',
                actual: 'Capaian di atas 90%',
                target: 'Tercapai Penuh',
                evidence: 'Skor pembinaan masing-masing mitra mencapai >85 poin pada sheet SCORING.',
                finding: 'Praktik pendampingan intensif terbukti meningkatkan retensi peserta.',
                priority: 'KNOWLEDGE SHARING',
                action: 'Jadikan KA02 dan KA07 sebagai mentor wilayah untuk berbagi Standard Operating Procedure (SOP) pembinaan kepada mitra lainnya.',
              },
            ].map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl border border-[#DCE4EF] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8EDF4] pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#F5BB00]" />
                    <span className="font-extrabold text-[#0B2B55] text-xs">
                      {rec.id}: {rec.indicator}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      rec.priority === 'HIGH PRIORITY'
                        ? 'bg-[#FFEBEE] text-[#D94848] border border-[#FFCDD2]'
                        : rec.priority === 'MEDIUM PRIORITY'
                        ? 'bg-[#FFF3C4] text-[#8C6B00] border border-[#F5BB00]/40'
                        : 'bg-[#E8F5E9] text-[#16865D] border border-[#C8E6C9]'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#F5F7FB]">
                    <span className="text-[10px] text-[#69778C] block uppercase font-bold">Mitra Sasaran</span>
                    <span className="font-bold text-[#172B4D]">{rec.partner}</span>
                  </div>
                  <div className="p-2 rounded bg-[#F5F7FB]">
                    <span className="text-[10px] text-[#69778C] block uppercase font-bold">Nilai Aktual</span>
                    <span className="font-bold text-[#0B2B55]">{rec.actual}</span>
                  </div>
                  <div className="p-2 rounded bg-[#F5F7FB]">
                    <span className="text-[10px] text-[#69778C] block uppercase font-bold">Target Rencana</span>
                    <span className="font-bold text-[#172B4D]">{rec.target}</span>
                  </div>
                  <div className="p-2 rounded bg-[#F5F7FB]">
                    <span className="text-[10px] text-[#69778C] block uppercase font-bold">Bukti Terverifikasi</span>
                    <span className="font-medium text-[#172B4D]">{rec.evidence}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#E3F2FD]/50 border border-[#BBDEFB] text-xs">
                  <strong className="text-[#0B2B55] block mb-1">Rekomendasi Tindakan (Actionable Strategy):</strong>
                  <span className="text-[#172B4D]">{rec.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
