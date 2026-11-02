# APP DASHBOARD LKB — CENTRAL MANAGEMENT SYSTEM (PUB KAC)
> **Premium Corporate Edition • Hybrid Offline-First • Excel Replication • Executive Business Intelligence • System Hardening**

Repository Resmi: [https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app](https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app)  
Organisasi: **LKB Central Management System**  
Entitas Pusat: **KAC (PUSAT)**  
Mitra Operasional: **14 Mitra (KA01 – KA14)**

---

## 🌟 Ringkasan Eksekutif

Aplikasi **APP DASHBOARD LKB — Central Management System** adalah platform Business Intelligence korporat hybrid offline-first yang dirancang untuk mengonsolidasikan laporan bulanan dari 14 mitra wilayah ke entitas **KAC (PUSAT)**.

Platform ini mereplikasi secara presisi formula perhitungan dari 18 sheet buku kerja Excel asli:
1. `dashBOARD`
2. `Proccesing`
3. `Data`
4. `Control`
5. `Target 2026`
6. `KPI 2026`
7. `OUTPUT_PKU (QLY)`
8. `UPDATE DATA`
9. `RP-U`
10. `PAB-U`
11. `RP-K`
12. `PAB-K`
13. `BINA AB-U`
14. `BINA AB-K`
15. `PPB-U`
16. `PPB-K`
17. `MEDIA`
18. `SCORING`

---

## 🚀 Fitur Unggulan

### 1. Executive Dashboard
- **4 Horizontal KPI Cards:**
  - **PAB:** Realisasi 229 | Target 762 | Capaian 30,10% | Status: *On Track* | MoM: ▼ -56,8% vs Jul 2026
  - **PAB - KHS:** Realisasi 5 | Target 129 | Capaian 3,88% | Status: *Below Target* | MoM: ▼ -37,5% vs Jul 2026
  - **BINA:** Realisasi 110 | Target 67 | Capaian 60,91% | Status: *Achieved* | MoM: ▲ +7,8% vs Jul 2026
  - **PPB:** Realisasi 49 | Target 382 | Capaian 12,83% | Status: *Below Target* | MoM: ▼ -22,2% vs Jul 2026
- **3 Annual Graph Panels (12 Bulan Jan–Des):**
  - *Annual Performance – RP & PAB* (dual series trend).
  - *Annual AB Performance & Development* (stacked bars: AB Aktif, Bina AB, Tidak Terbina).
  - *Annual Performance – Complete Indicators* (multi-series line chart dengan switchable series).
- **2 Percentage Summary Panels:**
  - *Kinerja Rasio & Pembinaan* (RP:PKU, RP:PAB, PAB:PPB, BINA AB:PKU).
  - *Target Achievement & Bina AB* (Target:PAB, Target:PAB-K, Target:PPB, Jumlah AB:BINA).
- **Month-Over-Month Comparison Table:** 10 metrik terverifikasi dengan indikator selisih, %, dan status *Improved / Declined / Unchanged*.
- **Partner Navigation Pills:** Keseluruhan dan KA01 hingga KA14.
- **Data Status Footer:** Status integritas, versi calculation engine, dan waktu sinkronisasi.

### 2. UPDATE DATA (Spreadsheet Input & Google Sheets Sync)
- Struktur kolom bertingkat sesuai rentang Excel **A2:IJ24**:
  - `IDENTITAS` (LB 09, TP)
  - `RP` (UM, KHS, Σ)
  - `PAB` (L, P, KHS, Σ)
  - `TTL AB` (L, P, KHS, Σ)
  - `PEMBINAAN` (AB, AB KHS, %)
  - `STATUS AB` (A, A-KHS, Σ, TA, TA-KHS, Σ, MNGL)
  - `PPB` (L, P, KHS, Σ)
  - `MEDIA` (M, HI)
- Baris entitas: **KAC (PUSAT)**, **KA01 – KA14**, dan baris ringkasan **TTL**, **BLL**, **EVA**, **%**, **TRGT**.
- **Tombol Sinkronisasi Google Sheet:** Integrasi 2-arah ke Google Spreadsheet master.
- Import Excel (.xlsx), Import CSV, Paste from Excel modal, Save Draft, Validasi data, dan PROCESS DATA.

### 3. Otomatisasi GitHub Pull & Push
- Terintegrasi dengan repository [https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app](https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app).
- Fitur otomatisasi sinkronisasi git lokal ke remote GitHub repository dengan pelacakan commit dan histori audit.

### 4. Settings Center (11 Domain Kontrol)
- **Appearance:** Design token korporat (Deep Navy `#092754`, Mustard Yellow `#F5BB00`, White `#FFFFFF`).
- **Content Editor:** Kustomisasi redaksi antarmuka tanpa merusak kode.
- **Master Data:** Manajemen profil 14 mitra.
- **User & Access:** Role-Based Access Control (Super Admin, Admin Pusat, Operator, Viewer).
- **Sync Control:** Penanganan konflik multi-perangkat.
- **Rules & Constitution:** Dokumentasi arsitektur permanen.
- **QA Test Center:** Pengujian Formula Parity Engine otomatis.
- **Database Health:** Snapshot backup otomatis dan pemulihan data (RPO ≤ 24 jam, RTO ≤ 4 jam).
- **Deployment Center:** Manajemen rilis produksi.

### 5. Keamanan & Penghapusan Data Terkontrol
- Proteksi penghapusan data 2 tahap dengan konfirmasi pengetikan: `HAPUS SEMUA DATA`.
- Pembuatan snapshot backup otomatis sebelum operasi destruktif.

---

## 🛠️ Stack Teknologi

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons, Recharts
- **Penyimpanan Lokal:** IndexedDB & LocalStorage (Offline-First)
- **Kalkulasi & Parity Engine:** TypeScript Deterministic Engine (Formula Parity Verified)
- **Integrasi Dokumen:** SheetJS (xlsx), PapaParse, Google Sheets API connector
- **Version Control:** Git & GitHub

---

## 📦 Menjalankan Proyek Secara Lokal

```bash
# Clone repository
git clone https://github.com/ma-comm-ac-net/LKB-PUB-KAC-app.git
cd LKB-PUB-KAC-app

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:3000` untuk mengakses aplikasi.

---

## 📜 Lisensi & Kepatuhan
Hak Cipta © 2026 LKB Central Management System — PUB KAC. Seluruh hak cipta dilindungi undang-undang.
