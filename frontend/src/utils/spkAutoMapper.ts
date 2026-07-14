import { subCriteriaService } from "../services/subCriteriaService";
import { initialSubCriterias } from "../pages/admin/subcriterias/SubCriteriaIndex";

/**
 * Otomatis memetakan spesifikasi input laptop ke ID Sub-Kriteria yang sesuai di database.
 */
export async function getAutoMappedSubCriteriaIds(data: any): Promise<number[]> {
  try {
    let allSubs: any[] = [];
    try {
      allSubs = await subCriteriaService.getAll();
    } catch (err) {
      console.warn("Fails to fetch sub-criteria from server, using local fallback data for auto mapping:", err);
      allSubs = initialSubCriterias;
    }
    const ids: number[] = [];

    // Helper untuk mencari subCriteriaId berdasarkan kode kriteria dan kondisi pencocokan
    const findSubId = (criteriaCode: string, predicate: (sub: any) => boolean) => {
      const sub = allSubs.find((s) => s.criteria_code === criteriaCode && predicate(s));
      return sub ? sub.id : null;
    };

    // 1. RAM (C2) - benefit
    const matchRam = String(data.ram).toLowerCase().match(/(\d+)/);
    const ramGb = matchRam ? parseInt(matchRam[1]) : 8;
    const ramId = findSubId("C2", (s) => {
      const desc = s.description.toLowerCase();
      if (desc.includes("<= 8") && ramGb <= 8) return true;
      if (desc.includes("12") && ramGb === 12) return true;
      if (desc.includes("16") && ramGb === 16) return true;
      if (desc.includes("24") && ramGb === 24) return true;
      if (desc.includes(">= 32") && ramGb >= 32) return true;
      // Fallback
      if (ramGb === 64 && desc.includes("64")) return true;
      if (ramGb === 32 && desc.includes("32")) return true;
      if (ramGb === 16 && desc.includes("16")) return true;
      if (ramGb === 8 && desc.includes("8")) return true;
      if (ramGb === 4 && desc.includes("4")) return true;
      return false;
    });
    if (ramId) ids.push(ramId);

    // 2. Storage (C3) - benefit
    const storageVal = String(data.storage).toLowerCase();
    const isTb = storageVal.includes("tb") || storageVal.includes("1000") || storageVal.includes("2000");
    const matchStorage = storageVal.match(/(\d+)/);
    let storageGb = matchStorage ? parseInt(matchStorage[1]) : 512;
    if (isTb && storageGb < 10) {
      storageGb = storageGb * 1024;
    }
    const storageId = findSubId("C3", (s) => {
      const desc = s.description.toLowerCase();
      if (desc.includes("256") && storageGb <= 256) return true;
      if (desc.includes("512") && storageGb > 256 && storageGb <= 512) return true;
      if ((desc.includes("1 tb") || desc.includes("1000") || desc.includes("1024")) && storageGb > 512 && storageGb <= 1024) return true;
      if ((desc.includes("2 tb") || desc.includes("2000") || desc.includes("2048")) && storageGb > 1024) return true;
      return false;
    });
    if (storageId) ids.push(storageId);

    // 3. Battery (C4) - benefit
    const batteryStr = String(data.battery || "").toLowerCase();
    const matchBattery = batteryStr.match(/(\d+)/);
    const wh = matchBattery ? parseInt(matchBattery[1]) : 50; // default 50
    const batteryId = findSubId("C4", (s) => {
      const desc = s.description.toLowerCase();
      if (desc.includes("< 45") && wh < 45) return true;
      if (desc.includes("45 - 59") && wh >= 45 && wh <= 59) return true;
      if (desc.includes("60 - 74") && wh >= 60 && wh <= 74) return true;
      if (desc.includes("75 - 89") && wh >= 75 && wh <= 89) return true;
      if (desc.includes(">= 90") && wh >= 90) return true;
      // Fallback
      if (desc.includes("< 30") && wh < 30) return true;
      if (desc.includes("30 - 44") && wh >= 30 && wh <= 44) return true;
      if (desc.includes("45 - 59") && wh >= 45 && wh <= 59) return true;
      if (desc.includes("60 - 75") && wh >= 60 && wh <= 75) return true;
      if (desc.includes("76 - 90") && wh >= 76 && wh <= 90) return true;
      if (desc.includes("> 90") && wh > 90) return true;
      return false;
    });
    if (batteryId) ids.push(batteryId);

    // 4. Berat (C5) - cost
    const kg = parseFloat(String(data.weight || "1.6"));
    const weightId = findSubId("C5", (s) => {
      const desc = s.description.toLowerCase();
      if (desc.includes("> 2.5") && kg > 2.5) return true;
      if (desc.includes("2.0 - 2.5") && kg >= 2.0 && kg <= 2.5) return true;
      if (desc.includes("1.5 - 1.99") && kg >= 1.5 && kg < 2.0) return true;
      if (desc.includes("1.2 - 1.49") && kg >= 1.2 && kg < 1.5) return true;
      if (desc.includes("< 1.2") && kg < 1.2) return true;
      // Fallback
      if (desc.includes(">= 2.5") && kg >= 2.5) return true;
      return false;
    });
    if (weightId) ids.push(weightId);

    // 5. Processor (C6) - benefit
    const procVal = String(data.processor).toLowerCase();
    const processorId = findSubId("C6", (s) => {
      const desc = s.description.toLowerCase();
      if ((procVal.includes("celeron") || procVal.includes("pentium") || procVal.includes("athlon") || procVal.includes("n-series") || procVal.includes("n100") || procVal.includes("n200")) && (desc.includes("celeron") || desc.includes("n-series"))) return true;
      if ((procVal.includes("i3") || procVal.includes("ryzen 3")) && desc.includes("i3")) return true;
      if ((procVal.includes("i5") || procVal.includes("ryzen 5")) && desc.includes("i5")) return true;
      if ((procVal.includes("i7") || procVal.includes("ryzen 7") || procVal.includes("m1") || procVal.includes("m2")) && (desc.includes("i7") || desc.includes("m1-m2"))) return true;
      if ((procVal.includes("i9") || procVal.includes("ryzen 9") || procVal.includes("ultra 9") || procVal.includes("m3") || procVal.includes("ultra")) && (desc.includes("i9") || desc.includes("m3") || desc.includes("ultra"))) return true;
      return false;
    });
    if (processorId) ids.push(processorId);

    // 6. Ukuran Layar (C7) - benefit
    const inches = parseFloat(String(data.screenSize || "14"));
    const screenSizeId = findSubId("C7", (s) => {
      const desc = s.description.toLowerCase();
      if (desc.includes("< 13") && inches < 13) return true;
      if (desc.includes("13 - 13.99") && inches >= 13 && inches < 14) return true;
      if (desc.includes("14 - 14.99") && inches >= 14 && inches < 15) return true;
      if ((desc.includes("15 - 16") || desc.includes("15 - 15.99")) && inches >= 15 && inches <= 16) return true;
      if ((desc.includes("> 16") || desc.includes(">= 16")) && inches > 16) return true;
      return false;
    });
    if (screenSizeId) ids.push(screenSizeId);

    // 7. Tahun Rilis (C8) - benefit
    const yearStr = String(data.releaseYear).toLowerCase();
    const matchYear = yearStr.match(/(\d{4})/);
    const year = matchYear ? parseInt(matchYear[1]) : 2023;
    const releaseYearId = findSubId("C8", (s) => {
      const desc = s.description.toLowerCase();
      if ((desc.includes("2020") || desc.includes("< 2021")) && year <= 2020) return true;
      if (desc.includes("2021") && !desc.includes("<") && year === 2021) return true;
      if (desc.includes("2022") && year === 2022) return true;
      if (desc.includes("2023") && year === 2023) return true;
      if ((desc.includes("2024") || desc.includes(">= 2024")) && year >= 2024) return true;
      return false;
    });
    if (releaseYearId) ids.push(releaseYearId);

    return ids;
  } catch (e) {
    console.error("Auto mapping failed:", e);
    return [];
  }
}
