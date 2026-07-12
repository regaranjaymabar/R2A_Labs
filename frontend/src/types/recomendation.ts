// ============================================================================
// 1. Definisi Tipe Data Hasil Rekomendasi (recommendation_result)
// ============================================================================
// Menyesuaikan struktur kolom asli di MySQL (id_recommendation_result, method_used, score, ranking, dll)
// serta properti hasil JOIN untuk presentasi UI di halaman detail hasil (ResultDetail.tsx).
export type RecommendationResult = {
    // Kolom Asli Tabel recommendation_result di MySQL
    id_recommendation_result?: number;
    recommendation_requests_id_recommendation_request?: number;
    product_store_id_product_store?: number;
    method_used?: string | "SAW" | "WP" | "TOPSIS"; // Sesuai kolom varchar(6)
    score?: number; // Sesuai kolom decimal(10,6)
    ranking?: number; // Sesuai kolom int(11)
    created_at?: string; // Sesuai kolom datetime(3)

    // Properti Hasil JOIN / Formatting untuk Tampilan UI Detail Rekomendasi
    id?: number; // Alias untuk id_recommendation_result
    rank: number; // Alias untuk ranking
    saw_score: number; // Alias untuk score
    product_name?: string; // Nama laptop
    name?: string; // Alias nama laptop
    brand?: string;
    price_display?: string;
    ram_display?: string;
    cpu_display?: string;
    storage_display?: string;
    is_chosen_by_user?: boolean;
    criteria_breakdown?: {
        price_norm?: number;
        ram_norm?: number;
        cpu_norm?: number;
        storage_norm?: number;
        [key: string]: number | undefined;
    };
};

// ============================================================================
// 2. Definisi Tipe Data Bobot Preferensi (recommendation_weight)
// ============================================================================
export type RecommendationWeight = {
    id_recommendation_weight?: number;
    recommendation_requests_id_recommendation_request?: number;
    criteria_id?: number;
    criteria_code?: string;
    weight_percentage?: number;
    weight_value?: number;
    ram: number;
    price: number;
    processor?: number;
    storage?: number;
    [key: string]: number | string | undefined;
};

// ============================================================================
// 3. Definisi Tipe Data Riwayat Rekomendasi (recommendation_requests)
// ============================================================================
// Menyesuaikan struktur tabel asli di MySQL (id_recommendation_request, customers_id_customer, dll)
// serta properti gabungan (JOIN) dengan tabel customer, weight, dan result untuk kebutuhan tampilan UI.
export type RecommendationRequest = {
    // Standar Backend API (camelCase sesuai Prisma ORM)
    id: number;
    customerId?: number;
    kebutuhan?: string;
    budgetMin?: number;
    budgetMax?: number;
    status?: string | "FILTERING" | "DRAFT" | "PENDING" | "CALCULATED" | "CHOSEN" | "COMPLETED" | "ABANDONED";
    createdAt?: string;
    customer?: {
        id: number;
        name: string;
        email: string;
    };

    // Alias & Tampilan UI Frontend (Kompatibilitas)
    id_recommendation_request?: number;
    customers_id_customer?: number;
    budget_min?: number;
    budget_max?: number;
    created_at?: string;
    user_name?: string;
    user_email?: string;
    usage_purpose?: string;
    budget_range?: string;
    top_recommendation?: RecommendationResult;
    weights?: RecommendationWeight;
    user_choice?: string;
    ranked_laptops?: RecommendationResult[];
    recommendationWeights?: any[];
    recommendationResults?: any[];
};
