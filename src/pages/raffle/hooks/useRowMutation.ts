import { Raffle } from "@/interfaces/raffle";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RAFFLE_KEYS } from "@/constants/queryKeys";
import { toast } from "react-toastify";

export const useNewRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Raffle>) => {
      const existing = await api.raffle.getRaffles();
      const nextId = (existing.data.length + 1).toString();

      const now = new Date().toISOString().split("T")[0];
      const payload = {
        ...data,
        id: nextId,
        createdAt: now,
        updatedAt: now,
      };

      const res = await api.raffle.createRaffle(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_KEYS.all });
      toast.success("Raffle created successfully");
    },
    onError: () => {
      toast.error("Failed to create raffle");
    },
  });
};

export const useUpdateRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Raffle> }) =>
      api.raffle.updateRaffle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_KEYS.all });
      toast.success("Raffle updated successfully");
    },
    onError: () => {
      toast.error("Failed to update raffle");
    },
  });
};
