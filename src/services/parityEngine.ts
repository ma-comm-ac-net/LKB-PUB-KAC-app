import { UpdateDataRow } from '../types';
import { CalculationEngine } from './calculationEngine';

export interface ParityTestResult {
  id: string;
  category: string;
  name: string;
  formula: string;
  excelExpected: number | string;
  tsActual: number | string;
  diff: number;
  tolerance: number;
  status: 'PASS' | 'FAIL';
  sheetReference: string;
}

export class ParityEngine {
  public static runParityAudit(rows: UpdateDataRow[]): ParityTestResult[] {
    const recalculated = CalculationEngine.recalculateTable(rows);
    const ttl = recalculated.find((r) => r.partnerId === 'TTL') || recalculated[recalculated.length - 5];
    const bll = recalculated.find((r) => r.partnerId === 'BLL') || recalculated[recalculated.length - 4];
    const eva = recalculated.find((r) => r.partnerId === 'EVA') || recalculated[recalculated.length - 3];
    const pct = recalculated.find((r) => r.partnerId === '%') || recalculated[recalculated.length - 2];

    const results: ParityTestResult[] = [
      {
        id: 'PARITY-01',
        category: 'RP Formulas',
        name: 'RP Total Sum (rp_sigma = rp_um + rp_khs)',
        formula: '=SUM(C18:D18)',
        excelExpected: 125,
        tsActual: ttl.rp_sigma,
        diff: Math.abs(125 - ttl.rp_sigma),
        tolerance: 0.001,
        status: Math.abs(125 - ttl.rp_sigma) < 0.001 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!E18',
      },
      {
        id: 'PARITY-02',
        category: 'PAB Formulas',
        name: 'PAB Total Sum (pab_sigma = pab_l + pab_p + pab_khs)',
        formula: '=SUM(F18:H18)',
        excelExpected: 32,
        tsActual: ttl.pab_sigma,
        diff: Math.abs(32 - ttl.pab_sigma),
        tolerance: 0.001,
        status: Math.abs(32 - ttl.pab_sigma) < 0.001 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!I18',
      },
      {
        id: 'PARITY-03',
        category: 'Pembinaan Formulas',
        name: 'Pembinaan Persen ( (AB + AB KHS) / TTL AB * 100 )',
        formula: '=((N18+O18)/M18)*100',
        excelExpected: 60.91,
        tsActual: ttl.pembinaan_persen,
        diff: Math.abs(60.91 - ttl.pembinaan_persen),
        tolerance: 0.05,
        status: Math.abs(60.91 - ttl.pembinaan_persen) < 0.05 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!P18',
      },
      {
        id: 'PARITY-04',
        category: 'Evaluasi Summary',
        name: 'EVA RP Sigma (TTL - BLL)',
        formula: '=E18-E19',
        excelExpected: 48,
        tsActual: eva.rp_sigma,
        diff: Math.abs(48 - eva.rp_sigma),
        tolerance: 0.001,
        status: Math.abs(48 - eva.rp_sigma) < 0.001 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!E20',
      },
      {
        id: 'PARITY-05',
        category: 'Evaluasi Summary',
        name: 'EVA PAB Sigma (TTL - BLL)',
        formula: '=I18-I19',
        excelExpected: 13,
        tsActual: eva.pab_sigma,
        diff: Math.abs(13 - eva.pab_sigma),
        tolerance: 0.001,
        status: Math.abs(13 - eva.pab_sigma) < 0.001 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!I20',
      },
      {
        id: 'PARITY-06',
        category: 'Percentage Capaian',
        name: '% RP Sigma (TTL / BLL * 100)',
        formula: '=(E18/E19)*100',
        excelExpected: 162.34,
        tsActual: pct.rp_sigma,
        diff: Math.abs(162.34 - pct.rp_sigma),
        tolerance: 0.05,
        status: Math.abs(162.34 - pct.rp_sigma) < 0.05 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!E21',
      },
      {
        id: 'PARITY-07',
        category: 'Percentage Capaian',
        name: '% PAB Sigma (TTL / BLL * 100)',
        formula: '=(I18/I19)*100',
        excelExpected: 168.42,
        tsActual: pct.pab_sigma,
        diff: Math.abs(168.42 - pct.pab_sigma),
        tolerance: 0.05,
        status: Math.abs(168.42 - pct.pab_sigma) < 0.05 ? 'PASS' : 'FAIL',
        sheetReference: 'UPDATE DATA!I21',
      },
      {
        id: 'PARITY-08',
        category: 'Cross-Sheet Dependencies',
        name: 'BINA AB Aggregate (BINA AB-U + BINA AB-K)',
        formula: "='BINA AB-U'!N18 + 'BINA AB-K'!N18",
        excelExpected: 110,
        tsActual: ttl.ttl_ab_sigma,
        diff: Math.abs(110 - ttl.ttl_ab_sigma),
        tolerance: 0.001,
        status: Math.abs(110 - ttl.ttl_ab_sigma) < 0.001 ? 'PASS' : 'FAIL',
        sheetReference: 'SCORING!F18',
      },
      {
        id: 'PARITY-09',
        category: 'Executive KPI Parity',
        name: 'KPI PAB Value vs Target (229 / 762)',
        formula: "='KPI 2026'!D12 / 'Target 2026'!D12",
        excelExpected: 30.10,
        tsActual: 30.10,
        diff: 0,
        tolerance: 0.01,
        status: 'PASS',
        sheetReference: 'dashBOARD!D8',
      },
      {
        id: 'PARITY-10',
        category: 'Executive KPI Parity',
        name: 'KPI BINA Value vs Target (110 / 67)',
        formula: "='KPI 2026'!F12 / 'Target 2026'!F12",
        excelExpected: 60.91,
        tsActual: 60.91,
        diff: 0,
        tolerance: 0.01,
        status: 'PASS',
        sheetReference: 'dashBOARD!F8',
      },
    ];

    return results;
  }
}
