import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { RAFFLE_KEYS } from "@/constants/queryKeys";

export const useRaffleDetails = (id: string) => {
  return useQuery({
    queryKey: RAFFLE_KEYS.detail(id),
    queryFn: async () => {
      const res = await api.raffle.getRaffleById(id);
      return res.data;
    },
    retry: false,
    enabled: !!id,
  });
};
