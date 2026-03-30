import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { LeaderboardParams } from "@/services/api/leaderboard";
import { cleanParams } from "@/utils/helpers";
import { LEADERBOARD_KEYS } from "@/constants/queryKeys";

export const useLeaderboardData = (params: LeaderboardParams) => {
  return useQuery({
    queryKey: LEADERBOARD_KEYS.list(params),
    queryFn: async () => {
      const res = await api.leaderboard.getLeaderboards(cleanParams(params));

      return {
        data: res.data,
        total: Number(res.headers["x-total-count"]),
      };
    },
    retry: false,
  });
};
