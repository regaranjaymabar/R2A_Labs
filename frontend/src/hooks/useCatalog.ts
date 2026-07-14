import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../pages/services/catalog.service";

export function useCatalog(search?: string) {
  return useQuery({
    queryKey: ["catalog", search],
    queryFn: () => catalogService.getCatalog(search),
  });
}