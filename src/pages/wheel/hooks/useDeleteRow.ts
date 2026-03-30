import { WHEEL_KEYS } from "@/constants/queryKeys";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useDeleteRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.wheel.deleteWheel(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WHEEL_KEYS.all });
      toast.success("Wheel deleted successfully");
    },

    onError: (error: AxiosError) => {
      console.error("Delete Error:", error);
      toast.error("Failed to delete the wheel. Please try again.");
    },
  });
};
