import { Leaderboard } from "@/interfaces/leaderboard";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LEADERBOARD_KEYS } from "@/constants/queryKeys";
import { toast } from "react-toastify";

export const useNewRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Leaderboard>) => {
      const existing = await api.leaderboard.getLeaderboards();
      const nextId = (existing.data.length + 1).toString();

      const now = new Date().toISOString().split("T")[0];
      const payload = {
        ...data,
        id: nextId,
        createdAt: now,
        updatedAt: now,
      };

      const res = await api.leaderboard.createLeaderboard(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEYS.all });
      toast.success("Leaderboard created successfully");
    },
    onError: () => {
      toast.error("Failed to create leaderboard");
    },
  });
};

export const useUpdateRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Leaderboard> }) =>
      api.leaderboard.updateLeaderboard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_KEYS.all });
      toast.success("Leaderboard updated successfully");
    },
    onError: () => {
      toast.error("Failed to update leaderboard");
    },
  });
};
