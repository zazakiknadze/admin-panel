import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { cleanParams } from "@/utils/helpers";
import { RaffleParams } from "@/services/api/raffle";
import { RAFFLE_KEYS } from "@/constants/queryKeys";

export const useRaffleData = (params: RaffleParams) => {
  return useQuery({
    queryKey: RAFFLE_KEYS.list(params),
    queryFn: async () => {
      const res = await api.raffle.getRaffles(cleanParams(params));

      return {
        data: res.data,
        total: Number(res.headers["x-total-count"]),
      };
    },
    retry: false,
  });
};
