import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { cleanParams } from "@/utils/helpers";
import { WheelParams } from "@/services/api/wheel";
import { WHEEL_KEYS } from "@/constants/queryKeys";

export const useWheelData = (params: WheelParams) => {
  return useQuery({
    queryKey: WHEEL_KEYS.list(params),
    queryFn: async () => {
      const res = await api.wheel.getWheels(cleanParams(params));

      return {
        data: res.data,
        total: Number(res.headers["x-total-count"]),
      };
    },
    retry: false,
  });
};
