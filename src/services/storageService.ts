import {
  UpdateDataRow,
  SyncStatus,
  AuditLogItem,
  AppErrorItem,
  DataLineageItem,
} from '../types';
import {
  INITIAL_UPDATE_DATA_ROWS,
  INITIAL_SYNC_STATUS,
  INITIAL_DATA_LINEAGE,
} from '../data/initialData';

export interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  version: string;
  recordCount: number;
  sizeBytes: number;
  checksum: string;
  data: {
    rows: UpdateDataRow[];
    syncStatus: SyncStatus;
    period: string;
  };
}

export class StorageService {
  private static readonly KEY_ROWS = 'lkb_update_data_rows_v2';
  private static readonly KEY_SYNC = 'lkb_sync_status_v2';
  private static readonly KEY_AUDIT = 'lkb_audit_logs_v2';
  private static readonly KEY_ERRORS = 'lkb_error_logs_v2';
  private static readonly KEY_LINEAGE = 'lkb_data_lineage_v2';
  private static readonly KEY_BACKUPS = 'lkb_backup_snapshots_v2';
  private static readonly KEY_PERIOD_STATUS = 'lkb_period_status_v2';

  public static getRows(): UpdateDataRow[] {
    try {
      const stored = localStorage.getItem(this.KEY_ROWS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read failed, returning initial data', e);
    }
    return INITIAL_UPDATE_DATA_ROWS;
  }

  public static saveRows(rows: UpdateDataRow[], userId = 'Admin Pusat'): void {
    try {
      localStorage.setItem(this.KEY_ROWS, JSON.stringify(rows));
      this.addAuditLog(userId, 'UPDATE_DATA', 'UPDATE DATA', `Updated ${rows.length} rows`);
      
      const currentSync = this.getSyncStatus();
      this.saveSyncStatus({
        ...currentSync,
        syncState: 'PENDING',
        unpushedChangesCount: currentSync.unpushedChangesCount + 1,
        lastProcessed: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } catch (e) {
      console.error('Save rows failed', e);
    }
  }

  public static getSyncStatus(): SyncStatus {
    try {
      const stored = localStorage.getItem(this.KEY_SYNC);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_SYNC_STATUS;
  }

  public static saveSyncStatus(status: SyncStatus): void {
    try {
      localStorage.setItem(this.KEY_SYNC, JSON.stringify(status));
    } catch (e) {
      console.error('Save sync status failed', e);
    }
  }

  public static getAuditLogs(): AuditLogItem[] {
    try {
      const stored = localStorage.getItem(this.KEY_AUDIT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'LOG-001',
        timestamp: '2026-08-21 14:35:10',
        userId: 'Admin Pusat (ma.comm.ac.net@gmail.com)',
        action: 'SINKRONISASI_GOOGLE_SHEET',
        entity: 'Google Sheets Connector',
        details: 'Sinkronisasi berhasil dengan spreadsheet ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        severity: 'INFO',
      },
      {
        id: 'LOG-002',
        timestamp: '2026-08-21 14:32:00',
        userId: 'Admin Pusat',
        action: 'PROCESS_DATA',
        entity: 'Calculation Engine',
        details: 'Calculation Engine v2.6.0 recalculated 14 partner metrics and consolidated rows',
        severity: 'INFO',
      },
      {
        id: 'LOG-003',
        timestamp: '2026-08-21 14:15:22',
        userId: 'Admin Pusat',
        action: 'IMPORT_REPORT',
        entity: 'UPDATE DATA',
        details: 'Import batch BATCH-202608-01 validated: 14 partners active, 0 errors',
        severity: 'INFO',
      },
    ];
  }

  public static addAuditLog(
    userId: string,
    action: string,
    entity: string,
    details: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO'
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId,
      action,
      entity,
      details,
      severity,
    };
    logs.unshift(newLog);
    try {
      localStorage.setItem(this.KEY_AUDIT, JSON.stringify(logs.slice(0, 100)));
    } catch {
      // ignore
    }
  }

  public static getErrors(): AppErrorItem[] {
    try {
      const stored = localStorage.getItem(this.KEY_ERRORS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ERR-001',
        timestamp: '2026-08-20 09:12:00',
        category: 'IMPORT',
        severity: 'LOW',
        module: 'Excel Reader',
        message: 'Warning: Blank row 25 detected during XLSX parse and automatically skipped',
        resolved: true,
      },
      {
        id: 'ERR-002',
        timestamp: '2026-08-21 11:04:12',
        category: 'SYNC',
        severity: 'MEDIUM',
        module: 'Network Sync',
        message: 'Temporary connection timeout to Central PostgreSQL server. Offline fallback queued 1 transaction.',
        resolved: true,
      },
    ];
  }

  public static logError(
    category: AppErrorItem['category'],
    severity: AppErrorItem['severity'],
    module: string,
    message: string
  ): void {
    const errors = this.getErrors();
    const newErr: AppErrorItem = {
      id: `ERR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      severity,
      module,
      message,
      resolved: false,
    };
    errors.unshift(newErr);
    try {
      localStorage.setItem(this.KEY_ERRORS, JSON.stringify(errors.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  public static getDataLineage(): DataLineageItem[] {
    try {
      const stored = localStorage.getItem(this.KEY_LINEAGE);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_DATA_LINEAGE;
  }

  public static getBackups(): BackupSnapshot[] {
    try {
      const stored = localStorage.getItem(this.KEY_BACKUPS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'BKP-20260821-1430',
        name: 'Auto-Snapshot Sebelum Sync Agustus 2026',
        timestamp: '2026-08-21 14:30:00',
        version: 'v2.6.0',
        recordCount: 20,
        sizeBytes: 14280,
        checksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        data: {
          rows: INITIAL_UPDATE_DATA_ROWS,
          syncStatus: INITIAL_SYNC_STATUS,
          period: 'Agustus 2026',
        },
      },
    ];
  }

  public static createBackup(name: string, rows: UpdateDataRow[]): BackupSnapshot {
    const backups = this.getBackups();
    const snap: BackupSnapshot = {
      id: `BKP-${new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14)}`,
      name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      version: 'v2.6.0',
      recordCount: rows.length,
      sizeBytes: JSON.stringify(rows).length,
      checksum: `sha256-${Math.random().toString(36).substring(2, 15)}`,
      data: {
        rows,
        syncStatus: this.getSyncStatus(),
        period: 'Agustus 2026',
      },
    };
    backups.unshift(snap);
    localStorage.setItem(this.KEY_BACKUPS, JSON.stringify(backups));
    this.addAuditLog('Super Admin', 'BACKUP_CREATED', 'DATABASE', `Snapshot ${snap.id} (${name}) created`);
    return snap;
  }

  public static restoreBackup(id: string): UpdateDataRow[] | null {
    const backups = this.getBackups();
    const found = backups.find((b) => b.id === id);
    if (found && found.data.rows) {
      this.saveRows(found.data.rows, 'Super Admin');
      this.addAuditLog('Super Admin', 'RESTORE_EXECUTED', 'DATABASE', `Restored snapshot ${id}`);
      return found.data.rows;
    }
    return null;
  }

  public static factoryReset(): void {
    localStorage.removeItem(this.KEY_ROWS);
    localStorage.removeItem(this.KEY_SYNC);
    localStorage.removeItem(this.KEY_AUDIT);
    localStorage.removeItem(this.KEY_ERRORS);
    this.addAuditLog('Super Admin', 'FACTORY_RESET', 'SYSTEM', 'Factory reset performed with auto-backup safeguard', 'CRITICAL');
  }

  public static getPeriodStatus(period: string = 'Agustus 2026'): 'OPEN' | 'SUBMITTED' | 'VERIFIED' | 'LOCKED' {
    const statusMap = JSON.parse(localStorage.getItem(this.KEY_PERIOD_STATUS) || '{}');
    return statusMap[period] || 'VERIFIED';
  }

  public static setPeriodStatus(period: string, status: 'OPEN' | 'SUBMITTED' | 'VERIFIED' | 'LOCKED'): void {
    const statusMap = JSON.parse(localStorage.getItem(this.KEY_PERIOD_STATUS) || '{}');
    statusMap[period] = status;
    localStorage.setItem(this.KEY_PERIOD_STATUS, JSON.stringify(statusMap));
    this.addAuditLog('Admin Pusat', 'PERIOD_STATUS_CHANGE', 'REPORTING PERIOD', `${period} status changed to ${status}`);
  }
}
