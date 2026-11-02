export type PartnerId =
  | 'ALL'
  | 'KA01'
  | 'KA02'
  | 'KA03'
  | 'KA04'
  | 'KA05'
  | 'KA06'
  | 'KA07'
  | 'KA08'
  | 'KA09'
  | 'KA10'
  | 'KA11'
  | 'KA12'
  | 'KA13'
  | 'KA14';

export interface PartnerInfo {
  id: PartnerId;
  code: string;
  name: string;
  region: string;
  pic: string;
  active: boolean;
}

export type MonthName =
  | 'JAN'
  | 'FEB'
  | 'MAR'
  | 'APR'
  | 'MEI'
  | 'JUN'
  | 'JUL'
  | 'AGS'
  | 'SEP'
  | 'OKT'
  | 'NOV'
  | 'DES';

export type MonthFull =
  | 'Januari'
  | 'Februari'
  | 'Maret'
  | 'April'
  | 'Mei'
  | 'Juni'
  | 'Juli'
  | 'Agustus'
  | 'September'
  | 'Oktober'
  | 'November'
  | 'Desember';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_PUSAT' | 'OPERATOR' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin: string;
}

// Update Data Row Schema matching Excel A2:IJ24
export interface UpdateDataRow {
  partnerId: PartnerId | 'KAC' | 'TTL' | 'BLL' | 'EVA' | '%' | 'TRGT';
  label: string;
  isSummary?: boolean;
  // IDENTITAS
  identitas_lb09: number | string;
  identitas_tp: number | string;
  // RP
  rp_um: number;
  rp_khs: number;
  rp_sigma: number; // calculated: um + khs
  // PAB
  pab_l: number;
  pab_p: number;
  pab_khs: number;
  pab_sigma: number; // calculated: l + p + khs
  // TTL AB
  ttl_ab_l: number;
  ttl_ab_p: number;
  ttl_ab_khs: number;
  ttl_ab_sigma: number; // calculated
  // PEMBINAAN
  pembinaan_ab: number;
  pembinaan_ab_khs: number;
  pembinaan_persen: number; // calculated
  // STATUS AB
  status_ab_a: number;
  status_ab_a_khs: number;
  status_ab_a_sigma: number;
  status_ab_ta: number;
  status_ab_ta_khs: number;
  status_ab_ta_sigma: number;
  status_ab_mngl: number;
  // PPB
  ppb_l: number;
  ppb_p: number;
  ppb_khs: number;
  ppb_sigma: number;
  // MEDIA
  media_m: number;
  media_hi: number;
}

export interface KpiMetric {
  id: string;
  title: string;
  kpi: number;
  target: number;
  realisasi: number;
  achievementPercent: number;
  status: 'ACHIEVED' | 'ON_TRACK' | 'BELOW_TARGET' | 'NO_DATA';
  statusLabel: string;
  momDiffPercent: number;
  previousMonthLabel: string;
  iconName: string;
}

export interface AnnualChartDataPoint {
  month: MonthName;
  monthIndex: number;
  rp: number | null;
  pab: number | null;
  rpK: number | null;
  pabK: number | null;
  binaAb: number | null;
  tidakTerbina: number | null;
  abAktif: number | null;
  ppb: number | null;
}

export interface RatioMetric {
  id: string;
  name: string;
  percentage: number;
  numerator: number;
  denominator: number;
  momDiffPercent: number;
  status: 'IMPROVED' | 'DECLINED' | 'UNCHANGED';
}

export interface TargetMetric {
  id: string;
  name: string;
  percentage: number;
  realisasi: number;
  target: number;
  momDiffPercent: number;
  status: 'IMPROVED' | 'DECLINED' | 'UNCHANGED';
}

export interface MomComparisonRow {
  no: number;
  indikator: string;
  bulanLalu: number | string;
  bulanIni: number | string;
  selisih: number | string;
  perubahanPercent: number | string;
  status: 'IMPROVED' | 'DECLINED' | 'UNCHANGED' | 'NEW' | 'NO_DATA';
  highlightGood?: boolean;
}

export interface SyncStatus {
  mode: 'OFFLINE' | 'ONLINE';
  localDataActive: boolean;
  syncState: 'SYNCED' | 'PENDING' | 'SYNCING' | 'CONFLICT' | 'ERROR';
  lastProcessed: string;
  lastSync: string;
  engineVersion: string;
  isCompleteAndValid: boolean;
  unpushedChangesCount: number;
}

export interface GoogleSheetsConfig {
  connected: boolean;
  spreadsheetId: string;
  spreadsheetName: string;
  sheetName: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
  accountEmail: string | null;
}

export interface DataLineageItem {
  id: string;
  indicator: string;
  partner: string;
  period: string;
  value: number | string;
  sourceSheet: string;
  sourceCell: string;
  importBatchId: string;
  importedBy: string;
  importedAt: string;
  calculationVersion: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entity: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AppErrorItem {
  id: string;
  timestamp: string;
  category: 'JAVASCRIPT' | 'CALCULATION' | 'IMPORT' | 'SYNC' | 'DATABASE' | 'SECURITY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  module: string;
  message: string;
  resolved: boolean;
}

export interface AppSettingState {
  theme: 'CORPORATE' | 'LIGHT' | 'DARK';
  appName: string;
  appSubtitle: string;
  sidebarDensity: 'compact' | 'normal' | 'relaxed';
  fontFamily: string;
}
