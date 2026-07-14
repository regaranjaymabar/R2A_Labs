# ADMIN MODULE — CODE REVIEW REPORT

> **Reviewer**: Principal Software Engineer / Senior React Architect  
> **Date**: 2026-07-10  
> **Scope**: Admin module only — `pages/admin/`, supporting `hooks/`, `services/`, `types/`, `store/`, `routes/`, `lib/`, `components/admin/`, `components/layouts/AdminLayout.tsx`  
> **Files Reviewed**: 80+ files across 12 CRUD domains

---

## Executive Summary

| Dimension | Score (1–10) |
|---|---|
| **Architecture** | 7 |
| **Code Quality** | 6 |
| **React Best Practices** | 7 |
| **TypeScript** | 5 |
| **Services** | 6 |
| **State Management** | 7 |
| **Forms** | 7 |
| **Performance** | 6 |
| **Security** | 6 |
| **Maintainability** | 6 |
| | |
| **Overall Score** | **63 / 100** |

> [!IMPORTANT]
> The Admin module is **functionally capable** and demonstrates genuine architectural thinking with its layered hook system. However, **pervasive code duplication, weak TypeScript discipline, and several security concerns** prevent it from being production-ready without remediation.

---

## Project Overview

R2A LABS is a Laptop Recommendation Aggregator with a Decision Support System (SPK/SAW). The Admin module is a full CRUD back-office panel that manages:

- **Master Data**: Brands, Products, Stores, Users
- **SPK Configuration**: Criteria, Sub-Criteria, Product Weights
- **Store Operations**: Product-Store inventory, Store Profile
- **Access Control**: User-Store mapping
- **Analytics**: Recommendation History, Result Detail

The stack is React + TypeScript + Vite with TanStack Query, React Hook Form + Zod, Zustand, and Axios.

---

## Dependency Flow

```
┌────────────────────────────────────────────┐
│             Page (TSX)                     │
│  AddBrand.tsx / BrandIndex.tsx / etc.      │
└────────────────┬───────────────────────────┘
                 │ imports
┌────────────────▼───────────────────────────┐
│     Feature Hook (useAddBrand, etc.)       │
│  Form (RHF + Zod) + Mutation/Query logic   │
└────────────────┬───────────────────────────┘
                 │ delegates to
┌────────────────▼───────────────────────────┐
│     Generic Hook (useCreate/useUpdate/     │
│     useDelete/useGet)                      │
│  Wraps useMutation / useQuery              │
└────────────────┬───────────────────────────┘
                 │ calls
┌────────────────▼───────────────────────────┐
│       Service (brandService, etc.)         │
│  HTTP methods + payload formatting         │
└────────────────┬───────────────────────────┘
                 │ uses
┌────────────────▼───────────────────────────┐
│       Axios Instance (lib/axios.ts)        │
│  Interceptors: token injection, 401 guard  │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│           Backend REST API                 │
│  /api/superadmin/*, /api/admin/*           │
└────────────────────────────────────────────┘
```

This layered architecture is a **genuine strength**. Each layer has a single responsibility:
- **Pages** → UI rendering only  
- **Feature hooks** → form schema + mutation wiring  
- **Generic hooks** → cache invalidation + navigation + error handling  
- **Services** → HTTP + payload mapping  
- **Axios** → auth token, 401 interception

---

## Folder Review

### `hooks/` — Generic CRUD Hooks ⭐
| File | Assessment |
|---|---|
| [useCreate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts) | Well-abstracted. Encapsulates `useMutation`, cache invalidation, and navigation. |
| [useUpdate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useUpdate.ts) | Near-identical to `useCreate` — duplication opportunity. |
| [useDelete.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useDelete.ts) | Good. No navigation needed for delete. |
| [useGet.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useGet.ts) | Good wrapper with fallback support and sensible cache defaults. |
| [useIndonesianCities.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useIndonesianCities.ts) | Over-engineered for admin. Fires 34+ HTTP requests to an external API on mount. |

### `lib/` — Core Utilities
| File | Assessment |
|---|---|
| [axios.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/lib/axios.ts) | Good interceptor design. Token injection via Zustand `getState()` is correct. |
| [utils.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/lib/utils.ts) | Contains only `cn()` for Tailwind merge. Adequate. |

### `store/` — Zustand
| File | Assessment |
|---|---|
| [useAuthStore.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/store/useAuthStore.ts) | Minimal, well-scoped. Uses `persist` middleware correctly. |

### `routes/`
| File | Assessment |
|---|---|
| [ProtectedRoute.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/routes/ProtectedRoute.tsx) | Clean. Checks both authentication and role-based authorization. |

### `services/` — API Layer
| File | Assessment |
|---|---|
| [brandService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/brandService.ts) | Imports form type from hook — circular dependency smell. |
| [productStoreService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productStoreService.ts) | `getById` fetches entire list then filters — N+1 anti-pattern. |
| [productWeightService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productWeightService.ts) | `getAll` fetches ALL products and flattens nested criteria — expensive. `delete` is a no-op. |
| [subCriteriaService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/subCriteriaService.ts) | `getAll` fetches all criteria and manually extracts sub-criteria — duplicated network call. |
| [userStoreService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/userStoreService.ts) | Uses incorrect base paths (`/userstores` instead of `/api/...`). Missing `ApiResponse` unwrap. |
| [recommendationService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/recommendationService.ts) | Uses customer endpoint `/api/customer/spk/requests` from admin panel — wrong authorization scope. |

### `types/` — Type Definitions
| File | Assessment |
|---|---|
| [product.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/product.ts) | Has both camelCase AND snake_case fields for the same property. Duplicated shape. |
| [store.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/store.ts) | Both `isActive` and `is_active` — dual naming. |
| [subCriteria.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/subCriteria.ts) | All four date/id fields duplicated in both naming conventions. |
| [auth.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/auth.ts) | `User.role` uses union **with** `| string` — defeats the purpose of the union. |
| [recomendation.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/recomendation.ts) | Filename has typo ("recomendation" → "recommendation"). Very large type with extensive comments though. |

### `pages/admin/` — CRUD Pages
Each domain follows identical structure: `{Entity}Index.tsx`, `Add{Entity}.tsx`, `Edit{Entity}.tsx`, `components/Table{Entity}Index.tsx`, `hooks/useAdd{Entity}.ts`, `hooks/useEdit{Entity}.ts`, `hooks/useDelete{Entity}.ts`.

**This is the biggest duplication zone** — 9 domains × 3 hooks × nearly identical code.

---

## Detailed Findings

---

### Finding F-01: Massive Code Duplication Across CRUD Delete Hooks

**Severity**: 🔴 High  
**Affected Files**: All 9 `useDelete*.ts` hooks

| File | Lines |
|---|---|
| [useDeleteBrand.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/brands/hooks/useDeleteBrand.ts) | 58 |
| [useDeleteCriteria.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/criterias/hooks/useDeleteCriteria.ts) | 57 |
| [useDeleteProduct.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/products/hooks/useDeleteProduct.ts) | 56 |
| [useDeleteStore.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/stores/hooks/useDeleteStore.ts) | ~55 |
| [useDeleteUser.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/users/hooks/useDeleteUser.ts) | 60 |
| [useDeleteProductStore.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/productstores/hooks/useDeleteProductStore.ts) | ~55 |
| [useDeleteProductWeight.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/productweights/hooks/useDeleteProductWeight.ts) | ~55 |
| [useDeleteSubCriteria.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/subcriterias/hooks/useDeleteSubCriteria.ts) | ~55 |
| [useDeleteReqHistory.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/recommendations/hooks/useDeleteReqHistory.ts) | ~55 |

**Problem**: Every `useDelete*.ts` hook is structurally identical: `useState` for `deleteTarget`, `deleteMutation` via `useDelete`, three handler functions (`handleDelete`, `confirmDelete`, `cancelDelete`), and the same return shape. The only differences are the service function, query key, and display messages.

**Impact**: ~500 lines of duplicated code. Bug fixes (e.g., fixing the modal state race condition) must be applied 9 times.

**Recommendation**: Create a single generic `useDeleteWithConfirm<T>(config)` hook that encapsulates the modal state and returns `{ handleDelete, confirmDelete, cancelDelete, deleteTarget, isDeleting, deletingId }`.

---

### Finding F-02: `useCreate` and `useUpdate` Are Nearly Identical

**Severity**: 🟡 Medium  
**Affected Files**: [useCreate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts), [useUpdate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useUpdate.ts)

**Problem**: The two hooks differ only in their console.error label ("Create" vs "Update") and default error message. The `onSuccess`, `onError`, offline fallback, and `navigate` logic are identical.

**Impact**: Any behavior change (e.g., adding toast notifications instead of `alert()`) must be applied twice.

**Recommendation**: Merge into a single `useMutate` hook with a `type: 'create' | 'update'` discriminator for the default error message.

---

### Finding F-03: `alert()` Used for All User Notifications

**Severity**: 🟡 Medium  
**Affected Files**: All generic hooks ([useCreate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts), [useUpdate.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useUpdate.ts), [useDelete.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useDelete.ts)), [AdminLogin.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/auth/AdminLogin.tsx), [ManageAccess.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/userstores/ManageAccess.tsx)

**Problem**: Native `window.alert()` is used for success, error, and validation messages throughout the Admin module. This blocks the main thread, cannot be styled, and provides a poor UX.

**Impact**: Unprofessional user experience. Inconsistent with the polished UI design of the rest of the admin panel.

**Recommendation**: Replace with a toast library (e.g., `react-hot-toast`, `sonner`) or a custom notification system. The generic hooks already centralize this — a single change there would propagate globally.

---

### Finding F-04: Weak TypeScript — Pervasive `any` Usage

**Severity**: 🔴 High  
**Affected Files**: Multiple

| Location | Example |
|---|---|
| [useCreate.ts L4](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts#L4) | `CreateOptions<TVariables = any, TData = any>` |
| [useDelete.ts L3](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useDelete.ts#L3) | `DeleteOptions<TVariables = any, TData = any>` |
| [productService.ts L36](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productService.ts#L36) | `update: async (id, payload: any): Promise<any>` |
| [productStoreService.ts L39](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productStoreService.ts#L39) | `update: async (id, payload: any): Promise<any>` |
| [subCriteriaService.ts L57](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/subCriteriaService.ts#L57) | `create: async (payload: any)` |
| [brandService.ts L20](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/brandService.ts#L20) | `create: async (...): Promise<any>` |
| All `useAddX` hooks | `zodResolver(...) as any` cast |

**Problem**: The generic hooks default to `any` for generics, multiple services use `any` for payloads and responses, and `zodResolver(schema) as any` bypasses type checking entirely.

**Impact**: Eliminates TypeScript's primary benefit — compile-time safety. Runtime errors that should be caught during development slip through.

**Recommendation**: 
1. Remove `= any` defaults from generic hooks; force callers to provide types.
2. Replace `Promise<any>` returns in services with proper typed responses.
3. Fix the `zodResolver as any` casts — this usually indicates a version mismatch between `@hookform/resolvers` and `react-hook-form`.

---

### Finding F-05: Dual Naming Convention in Types (camelCase vs snake_case)

**Severity**: 🟡 Medium  
**Affected Files**: [product.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/product.ts), [store.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/store.ts), [subCriteria.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/subCriteria.ts), [user.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/user.ts)

**Problem**: Types contain both `brandId` and `brand_id`, `modelName` and `model_name`, `isActive` and `is_active`, etc. This is a symptom of an unresolved API contract — the frontend isn't sure which casing the backend returns.

**Example from** [product.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/product.ts):
```typescript
brandId?: number;
brand_id?: number;    // Duplicate
modelName?: string;
model_name?: string;  // Duplicate
```

**Impact**: Every consumer must check both fields (e.g., `productData.brandId || productData.brand_id`), leading to fragile code like in [useEditProduct.ts L61](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/products/hooks/useEditProduct.ts#L61).

**Recommendation**: Normalize at the service layer (like `subCriteriaService.ts` already does with `normalizeSubCriteria`). Define types in a single convention (camelCase for frontend) and transform API responses once.

---

### Finding F-06: `ResultDetail.tsx` Uses Hardcoded Dummy Data

**Severity**: 🔴 High  
**Affected File**: [ResultDetail.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/recommendations/ResultDetail.tsx)

**Problem**: The entire page uses a hardcoded `dummyResultSession` object (lines 16–83). The `useParams()` `id` is captured but never used to fetch real data. The page always shows "Andi Pratama" regardless of which recommendation is clicked.

**Impact**: This page is completely non-functional in production. It does not communicate with the backend at all.

**Recommendation**: Implement `recommendationService.getById(id)` integration using `useGet` or `useQuery`, matching the pattern used in other Edit pages.

---

### Finding F-07: Services Import Form Types from Hooks — Circular Dependency Smell

**Severity**: 🟡 Medium  
**Affected Files**: [brandService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/brandService.ts#L2), [productService.ts L5](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productService.ts#L5), [storeService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/storeService.ts#L2), [userService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/userService.ts#L2), [productStoreService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productStoreService.ts#L2), [productWeightService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productWeightService.ts#L2), [userStoreService.ts L2](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/userStoreService.ts#L2)

**Problem**: Services (a lower-level layer) import `BrandFormData`, `ProductFormData`, etc. from feature hooks (a higher-level layer): `import { type BrandFormData } from "../pages/admin/brands/hooks/useAddBrand"`. This inverts the dependency direction.

**Impact**: Services become coupled to page-specific hooks. Moving or renaming a hook breaks the service. Circular import risk.

**Recommendation**: Define input/payload types in `types/` files alongside domain types, or co-locate them in the service file itself. Services should never import from `pages/`.

---

### Finding F-08: `productStoreService.getById` Fetches Entire List

**Severity**: 🟡 Medium  
**Affected File**: [productStoreService.ts L14-18](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productStoreService.ts#L14-L18)

**Problem**:
```typescript
getById: async (id: number | string): Promise<ProductStore> => {
    const response = await api.get("/api/admin/inventory/my-store");
    const list = response.data.data || response.data || [];
    return list.find((item: any) => String(item.id) === String(id));
},
```
This fetches the entire inventory list every time a single item is needed. The same pattern is used in [productWeightService.ts L34-37](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productWeightService.ts#L34-L37).

**Impact**: Wasted bandwidth and latency, especially as inventory grows. Also, the `find()` could return `undefined` but the return type claims `ProductStore` — potential runtime crash.

**Recommendation**: Use a proper `GET /api/admin/inventory/:id` endpoint if available. If not, at least cache the list and add a null check.

---

### Finding F-09: `productWeightService.delete` Is a No-Op

**Severity**: 🔴 High  
**Affected File**: [productWeightService.ts L50-52](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productWeightService.ts#L50-L52)

**Problem**:
```typescript
delete: async (_id: number | string): Promise<any> => {
    return { success: true };
},
```
The delete function doesn't make any API call. It silently pretends success.

**Impact**: Users believe a product weight was deleted when it was not. The UI cache invalidates and the row may temporarily disappear, but a page refresh brings it back. Data integrity issue.

**Recommendation**: Implement a real DELETE endpoint or remove the delete action from the UI entirely.

---

### Finding F-10: `productService.getAll` Silently Falls Back to Customer Endpoint

**Severity**: 🟡 Medium  
**Affected File**: [productService.ts L10-19](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/productService.ts#L10-L19)

**Problem**: If the superadmin endpoint fails for any reason (including auth errors), the code silently tries `/api/customer/catalog`. This masks real errors and may return a different data shape.

**Impact**: Admin could unknowingly work with customer-facing data (which may have fewer fields or different filters).

**Recommendation**: Only fall back for specific, expected errors (e.g., 403 for store_admin role). Log a warning. Don't swallow unrelated errors.

---

### Finding F-11: `userStoreService` Uses Wrong API Paths

**Severity**: 🔴 High  
**Affected File**: [userStoreService.ts](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/services/userStoreService.ts)

**Problem**: All endpoints use bare paths (`/userstores`, `/userstores/:id`) without the `/api/superadmin/` prefix used by every other service. The `ManageAccess.tsx` page doesn't even use this service — it uses `userService` directly instead.

**Impact**: This entire service is likely **dead code** or non-functional. API calls would hit wrong endpoints.

**Recommendation**: Either fix the paths to match the backend or remove the service if it's unused.

---

### Finding F-12: `auth.ts` User.role Union Type Is Defeated by `| string`

**Severity**: 🟡 Medium  
**Affected File**: [auth.ts L17](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/auth.ts#L17)

**Problem**:
```typescript
role?: "admin" | "super_admin" | "store_admin" | "user" | string
```
The `| string` at the end makes the entire union type equivalent to just `string`. TypeScript cannot narrow or auto-complete the role values.

**Impact**: No type safety for role checking. The same issue appears in [criteria.ts L12](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/types/criteria.ts#L12) with `type: "benefit" | "cost" | string`.

**Recommendation**: Remove `| string`. If the backend might return unexpected values, handle them at the normalization layer, not in the type definition.

---

### Finding F-13: Inconsistent Role String Comparison

**Severity**: 🟡 Medium  
**Affected Files**: [AdminDashboard.tsx L13](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/AdminDashboard.tsx#L13), [AdminSidebar.tsx L30](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/components/admin/AdminSidebar.tsx#L30), [AdminHeader.tsx L84](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/components/admin/AdminHeader.tsx#L84)

**Problem**: The code checks for both `"super_admin"` and `"superadmin"` across different files:
- Dashboard: `user?.role === "admin"` (checks store admin)
- Sidebar: `user?.role === "super_admin" || user?.role === "superadmin"`  
- Header: `user?.role === "superadmin" || user?.role === "super_admin"`
- ProtectedRoute: `allowedRoles={["superadmin", "super_admin", "admin", "store_admin"]}`

**Impact**: If the backend changes to return a single canonical role string, half the checks break.

**Recommendation**: Normalize the role in `useAuthStore.login()` or create a helper function `isSuperAdmin(user)`.

---

### Finding F-14: `MyStoreProfile.tsx` Does NOT Use React Hook Form or Zod

**Severity**: 🟡 Medium  
**Affected File**: [MyStoreProfile.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/store-profile/MyStoreProfile.tsx)

**Problem**: Unlike every other form page that uses RHF + Zod, this page uses raw `useState` + `onChange` handlers with `required` HTML attributes only. No Zod validation, no error messages, no field-level error display.

**Impact**: Inconsistent validation UX. No client-side validation beyond browser's basic `required`. No maximum length enforcement on critical fields (address, etc.).

**Recommendation**: Refactor to use RHF + Zod like other forms for consistency.

---

### Finding F-15: `ManageAccess.tsx` Mixes Concerns — 369 Lines

**Severity**: 🟡 Medium  
**Affected File**: [ManageAccess.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/userstores/ManageAccess.tsx)

**Problem**: This single component contains: data fetching (2 queries), data transformation (useMemo), filtering logic, modal state management, form submission (2 mutation paths), and the full JSX tree including stats cards, filters, table, 2 modals. At 369 lines, it's the largest page component.

**Impact**: Hard to test, hard to refactor, hard to read.

**Recommendation**: Extract `useManageAccess()` hook (fetch + transform + filter), move mutation logic to a dedicated hook, and extract the add-access modal into its own component.

---

### Finding F-16: Offline Fallback Logic in Error Path (Generic Hooks)

**Severity**: 🟢 Low  
**Affected Files**: [useCreate.ts L48-58](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useCreate.ts#L48-L58), [useUpdate.ts L49-59](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/hooks/useUpdate.ts#L49-L59)

**Problem**: After showing an error alert, the code checks `if (!err.response)` to invoke an offline fallback that navigates away and shows a success message — even though the user just saw an error alert.

**Impact**: The user sees an error alert immediately followed by a success alert and a navigation, which is confusing and contradictory.

**Recommendation**: Remove the automatic navigation in offline fallback, or clearly label it as development-only behavior with an environment guard (`if (import.meta.env.DEV)`).

---

### Finding F-17: `useEditBrand.ts` Imports `Brand` Type from `BrandIndex.tsx`

**Severity**: 🟢 Low  
**Affected File**: [useEditBrand.ts L7](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/brands/hooks/useEditBrand.ts#L7)

**Problem**: `import { type Brand } from "../BrandIndex"` — but `Brand` is defined in `types/brand.ts`. The import should come from the types module, not a page component.

**Impact**: Fragile dependency. If `BrandIndex` doesn't re-export `Brand`, this breaks.

**Recommendation**: Import from `../../../../types/brand`.

---

### Finding F-18: QueryClient Created Outside React Tree

**Severity**: 🟢 Low  
**Affected File**: [App.tsx L43](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/App.tsx#L43)

**Problem**: `const queryClient = new QueryClient()` at module scope means a single instance shared across hot reloads. No default options configured (retry, stale time, etc.).

**Impact**: In development, stale QueryClient can cause subtle cache issues after HMR. In production, default retry of 3 may cause excessive failed requests.

**Recommendation**: Configure sensible defaults:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});
```

---

### Finding F-19: Index Pages Inline `useQuery` Instead of Using `useGet`

**Severity**: 🟢 Low  
**Affected Files**: [BrandIndex.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/brands/BrandIndex.tsx), [AdminDashboard.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/AdminDashboard.tsx), [ManageAccess.tsx](file:///c:/Users/Adies/Documents/Semester%204/Pemrograman%20Web%202/R2A_Labs/frontend/src/pages/admin/userstores/ManageAccess.tsx)

**Problem**: Some pages use `useQuery` directly while others use the `useGet` wrapper. Inconsistency means cache defaults (staleTime, gcTime) vary across pages.

**Impact**: Inconsistent caching behavior. The `useGet` hook's sensible defaults (5 min stale, 30 min GC) are bypassed when `useQuery` is used directly.

**Recommendation**: Standardize on `useGet` for all read operations, or configure global defaults in the QueryClient.

---

### Finding F-20: No Loading Skeleton / Suspense Boundaries

**Severity**: 🟢 Low  
**Affected Files**: All Index pages

**Problem**: Loading states show a simple `<Loader2>` spinner or text like "Sedang memuat..." but no skeleton UI.

**Impact**: Layout shift when data loads. Less polished UX.

**Recommendation**: Consider skeleton loaders for table views to improve perceived performance.

---

## Positive Findings ✅

1. **Layered Architecture**: The `Page → Hook → Service → Axios → API` layering is well thought out and consistent. This is the project's strongest asset.

2. **Generic CRUD Hooks**: `useCreate`, `useUpdate`, `useDelete`, `useGet` provide excellent DRY abstractions for common mutation patterns. Cache invalidation and navigation are handled centrally.

3. **React Hook Form + Zod Integration**: Most forms follow a clean pattern: Zod schema defined once, reused across Add/Edit, with proper resolver integration.

4. **Zustand Store — Minimal and Correct**: The auth store is lean (30 lines), uses `persist` middleware correctly, and avoids over-storing. The interceptor accesses it via `getState()` (not a hook), which is the correct approach for non-React code.

5. **Protected Routes with Role-Based Access**: `ProtectedRoute.tsx` correctly checks both authentication status and role arrays, with a clean redirect mechanism.

6. **Axios Interceptors**: Automatic token injection and 401 → logout flow is production-quality. The `auth:unauthorized` event dispatch is a nice touch for cross-concern communication.

7. **Table Component Abstraction**: The `DataTable` component (from `components/ui/common/`) with TanStack Table integration and `DataTableColumnHeader` provides sorting and search out of the box.

8. **Confirmation Modals Before Delete**: Every delete action goes through a `ModalConfirm` with entity-specific messaging. Good UX pattern.

9. **Responsive Sidebar**: The `AdminSidebar` handles mobile (hamburger + overlay) and desktop (fixed) layouts with proper ARIA labels.

10. **Code Comments**: Indonesian comments throughout the codebase aid team understanding, and the `recomendation.ts` types have excellent documentation linking MySQL columns to TypeScript properties.

---

## Improvement Opportunities

### 🔴 High Priority

| # | Opportunity | Effort |
|---|---|---|
| 1 | **Fix `ResultDetail.tsx`** — Replace dummy data with real API integration | 2–3 hours |
| 2 | **Fix `userStoreService.ts`** — Correct API paths or remove dead code | 1 hour |
| 3 | **Fix `productWeightService.delete`** — Implement real delete or remove UI action | 1 hour |
| 4 | **Eliminate `any` in services** — Type all payloads and responses | 3–4 hours |
| 5 | **Extract generic `useDeleteWithConfirm`** — Eliminate 9× duplicated hooks | 2–3 hours |

### 🟡 Medium Priority

| # | Opportunity | Effort |
|---|---|---|
| 6 | **Normalize API response casing** at service layer — single source of truth | 4–6 hours |
| 7 | **Replace `alert()` with toast notifications** | 2 hours |
| 8 | **Move form types from hooks to `types/`** — fix inverted dependency | 2 hours |
| 9 | **Refactor `ManageAccess.tsx`** — extract hook + sub-components | 3 hours |
| 10 | **Add `MyStoreProfile.tsx` to RHF+Zod** — consistent form handling | 2 hours |
| 11 | **Fix role union type** — remove `\| string` from auth types | 30 min |
| 12 | **Create `isSuperAdmin()` helper** — centralize role checking | 30 min |

### 🟢 Low Priority

| # | Opportunity | Effort |
|---|---|---|
| 13 | Merge `useCreate` + `useUpdate` into `useMutate` | 1 hour |
| 14 | Standardize all reads through `useGet` | 1 hour |
| 15 | Add QueryClient default options | 15 min |
| 16 | Add skeleton loaders for tables | 2–3 hours |
| 17 | Fix `recomendation.ts` filename typo | 5 min |
| 18 | Guard offline fallback with `import.meta.env.DEV` | 30 min |

---

## Technical Debt

| Debt Area | Severity | Estimate |
|---|---|---|
| Code duplication across 9 delete hooks | High | ~500 duplicated lines |
| `any` type usage in services and hooks | High | 30+ instances |
| Dual camelCase/snake_case in types | Medium | 6 type files affected |
| Inline `useQuery` vs `useGet` inconsistency | Low | 4 pages |
| Dead `userStoreService` | Medium | Entire file |
| Dummy-only `ResultDetail.tsx` | High | Entire page |
| `alert()` as notification system | Medium | 15+ call sites |
| Service → Hook import direction | Medium | 7 services |

**Estimated Total Technical Debt**: ~1,800 lines of duplicated or problematic code. Approximately 3–5 developer-days to remediate fully.

---

## Security Review (High-Level)

| Area | Status | Notes |
|---|---|---|
| **Authentication Flow** | ✅ Adequate | Login → store token in Zustand persist → interceptor injects `Bearer` token |
| **Token Storage** | ⚠️ Acceptable | Uses `localStorage` via Zustand persist. Vulnerable to XSS but standard for SPAs. |
| **401 Handling** | ✅ Good | Interceptor catches 401 → calls `logout()` → dispatches event |
| **Role-Based Authorization** | ⚠️ Client-side only | `ProtectedRoute` checks roles, but all admin routes share the same `allowedRoles` array. No per-route granularity. A store_admin can navigate to `/admin/brands` via URL. |
| **Input Validation** | ✅ Mostly covered | Zod schemas validate inputs before mutation. Exception: `MyStoreProfile.tsx` uses only HTML `required`. |
| **CSRF Protection** | ❌ Missing | No CSRF tokens. Acceptable if API is JWT-only (no cookies for auth). |
| **Sensitive Data Exposure** | ⚠️ Concern | Auth state (including token) persisted to `localStorage` as plaintext under key `auth-storage`. |

> [!WARNING]
> **Route-level authorization is too broad.** The single `allowedRoles={["superadmin", "super_admin", "admin", "store_admin"]}` on the parent route means any authenticated staff member can access superadmin-only routes (Brands, Products, Stores, Criteria, Users). The sidebar hides these links for store_admin, but direct URL access is not blocked. Backend authorization must be the primary guard.

---

## Code Duplication Analysis

| Pattern | Instances | Lines Each | Total Duplicated |
|---|---|---|---|
| `useDelete*.ts` hooks | 9 | ~55 | **~495** |
| `useAdd*.ts` hooks (structural) | 9 | ~60 | ~540 (partially unique schemas) |
| `useEdit*.ts` hooks (structural) | 8 | ~85 | ~680 (partially unique population) |
| Index page header + error banner JSX | 9 | ~40 | ~360 |
| Table action column (Edit + Delete buttons) | 9 | ~20 | ~180 |

**Estimated Duplication Percentage**: ~35–40% of the Admin module code is structurally duplicated.

**Biggest abstraction opportunity**: A single `useDeleteWithConfirm(service, queryKey, displayNameFn)` hook would eliminate ~450 lines immediately.

---

## Reusability Candidates

| Candidate | Current State | Why Reusable |
|---|---|---|
| Delete hooks (9 copies) | Duplicated per entity | Identical logic; only service + queryKey differs |
| Index page header layout | Repeated JSX block | Title + subtitle + status badge + action buttons — same structure |
| Form page layout | Repeated JSX block | Back button + card wrapper + accent bar + form slot + action buttons |
| Error banner component | Inline in each Index page | Amber warning box with icon + message + fallback note |
| `normalizeSubCriteria()` | In subCriteriaService only | General camelCase↔snake_case normalizer could be shared |
| Table action column | Copied per table | Edit + Delete buttons with loading/disabled state |

---

## Final Assessment

| Criterion | Evaluation |
|---|---|
| **Readiness for Production** | ⚠️ **Not production-ready.** `ResultDetail.tsx` is dummy-only, `userStoreService` has wrong API paths, `productWeightService.delete` is a no-op, and client-side route auth is insufficient. Fix these 4 critical issues before deploying. |
| **Maintainability** | 6/10. The layered architecture is excellent, but the extensive duplication means changes must be applied N times. One developer who understands the pattern can maintain it, but it doesn't scale to a team. |
| **Scalability** | 6/10. Adding a new CRUD entity requires copy-pasting 7 files (3 hooks, 3 pages, 1 table component) and a service. This is fast but error-prone. A code generator or higher-order abstractions would improve this. |
| **Code Quality** | 6/10. Clean, readable code with good naming. Undermined by `any` overuse, dual naming conventions, and `alert()` notifications. |
| **Developer Experience** | 7/10. The patterns are consistent and well-documented with Indonesian comments. A new developer can understand one domain and immediately work on all others. The duplication, however, increases the surface area for mistakes. |
| **Overall Score** | **63 / 100** |

> [!TIP]
> The project demonstrates strong architectural instincts — the layered hook system, Zustand minimalism, and consistent page structure show a developer who thinks about abstractions. The main growth area is **following through on those abstractions** to eliminate the duplication and strengthen TypeScript usage. Fixing the 5 high-priority items (estimated 10–12 hours) would raise this score to ~75/100.
