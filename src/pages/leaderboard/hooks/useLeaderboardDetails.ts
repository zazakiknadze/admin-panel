import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { LEADERBOARD_KEYS } from "@/constants/queryKeys";

export const useLeaderboardDetails = (id: string) => {
  return useQuery({
    queryKey: LEADERBOARD_KEYS.detail(id),
    queryFn: async () => {
      const res = await api.leaderboard.getLeaderboardById(id);
      return res.data;
    },
    retry: false,
    enabled: !!id,
  });
};
