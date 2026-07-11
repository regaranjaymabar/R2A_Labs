import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../../services/userService";
import { storeService } from "../../../../services/storeService";
import type { UserData } from "../../../../types/user";
import type { Store } from "../../../../types/store";
import type { UserStoreAccess } from "../../../../types/userStore";

export function useManageAccess() {
  const queryClient = useQueryClient();

  // 1. Fetch Pengguna & Cabang Toko dari Backend API
  const { data: usersData, isLoading: isLoadingUsers } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return await userService.getAll();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: storesData, isLoading: isLoadingStores } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      try {
        return await storeService.getAll();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Daftar Pegawai Khusus Role "admin" / "store_admin" dari database
  const availableStoreAdmins = useMemo(() => {
    if (!usersData) return [];
    return usersData.filter((u) => u.role === "admin" || u.role === "store_admin");
  }, [usersData]);

  // Daftar Cabang Toko Fisik dari database
  const availableStores = useMemo(() => {
    return storesData || [];
  }, [storesData]);

  // Transformasi data relasi Pengguna -> Toko dari database
  const data: UserStoreAccess[] = useMemo(() => {
    if (!usersData) return [];
    return usersData
      .filter((u) => u.role === "admin" || u.role === "store_admin" || u.storeId || u.store)
      .map((u) => {
        const storeId = u.storeId || u.store?.id || 0;
        const storeObj = storesData?.find((s) => s.id === storeId);
        return {
          id: u.id,
          user_id: u.id,
          user_name: u.name,
          user_email: u.email,
          store_id: storeId,
          store_name: storeObj?.name || u.store?.name || (storeId ? `Toko #${storeId}` : "Belum Ditugaskan"),
          store_city: storeObj?.city || "-",
          is_active: Boolean(u.isActive ?? u.is_active ?? true),
          assigned_at: u.createdAt || u.created_at || new Date().toISOString().slice(0, 19).replace("T", " "),
        };
      });
  }, [usersData, storesData]);

  // State Filter
  const [filterStore, setFilterStore] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "revoked">("all");

  // State Modal Tambah Akses Toko
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (availableStoreAdmins.length > 0 && !selectedUserId) {
      setSelectedUserId(availableStoreAdmins[0].id);
    }
  }, [availableStoreAdmins, selectedUserId]);

  useEffect(() => {
    if (availableStores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(availableStores[0].id);
    }
  }, [availableStores, selectedStoreId]);

  // State Modal Confirm Cabut/Pulihkan Akses
  const [revokeTarget, setRevokeTarget] = useState<UserStoreAccess | null>(null);

  // Aksi Cabut Akses (Revoke) / Pulihkan Akses (Grant) - Buka Modal
  const handleToggleRevoke = (item: UserStoreAccess) => {
    setRevokeTarget(item);
  };

  // Eksekusi perubahan dari ModalConfirm ke Backend API
  const confirmToggleRevoke = async () => {
    if (!revokeTarget) return;

    try {
      setIsSubmitting(true);
      const targetUser = usersData?.find((u) => u.id === revokeTarget.user_id);
      if (targetUser) {
        await userService.update(targetUser.id, {
          storeId: revokeTarget.store_id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role as any,
        });
        await queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      setRevokeTarget(null);
    } catch (err: any) {
      alert(`Gagal mengubah status akses toko: ${err?.response?.data?.message || err?.message || "Error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simpan Penugasan Baru ke Backend API
  const handleCreateAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminObj = availableStoreAdmins.find((a) => a.id === Number(selectedUserId));
    const storeObj = availableStores.find((s) => s.id === Number(selectedStoreId));

    if (!adminObj || !storeObj) {
      alert("Pilih Pegawai dan Cabang Toko dengan benar!");
      return;
    }

    try {
      setIsSubmitting(true);
      await userService.update(adminObj.id, {
        storeId: storeObj.id,
        name: adminObj.name,
        email: adminObj.email,
        role: adminObj.role as any,
      });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(`Gagal menyimpan akses toko: ${err?.response?.data?.message || err?.message || "Error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchStore = filterStore === "all" || item.store_id.toString() === filterStore;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && item.is_active) ||
        (filterStatus === "revoked" && !item.is_active);
      return matchStore && matchStatus;
    });
  }, [data, filterStore, filterStatus]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((d) => d.is_active).length,
      revoked: data.filter((d) => !d.is_active).length,
      uniqueAdmins: new Set(data.filter((d) => d.is_active).map((d) => d.user_id)).size,
    };
  }, [data]);

  return {
    data,
    filteredData,
    stats,
    isLoading: isLoadingUsers || isLoadingStores,
    availableStoreAdmins,
    availableStores,
    filterStore,
    setFilterStore,
    filterStatus,
    setFilterStatus,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUserId,
    setSelectedUserId,
    selectedStoreId,
    setSelectedStoreId,
    isSubmitting,
    revokeTarget,
    setRevokeTarget,
    handleToggleRevoke,
    confirmToggleRevoke,
    handleCreateAccess,
  };
}
