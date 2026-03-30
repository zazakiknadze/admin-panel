import { WHEEL_KEYS } from "@/constants/queryKeys";
import { Wheel } from "@/interfaces/wheel";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useNewRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Wheel>) => {
      const existing = await api.wheel.getWheels();
      const nextId = (existing.data.length + 1).toString();

      const now = new Date().toISOString().split("T")[0];
      const payload = {
        ...data,
        id: nextId,
        createdAt: now,
        updatedAt: now,
      };

      const res = await api.wheel.createWheel(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHEEL_KEYS.all });
      toast.success("Wheel created successfully");
    },
    onError: () => {
      toast.error("Failed to create wheel");
    },
  });
};

export const useUpdateRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Wheel> }) =>
      api.wheel.updateWheel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHEEL_KEYS.all });
      toast.success("Wheel updated successfully");
    },
    onError: () => {
      toast.error("Failed to update wheel");
    },
  });
};
