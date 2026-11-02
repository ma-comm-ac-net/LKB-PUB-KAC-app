# DEVELOPMENT_CONTEXT.md
## APP DASHBOARD LKB — CENTRAL MANAGEMENT SYSTEM
### PREMIUM CORPORATE EDITION • HYBRID OFFLINE-FIRST • EXCEL REPLICATION • SYSTEM HARDENING

### 1. Architecture Overview
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons.
- **Local Persistence**: IndexedDB & LocalStorage via `StorageService`.
- **Calculation Engine**: TypeScript Calculation Engine (`CalculationEngine.ts`) replicating all verified Excel formulas without `eval()`.
- **Excel Formula Parity Engine**: `ParityEngine.ts` with golden test suite checking RP, PAB, TTL AB, Pembinaan %, and MoM deltas.
- **Google Sheets Integration**: `GoogleSheetsService.ts` and `GoogleSheetsSyncModal.tsx` providing real-time 2-way push/pull with audit logging.
- **Security & Data Hardening**: 2-stage verification for critical deletions, mandatory automatic snapshot before destructive operations, RBAC roles.

### 2. The 6 Sidebar Domains
1. **DASHBOARD**:
   - Executive header & global filters (Periode, Tahun, Mitra, Refresh, Export, Full Screen).
   - 4 KPI Panels: PAB, PAB-KHS, BINA, PPB with achievement rings, targets, realizations, and MoM deltas.
   - 3 Annual Graph Panels: Annual RP & PAB, Annual AB Development (stacked), Annual Complete Indicators (with series toggles).
   - 2 Ratio Summary Panels: Kinerja Rasio & Pembinaan (circular progress), Target Achievement & Bina AB.
   - Month-over-Month Performance Comparison Table.
   - 14 Partner Navigation Pills (Keseluruhan, KA01–KA14).
   - Data Status Footer with Engine version and validity badge.
2. **UPDATE DATA**:
   - Matches spreadsheet range A2:IJ24 and image `TAMPILAN_TABEL_PADA_HALAMAN_UPDATE_DATA__TAMBAHKAN_TOMBOL_SINKRONISASI_YANG_TERHUBUNG_DENGAN_GOOGLESHEET`.
   - Prominent **Sinkronisasi Google Sheet** button.
   - Import Excel (.xlsx), Import CSV, Paste from Excel modal, Save Draft, Validate Data, PROCESS DATA, Export.
3. **DATA (16 Submenus)**:
   - Processing, Data, Control, Target 2026, KPI 2026, OUTPUT_PKU, RP-U, PAB-U, RP-K, PAB-K, BINA AB-U, BINA AB-K, PPB-U, PPB-K, MEDIA, SCORING.
   - Search, Filter, Export XLSX, Print, Trace Data Lineage.
4. **ANALISA, EVALUASI & REKOMENDASI**:
   - Governed by AI Governance principles: Verified Facts vs Interpretation vs Actionable Strategy.
5. **SETTINGS (11 Submenus)**:
   - Appearance, Content Editor, Master Data, User & Access, Sync Control, Google Sheets, Rules Constitution, QA Test Center, Database Health & Backup, Monitoring & Logs, Deployment Center.
6. **HAPUS DATA APLIKASI**:
   - Scope selection, `HAPUS SEMUA DATA` confirmation typing, automatic recovery backup snapshot creation.

### 3. Verification & Parity Status
- Verified Excel parity on all 10 core formulas.
- All 14 partners mapped (KA01–KA14 + KAC).
- Zero dummy data policy enforced.
