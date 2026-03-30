import { Leaderboard } from "@/interfaces/leaderboard";
import { del, get, post, put } from "@/services/api/axios";

export type LeaderboardParams = {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
  status?: string;
};

export default {
  getLeaderboards: (params?: LeaderboardParams) =>
    get("/leaderboards", { params }),

  getLeaderboardById: (id: string) => get(`/leaderboards/${id}`),

  createLeaderboard: (data: Partial<Leaderboard>) =>
    post("/leaderboards", data),

  updateLeaderboard: (id: string, data: Partial<Leaderboard>) =>
    put(`/leaderboards/${id}`, data),

  deleteLeaderboard: (id: string) => del(`/leaderboards/${id}`),
};
