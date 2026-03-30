import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { WHEEL_KEYS } from "@/constants/queryKeys";

export const useWheelDetails = (id: string) => {
  return useQuery({
    queryKey: WHEEL_KEYS.detail(id),
    queryFn: async () => {
      const res = await api.wheel.getWheelById(id);
      return res.data;
    },
    retry: false,
    enabled: !!id,
  });
};
