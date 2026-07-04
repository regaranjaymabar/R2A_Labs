# 🔍 Review Proyek R2A LABS — Sistem Rekomendasi Laptop (SPK SAW)

> **Reviewer:** Antigravity AI · **Tanggal:** 3 Juli 2026  
> **Stack:** React 19 + Vite 8 + TypeScript 6 + TailwindCSS 4 + TanStack Query/Table + Zustand + Zod + React Hook Form

---

## 📊 Skor Keseluruhan

| Aspek | Skor | Keterangan |
|---|:---:|---|
| Arsitektur & Struktur Folder | ⭐⭐⭐⭐ | Sangat rapi dan modular |
| Kualitas Kode & Konsistensi | ⭐⭐⭐⭐ | Generic hooks pattern bagus, beberapa inkonsistensi minor |
| Keamanan (Security) | ⭐⭐☆☆☆ | ProtectedRoute dinonaktifkan, ada celah serius |
| UI/UX & Responsivitas | ⭐⭐⭐⭐ | Dark mode, sidebar mobile, desain modern |
| Kelengkapan Fitur | ⭐⭐⭐☆☆ | Dashboard masih kosong, beberapa halaman pakai data dummy |
| Performa & Best Practice | ⭐⭐⭐⭐ | React Query caching, lazy load belum ada |

---

## ✅ Hal yang Sudah Sangat Bagus

### 1. Arsitektur Generic CRUD Hooks
Pola `useGet`, `useCreate`, `useUpdate`, `useDelete` di folder [hooks/](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks) adalah keputusan arsitektur yang **sangat matang** untuk proyek semester. Ini mengeliminasi duplikasi kode secara signifikan di seluruh 10 modul admin.

### 2. Struktur Folder Konsisten
Setiap modul admin mengikuti pola yang sama:
```
pages/admin/[module]/
├── [Module]Index.tsx       ← Halaman tabel utama
├── Add[Module].tsx         ← Form tambah
├── Edit[Module].tsx        ← Form edit
├── hooks/                  ← useAdd, useEdit, useDelete
└── components/             ← TabelModuleIndex.tsx
```

### 3. Komponen UI Reusable
- `DataTable` dengan integrasi TanStack Table yang lengkap (sorting, searching, pagination)
- `Modal` dan `ModalConfirm` yang konsisten di seluruh modul
- `Button`, `InputText`, `InputPassword` sebagai design system primitif

### 4. State Management
- **Zustand** untuk auth state dengan `persist` middleware (localStorage)
- **React Query** untuk server state dengan cache invalidation yang benar
- Pemisahan concern yang jelas antara keduanya

### 5. API Layer
- Axios instance terpusat di [axios.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/lib/axios.ts) dengan interceptor untuk JWT token
- Auto-logout pada response 401
- Service layer terpisah per modul (`brandService`, `productService`, dll)

---

## ⚠️ Masalah yang Perlu Diperbaiki

### 1. 🔴 KRITIS: ProtectedRoute Dinonaktifkan

```tsx
// App.tsx baris 58-59
{/* <Route element={<ProtectedRoute />}> */}
  <Route path="/admin" element={<AdminLayout />}>
```

**Dampak:** Siapapun bisa mengakses `/admin/*` tanpa login. Ini adalah **celah keamanan paling serius** di proyek ini.

**Solusi:** Aktifkan kembali `ProtectedRoute` dan pastikan `navigate` di `Login.tsx` mengarah ke `/admin` (saat ini salah ke `/dashboard`).

---

### 2. 🔴 KRITIS: Typo di Type `auth.ts`

Di file [auth.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/auth.ts):

```diff
export type User = {
-    nme: string     // ❌ Typo! Seharusnya "name"
+    name: string    // ✅
     email: string
}

-export type LoginRespone = {  // ❌ Typo! Seharusnya "LoginResponse"
+export type LoginResponse = {  // ✅
```

Ini bisa menyebabkan `user.name` selalu `undefined` di seluruh aplikasi saat data login dikonsumsi.

---

### 3. 🟡 Login Error Handling Masih Pakai `alert()`

Di [Login.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/auth/Login.tsx#L57):
```tsx
alert(`Gagal Boss : ${message}`);  // ← Browser alert popup
```

Idealnya gunakan **toast notification** atau inline error message yang konsisten dengan desain UI admin.

---

### 4. 🟡 Generic Hooks Masih Pakai `alert()` untuk Notifikasi

Di [useCreate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts#L28):
```tsx
if (successMessage) {
  alert(successMessage(variables));  // ← Browser alert
}
```

Semua 4 generic hooks (`useCreate`, `useUpdate`, `useDelete`, `useGet`) menggunakan `alert()` bawaan browser. Sebaiknya diganti dengan **toast notification library** (contoh: `react-hot-toast` atau `sonner`) agar:
- Tidak memblokir UI
- Tampilannya premium dan konsisten dengan desain

---

### 5. 🟡 Dashboard Admin Masih Kosong

[AdminDashboard.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/AdminDashboard.tsx) hanya menampilkan 3 card statistik dengan **data hardcoded** (`124 Item`, `18 Merek`, `18 Toko`). Bagian `Quick Actions / Aktivitas Terbaru` di baris 78 masih kosong:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  {/* Kosong */}
</div>
```

---

### 6. 🟡 Route Path Inkonsisten

| Modul | Path Sidebar | Path Router | Konsisten? |
|---|---|---|:---:|
| Product Weights | `/admin/product-weights` | `/admin/productweights` | ❌ |
| Product Stores | `/admin/productstores` | `/admin/productstores` | ✅ |
| User Stores | `/admin/user-stores` | `/admin/user-stores` | ✅ |

Hook [useAddProductWeight](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/productweights/hooks/useAddProductWeight.ts) melakukan navigate ke `/admin/product-weights`, sementara router mendefinisikan `/admin/productweights`. Ini bisa menyebabkan **404 setelah submit form**.

---

### 7. 🟡 Beberapa Modul Index Masih Pakai Data Dummy Statis

Modul-modul berikut **belum terhubung ke React Query** dan masih menggunakan `useState` dengan data dummy lokal:

| Modul | File | Status Data |
|---|---|---|
| Criterias | [CriteriaIndex.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/criterias/CriteriaIndex.tsx) | `useState(initialCriterias)` — dummy statis |
| Recommendations | [ReqHistory.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/recommendations/ReqHistory.tsx) | `useState(initialHistory)` — dummy statis |

Bandingkan dengan modul yang sudah benar seperti [BrandIndex.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/brands/BrandIndex.tsx) yang sudah menggunakan `useGet` + `React Query`.

---

### 8. 🔵 Tidak Ada Lazy Loading Routes

Semua 30+ halaman di-import secara **eager** di [App.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/App.tsx). Ini membuat bundle size awal besar. Idealnya:

```tsx
// Sebelum (saat ini):
import BrandIndex from "./pages/admin/brands/BrandIndex";

// Sesudah (optimal):
const BrandIndex = lazy(() => import("./pages/admin/brands/BrandIndex"));
```

---

### 9. 🔵 Sidebar Navigation Link Sangat Repetitif

File [AdminSidebar.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/components/admin/AdminSidebar.tsx) (308 baris) bisa diringkas menjadi ~80 baris dengan mendefinisikan array navigasi dan map:

```tsx
const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/brands", icon: Tag, label: "Brands" },
  // ...
];
```

---

## 📋 Ringkasan Prioritas Perbaikan

| # | Prioritas | Item | Estimasi |
|---|---|---|---|
| 1 | 🔴 Kritis | Aktifkan kembali `ProtectedRoute` + fix navigate login | 10 menit |
| 2 | 🔴 Kritis | Fix typo `nme` → `name` & `LoginRespone` → `LoginResponse` | 5 menit |
| 3 | 🟡 Penting | Ganti semua `alert()` di generic hooks → toast notification | 30 menit |
| 4 | 🟡 Penting | Fix route path mismatch (`product-weights` vs `productweights`) | 10 menit |
| 5 | 🟡 Penting | Connect CriteriaIndex & ReqHistory ke React Query (`useGet`) | 20 menit |
| 6 | 🟡 Penting | Isi Dashboard admin (statistik dinamis dari API) | 45 menit |
| 7 | 🔵 Nice-to-have | Lazy loading routes dengan `React.lazy` + `Suspense` | 20 menit |
| 8 | 🔵 Nice-to-have | Refactor AdminSidebar jadi data-driven | 15 menit |

---

## 💡 Kesimpulan

Untuk proyek **Pemrograman Web 2 Semester 4**, R2A LABS sudah berada di **level sangat baik**. Arsitektur generic hooks, penggunaan TypeScript yang ketat, dan desain UI yang modern menunjukkan pemahaman mendalam tentang *React ecosystem*. 

Fokus utama sekarang sebaiknya di **keamanan (aktifkan ProtectedRoute)** dan **kualitas notifikasi (ganti alert → toast)**, karena dua hal ini yang paling berdampak pada kesan profesionalisme saat presentasi atau demo.
