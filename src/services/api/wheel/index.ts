import { Wheel } from "@/interfaces/wheel";
import { del, get, post, put } from "@/services/api/axios";

export type WheelParams = {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
  status?: string;
};

export default {
  getWheels: (params?: WheelParams) => get("/wheels", { params }),

  getWheelById: (id: string) => get(`/wheels/${id}`),

  createWheel: (data: Partial<Wheel>) => post("/wheels", data),

  updateWheel: (id: string, data: Partial<Wheel>) => put(`/wheels/${id}`, data),

  deleteWheel: (id: string) => del(`/wheels/${id}`),
};
