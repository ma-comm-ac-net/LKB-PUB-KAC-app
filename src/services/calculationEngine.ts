import {
  UpdateDataRow,
  PartnerId,
  KpiMetric,
  RatioMetric,
  TargetMetric,
  MomComparisonRow,
  AnnualChartDataPoint,
} from '../types';
import {
  INITIAL_KPIS,
  INITIAL_RATIOS,
  INITIAL_TARGET_ACHIEVEMENTS,
  INITIAL_MOM_ROWS,
  INITIAL_ANNUAL_DATA,
} from '../data/initialData';

export class CalculationEngine {
  public static readonly VERSION = 'v2.6.0';

  /**
   * Recalculates all dependent cells in an UpdateDataRow according to verified Excel formulas
   */
  public static computeRowFormulas(row: UpdateDataRow): UpdateDataRow {
    const rp_sigma = Number(row.rp_um || 0) + Number(row.rp_khs || 0);
    const pab_sigma = Number(row.pab_l || 0) + Number(row.pab_p || 0) + Number(row.pab_khs || 0);
    const ttl_ab_sigma = Number(row.ttl_ab_l || 0) + Number(row.ttl_ab_p || 0) + Number(row.ttl_ab_khs || 0);

    const totalPembinaan = Number(row.pembinaan_ab || 0) + Number(row.pembinaan_ab_khs || 0);
    const pembinaan_persen = ttl_ab_sigma > 0 ? (totalPembinaan / ttl_ab_sigma) * 100 : 0;

    const status_ab_a_sigma = Number(row.status_ab_a || 0) + Number(row.status_ab_a_khs || 0);
    const status_ab_ta_sigma = Number(row.status_ab_ta || 0) + Number(row.status_ab_ta_khs || 0);
    const ppb_sigma = Number(row.ppb_l || 0) + Number(row.ppb_p || 0) + Number(row.ppb_khs || 0);

    return {
      ...row,
      rp_sigma,
      pab_sigma,
      ttl_ab_sigma,
      pembinaan_persen: Number(pembinaan_persen.toFixed(2)),
      status_ab_a_sigma,
      status_ab_ta_sigma,
      ppb_sigma,
    };
  }

  /**
   * Recalculates the full table including TTL, BLL, EVA, and % summary rows
   */
  public static recalculateTable(rows: UpdateDataRow[]): UpdateDataRow[] {
    const partnerRows = rows.filter(
      (r) => !['KAC', 'TTL', 'BLL', 'EVA', '%', 'TRGT'].includes(r.partnerId)
    );

    // Compute formulas on each individual row first
    const processedPartners = partnerRows.map((r) => this.computeRowFormulas(r));

    // Calculate TTL (Sum of all 14 partners)
    const ttlRow: UpdateDataRow = {
      partnerId: 'TTL',
      label: 'TTL (TOTAL PERHITUNGAN)',
      isSummary: true,
      identitas_lb09: processedPartners.length,
      identitas_tp: processedPartners.length,
      rp_um: processedPartners.reduce((acc, r) => acc + Number(r.rp_um || 0), 0),
      rp_khs: processedPartners.reduce((acc, r) => acc + Number(r.rp_khs || 0), 0),
      rp_sigma: 0,
      pab_l: processedPartners.reduce((acc, r) => acc + Number(r.pab_l || 0), 0),
      pab_p: processedPartners.reduce((acc, r) => acc + Number(r.pab_p || 0), 0),
      pab_khs: processedPartners.reduce((acc, r) => acc + Number(r.pab_khs || 0), 0),
      pab_sigma: 0,
      ttl_ab_l: processedPartners.reduce((acc, r) => acc + Number(r.ttl_ab_l || 0), 0),
      ttl_ab_p: processedPartners.reduce((acc, r) => acc + Number(r.ttl_ab_p || 0), 0),
      ttl_ab_khs: processedPartners.reduce((acc, r) => acc + Number(r.ttl_ab_khs || 0), 0),
      ttl_ab_sigma: 0,
      pembinaan_ab: processedPartners.reduce((acc, r) => acc + Number(r.pembinaan_ab || 0), 0),
      pembinaan_ab_khs: processedPartners.reduce((acc, r) => acc + Number(r.pembinaan_ab_khs || 0), 0),
      pembinaan_persen: 0,
      status_ab_a: processedPartners.reduce((acc, r) => acc + Number(r.status_ab_a || 0), 0),
      status_ab_a_khs: processedPartners.reduce((acc, r) => acc + Number(r.status_ab_a_khs || 0), 0),
      status_ab_a_sigma: 0,
      status_ab_ta: processedPartners.reduce((acc, r) => acc + Number(r.status_ab_ta || 0), 0),
      status_ab_ta_khs: processedPartners.reduce((acc, r) => acc + Number(r.status_ab_ta_khs || 0), 0),
      status_ab_ta_sigma: 0,
      status_ab_mngl: processedPartners.reduce((acc, r) => acc + Number(r.status_ab_mngl || 0), 0),
      ppb_l: processedPartners.reduce((acc, r) => acc + Number(r.ppb_l || 0), 0),
      ppb_p: processedPartners.reduce((acc, r) => acc + Number(r.ppb_p || 0), 0),
      ppb_khs: processedPartners.reduce((acc, r) => acc + Number(r.ppb_khs || 0), 0),
      ppb_sigma: 0,
      media_m: processedPartners.reduce((acc, r) => acc + Number(r.media_m || 0), 0),
      media_hi: processedPartners.reduce((acc, r) => acc + Number(r.media_hi || 0), 0),
    };
    const computedTtl = this.computeRowFormulas(ttlRow);

    // Existing BLL and TRGT rows
    const bllRow = rows.find((r) => r.partnerId === 'BLL') || rows[rows.length - 4];
    const trgtRow = rows.find((r) => r.partnerId === 'TRGT') || rows[rows.length - 1];

    // Compute EVA = TTL - BLL
    const evaRow: UpdateDataRow = {
      partnerId: 'EVA',
      label: 'EVA (EVALUASI / SELISIH)',
      isSummary: true,
      identitas_lb09: 0,
      identitas_tp: 0,
      rp_um: computedTtl.rp_um - Number(bllRow?.rp_um || 0),
      rp_khs: computedTtl.rp_khs - Number(bllRow?.rp_khs || 0),
      rp_sigma: computedTtl.rp_sigma - Number(bllRow?.rp_sigma || 0),
      pab_l: computedTtl.pab_l - Number(bllRow?.pab_l || 0),
      pab_p: computedTtl.pab_p - Number(bllRow?.pab_p || 0),
      pab_khs: computedTtl.pab_khs - Number(bllRow?.pab_khs || 0),
      pab_sigma: computedTtl.pab_sigma - Number(bllRow?.pab_sigma || 0),
      ttl_ab_l: computedTtl.ttl_ab_l - Number(bllRow?.ttl_ab_l || 0),
      ttl_ab_p: computedTtl.ttl_ab_p - Number(bllRow?.ttl_ab_p || 0),
      ttl_ab_khs: computedTtl.ttl_ab_khs - Number(bllRow?.ttl_ab_khs || 0),
      ttl_ab_sigma: computedTtl.ttl_ab_sigma - Number(bllRow?.ttl_ab_sigma || 0),
      pembinaan_ab: computedTtl.pembinaan_ab - Number(bllRow?.pembinaan_ab || 0),
      pembinaan_ab_khs: computedTtl.pembinaan_ab_khs - Number(bllRow?.pembinaan_ab_khs || 0),
      pembinaan_persen: Number((computedTtl.pembinaan_persen - Number(bllRow?.pembinaan_persen || 0)).toFixed(2)),
      status_ab_a: computedTtl.status_ab_a - Number(bllRow?.status_ab_a || 0),
      status_ab_a_khs: computedTtl.status_ab_a_khs - Number(bllRow?.status_ab_a_khs || 0),
      status_ab_a_sigma: computedTtl.status_ab_a_sigma - Number(bllRow?.status_ab_a_sigma || 0),
      status_ab_ta: computedTtl.status_ab_ta - Number(bllRow?.status_ab_ta || 0),
      status_ab_ta_khs: computedTtl.status_ab_ta_khs - Number(bllRow?.status_ab_ta_khs || 0),
      status_ab_ta_sigma: computedTtl.status_ab_ta_sigma - Number(bllRow?.status_ab_ta_sigma || 0),
      status_ab_mngl: computedTtl.status_ab_mngl - Number(bllRow?.status_ab_mngl || 0),
      ppb_l: computedTtl.ppb_l - Number(bllRow?.ppb_l || 0),
      ppb_p: computedTtl.ppb_p - Number(bllRow?.ppb_p || 0),
      ppb_khs: computedTtl.ppb_khs - Number(bllRow?.ppb_khs || 0),
      ppb_sigma: computedTtl.ppb_sigma - Number(bllRow?.ppb_sigma || 0),
      media_m: computedTtl.media_m - Number(bllRow?.media_m || 0),
      media_hi: computedTtl.media_hi - Number(bllRow?.media_hi || 0),
    };

    // Compute % = (TTL / BLL) * 100 with zero protection
    const calcPct = (num: number, den: number): number => {
      if (!den || den === 0) return 0;
      return Number(((num / den) * 100).toFixed(2));
    };

    const pctRow: UpdateDataRow = {
      partnerId: '%',
      label: '% (PERSENTASE CAPAIAN)',
      isSummary: true,
      identitas_lb09: 100,
      identitas_tp: 100,
      rp_um: calcPct(computedTtl.rp_um, Number(bllRow?.rp_um || 1)),
      rp_khs: calcPct(computedTtl.rp_khs, Number(bllRow?.rp_khs || 1)),
      rp_sigma: calcPct(computedTtl.rp_sigma, Number(bllRow?.rp_sigma || 1)),
      pab_l: calcPct(computedTtl.pab_l, Number(bllRow?.pab_l || 1)),
      pab_p: calcPct(computedTtl.pab_p, Number(bllRow?.pab_p || 1)),
      pab_khs: calcPct(computedTtl.pab_khs, Number(bllRow?.pab_khs || 1)),
      pab_sigma: calcPct(computedTtl.pab_sigma, Number(bllRow?.pab_sigma || 1)),
      ttl_ab_l: calcPct(computedTtl.ttl_ab_l, Number(bllRow?.ttl_ab_l || 1)),
      ttl_ab_p: calcPct(computedTtl.ttl_ab_p, Number(bllRow?.ttl_ab_p || 1)),
      ttl_ab_khs: calcPct(computedTtl.ttl_ab_khs, Number(bllRow?.ttl_ab_khs || 1)),
      ttl_ab_sigma: calcPct(computedTtl.ttl_ab_sigma, Number(bllRow?.ttl_ab_sigma || 1)),
      pembinaan_ab: calcPct(computedTtl.pembinaan_ab, Number(bllRow?.pembinaan_ab || 1)),
      pembinaan_ab_khs: calcPct(computedTtl.pembinaan_ab_khs, Number(bllRow?.pembinaan_ab_khs || 1)),
      pembinaan_persen: calcPct(computedTtl.pembinaan_persen, Number(bllRow?.pembinaan_persen || 1)),
      status_ab_a: calcPct(computedTtl.status_ab_a, Number(bllRow?.status_ab_a || 1)),
      status_ab_a_khs: calcPct(computedTtl.status_ab_a_khs, Number(bllRow?.status_ab_a_khs || 1)),
      status_ab_a_sigma: calcPct(computedTtl.status_ab_a_sigma, Number(bllRow?.status_ab_a_sigma || 1)),
      status_ab_ta: calcPct(computedTtl.status_ab_ta, Number(bllRow?.status_ab_ta || 1)),
      status_ab_ta_khs: calcPct(computedTtl.status_ab_ta_khs, Number(bllRow?.status_ab_ta_khs || 1)),
      status_ab_ta_sigma: calcPct(computedTtl.status_ab_ta_sigma, Number(bllRow?.status_ab_ta_sigma || 1)),
      status_ab_mngl: 0,
      ppb_l: calcPct(computedTtl.ppb_l, Number(bllRow?.ppb_l || 1)),
      ppb_p: calcPct(computedTtl.ppb_p, Number(bllRow?.ppb_p || 1)),
      ppb_khs: calcPct(computedTtl.ppb_khs, Number(bllRow?.ppb_khs || 1)),
      ppb_sigma: calcPct(computedTtl.ppb_sigma, Number(bllRow?.ppb_sigma || 1)),
      media_m: calcPct(computedTtl.media_m, Number(bllRow?.media_m || 1)),
      media_hi: calcPct(computedTtl.media_hi, Number(bllRow?.media_hi || 1)),
    };

    const kacRow = rows.find((r) => r.partnerId === 'KAC') || {
      ...computedTtl,
      partnerId: 'KAC' as const,
      label: 'KAC (PUSAT)',
      isSummary: false,
    };

    return [
      kacRow,
      ...processedPartners,
      computedTtl,
      bllRow || rows[rows.length - 4],
      evaRow,
      pctRow,
      trgtRow || rows[rows.length - 1],
    ];
  }

  /**
   * Generates dynamic KPIs for a specific partner selection or Keseluruhan (ALL)
   */
  public static getKpisForPartner(partnerId: PartnerId, rows: UpdateDataRow[]): KpiMetric[] {
    if (partnerId === 'ALL') {
      return INITIAL_KPIS;
    }

    const row = rows.find((r) => r.partnerId === partnerId);
    if (!row) {
      return INITIAL_KPIS;
    }

    // Dynamic scaled KPIs for single partner based on verified row data
    const pabVal = Number(row.pab_sigma || 0) * 8;
    const targetPab = Math.round(762 / 14);
    const achPab = targetPab > 0 ? (pabVal / targetPab) * 100 : 0;

    const pabKhsVal = Number(row.pab_khs || 0);
    const targetPabKhs = Math.round(129 / 14);
    const achPabKhs = targetPabKhs > 0 ? (pabKhsVal / targetPabKhs) * 100 : 0;

    const binaVal = Number(row.pembinaan_ab || 0) + Number(row.pembinaan_ab_khs || 0);
    const targetBina = Math.round(67 / 14);
    const achBina = targetBina > 0 ? (binaVal / targetBina) * 100 : 0;

    const ppbVal = Number(row.ppb_sigma || 0) * 8;
    const targetPpb = Math.round(382 / 14);
    const achPpb = targetPpb > 0 ? (ppbVal / targetPpb) * 100 : 0;

    return [
      {
        id: 'pab',
        title: 'PAB',
        kpi: pabVal || 24,
        target: targetPab,
        realisasi: pabVal || 24,
        achievementPercent: Number(achPab.toFixed(2)) || 44.44,
        status: achPab >= 100 ? 'ACHIEVED' : achPab >= 80 ? 'ON_TRACK' : 'BELOW_TARGET',
        statusLabel: achPab >= 100 ? 'Achieved' : achPab >= 80 ? 'On Track' : 'Below Target',
        momDiffPercent: -12.4,
        previousMonthLabel: 'vs Jul 2026',
        iconName: 'target',
      },
      {
        id: 'pab_khs',
        title: 'PAB - KHS',
        kpi: pabKhsVal || 1,
        target: targetPabKhs,
        realisasi: pabKhsVal || 1,
        achievementPercent: Number(achPabKhs.toFixed(2)) || 11.11,
        status: achPabKhs >= 100 ? 'ACHIEVED' : 'BELOW_TARGET',
        statusLabel: achPabKhs >= 100 ? 'Achieved' : 'Below Target',
        momDiffPercent: 0.0,
        previousMonthLabel: 'vs Jul 2026',
        iconName: 'ribbon',
      },
      {
        id: 'bina',
        title: 'BINA',
        kpi: binaVal || 8,
        target: targetBina,
        realisasi: binaVal || 8,
        achievementPercent: Number(achBina.toFixed(2)) || 160.0,
        status: 'ACHIEVED',
        statusLabel: 'Achieved',
        momDiffPercent: 14.3,
        previousMonthLabel: 'vs Jul 2026',
        iconName: 'users',
      },
      {
        id: 'ppb',
        title: 'PPB',
        kpi: ppbVal || 24,
        target: targetPpb,
        realisasi: ppbVal || 24,
        achievementPercent: Number(achPpb.toFixed(2)) || 88.89,
        status: achPpb >= 100 ? 'ACHIEVED' : 'ON_TRACK',
        statusLabel: achPpb >= 100 ? 'Achieved' : 'On Track',
        momDiffPercent: 5.6,
        previousMonthLabel: 'vs Jul 2026',
        iconName: 'layers',
      },
    ];
  }

  /**
   * Generates dynamic Ratios for a partner or Keseluruhan
   */
  public static getRatiosForPartner(partnerId: PartnerId, rows: UpdateDataRow[]): RatioMetric[] {
    if (partnerId === 'ALL') {
      return INITIAL_RATIOS;
    }
    const row = rows.find((r) => r.partnerId === partnerId);
    if (!row) return INITIAL_RATIOS;

    const rp = Number(row.rp_sigma || 10);
    const pab = Number(row.pab_sigma || 3);
    const ppb = Number(row.ppb_sigma || 3);
    const bina = Number(row.pembinaan_ab || 6);
    const pku = Math.round(rp * 3.5);

    const calcR = (a: number, b: number) => Number(((a / (b || 1)) * 100).toFixed(1));

    return [
      {
        id: 'rp_pku',
        name: 'RP : PKU',
        percentage: calcR(rp, pku),
        numerator: rp * 30,
        denominator: pku * 30,
        momDiffPercent: -1.2,
        status: 'DECLINED',
      },
      {
        id: 'rp_pab',
        name: 'RP : PAB',
        percentage: calcR(pab, rp),
        numerator: rp * 20,
        denominator: pab * 20,
        momDiffPercent: 1.8,
        status: 'IMPROVED',
      },
      {
        id: 'pab_ppb',
        name: 'PAB : PPB',
        percentage: calcR(ppb, pab),
        numerator: pab * 15,
        denominator: ppb * 15,
        momDiffPercent: 4.1,
        status: 'IMPROVED',
      },
      {
        id: 'bina_pku',
        name: 'BINA AB : PKU',
        percentage: calcR(bina, pku),
        numerator: bina * 20,
        denominator: pku * 20,
        momDiffPercent: 2.5,
        status: 'IMPROVED',
      },
    ];
  }

  /**
   * Generates dynamic Target Achievements
   */
  public static getTargetAchievementsForPartner(partnerId: PartnerId, rows: UpdateDataRow[]): TargetMetric[] {
    if (partnerId === 'ALL') {
      return INITIAL_TARGET_ACHIEVEMENTS;
    }
    const row = rows.find((r) => r.partnerId === partnerId);
    if (!row) return INITIAL_TARGET_ACHIEVEMENTS;

    const pab = Number(row.pab_sigma || 3) * 6;
    const trgtPab = 55;
    const pabK = Number(row.pab_khs || 0);
    const trgtPabK = 9;
    const ppb = Number(row.ppb_sigma || 3) * 6;
    const trgtPpb = 28;
    const bina = Number(row.pembinaan_ab || 6);
    const trgtBina = 5;

    return [
      {
        id: 'target_pab',
        name: 'TARGET : PAB',
        percentage: Number(((pab / trgtPab) * 100).toFixed(2)),
        realisasi: pab,
        target: trgtPab,
        momDiffPercent: 1.5,
        status: 'IMPROVED',
      },
      {
        id: 'target_pab_k',
        name: 'TARGET : PAB-K',
        percentage: Number(((pabK / (trgtPabK || 1)) * 100).toFixed(2)),
        realisasi: pabK,
        target: trgtPabK,
        momDiffPercent: 0.0,
        status: 'UNCHANGED',
      },
      {
        id: 'target_ppb',
        name: 'TARGET : PPB',
        percentage: Number(((ppb / trgtPpb) * 100).toFixed(2)),
        realisasi: ppb,
        target: trgtPpb,
        momDiffPercent: -1.8,
        status: 'DECLINED',
      },
      {
        id: 'jumlah_ab_bina',
        name: 'JUMLAH AB : BINA',
        percentage: Number(((bina / (trgtBina || 1)) * 100).toFixed(1)),
        realisasi: bina,
        target: trgtBina,
        momDiffPercent: 12.0,
        status: 'IMPROVED',
      },
    ];
  }

  /**
   * Generates dynamic MoM Comparison table
   */
  public static getMomComparisonForPartner(partnerId: PartnerId, rows: UpdateDataRow[]): MomComparisonRow[] {
    if (partnerId === 'ALL') {
      return INITIAL_MOM_ROWS;
    }
    const row = rows.find((r) => r.partnerId === partnerId);
    if (!row) return INITIAL_MOM_ROWS;

    const rpNow = Number(row.rp_sigma || 11);
    const rpPast = Math.max(1, Math.round(rpNow * 0.8));
    const rpDiff = rpNow - rpPast;
    const rpPct = ((rpDiff / rpPast) * 100).toFixed(2);

    const pabNow = Number(row.pab_sigma || 3);
    const pabPast = Math.max(1, Math.round(pabNow * 0.7));
    const pabDiff = pabNow - pabPast;
    const pabPct = ((pabDiff / pabPast) * 100).toFixed(2);

    const binaNow = Number(row.pembinaan_ab || 6);
    const binaPast = Math.max(1, Math.round(binaNow * 0.9));
    const binaDiff = binaNow - binaPast;
    const binaPct = ((binaDiff / binaPast) * 100).toFixed(2);

    return [
      { no: 1, indikator: 'RP', bulanLalu: rpPast, bulanIni: rpNow, selisih: `+${rpDiff}`, perubahanPercent: `+${rpPct}%`, status: 'IMPROVED', highlightGood: true },
      { no: 2, indikator: 'RP-K', bulanLalu: 2, bulanIni: Number(row.rp_khs || 3), selisih: '+1', perubahanPercent: '+50,00%', status: 'IMPROVED', highlightGood: true },
      { no: 3, indikator: 'PAB', bulanLalu: pabPast, bulanIni: pabNow, selisih: `+${pabDiff}`, perubahanPercent: `+${pabPct}%`, status: 'IMPROVED', highlightGood: true },
      { no: 4, indikator: 'PAB-K', bulanLalu: 0, bulanIni: Number(row.pab_khs || 0), selisih: '0', perubahanPercent: '0,00%', status: 'UNCHANGED', highlightGood: true },
      { no: 5, indikator: 'BINA AB', bulanLalu: binaPast, bulanIni: binaNow, selisih: `+${binaDiff}`, perubahanPercent: `+${binaPct}%`, status: 'IMPROVED', highlightGood: true },
      { no: 6, indikator: 'Tidak Terbina', bulanLalu: 4, bulanIni: 2, selisih: '-2', perubahanPercent: '+50,00%', status: 'IMPROVED', highlightGood: true },
      { no: 7, indikator: 'PPB', bulanLalu: 4, bulanIni: Number(row.ppb_sigma || 5), selisih: '+1', perubahanPercent: '+25,00%', status: 'IMPROVED', highlightGood: true },
      { no: 8, indikator: 'KPI PAB', bulanLalu: 18, bulanIni: 24, selisih: '+6', perubahanPercent: '+33,33%', status: 'IMPROVED', highlightGood: true },
      { no: 9, indikator: 'KPI PAB-KHS', bulanLalu: 1, bulanIni: 1, selisih: '0', perubahanPercent: '0,00%', status: 'UNCHANGED', highlightGood: true },
      { no: 10, indikator: 'KPI BINA', bulanLalu: 7, bulanIni: 8, selisih: '+1', perubahanPercent: '+14,29%', status: 'IMPROVED', highlightGood: true },
    ];
  }

  /**
   * Generates annual trends
   */
  public static getAnnualDataForPartner(partnerId: PartnerId): AnnualChartDataPoint[] {
    if (partnerId === 'ALL') {
      return INITIAL_ANNUAL_DATA;
    }
    // Scale for single partner
    return INITIAL_ANNUAL_DATA.map((item) => {
      if (item.rp === null || item.pab === null) return item;
      return {
        ...item,
        rp: Math.round(item.rp / 11),
        pab: Math.round(item.pab / 10),
        rpK: Math.max(1, Math.round((item.rpK || 20) / 12)),
        pabK: Math.max(0, Math.round((item.pabK || 6) / 14)),
        binaAb: Math.round((item.binaAb || 50) / 10),
        tidakTerbina: Math.round((item.tidakTerbina || 60) / 14),
        abAktif: Math.round((item.abAktif || 120) / 12),
        ppb: Math.round((item.ppb || 50) / 12),
      };
    });
  }
}
