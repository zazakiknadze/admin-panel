import { RAFFLE_KEYS } from "@/constants/queryKeys";
import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useDeleteRowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.raffle.deleteRaffle(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RAFFLE_KEYS.all });
      toast.success("Raffle deleted successfully");
    },

    onError: (error: AxiosError) => {
      console.error("Delete Error:", error);
      toast.error("Failed to delete the raffle. Please try again.");
    },
  });
};
