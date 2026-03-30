import { Raffle } from "@/interfaces/raffle";
import { del, get, post, put } from "@/services/api/axios";

export type RaffleParams = {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: "asc" | "desc";
  status?: string;
  startDate_gte?: string;
  endDate_lte?: string;
};

export default {
  getRaffles: (params?: RaffleParams) => get("/raffles", { params }),

  getRaffleById: (id: string) => get(`/raffles/${id}`),

  createRaffle: (data: Partial<Raffle>) => post("/raffles", data),

  updateRaffle: (id: string, data: Partial<Raffle>) =>
    put(`/raffles/${id}`, data),

  deleteRaffle: (id: string) => del(`/raffles/${id}`),
};
