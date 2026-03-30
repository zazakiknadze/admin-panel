import { WheelParams } from "@/services/api/wheel";
import { LeaderboardParams } from "@/services/api/leaderboard";
import { RaffleParams } from "@/services/api/raffle";

export const WHEEL_KEYS = {
  all: ["wheels"] as const,
  list: (params: WheelParams) => [...WHEEL_KEYS.all, "list", params] as const,
  detail: (id: string | undefined) =>
    [...WHEEL_KEYS.all, "detail", id] as const,
};

export const LEADERBOARD_KEYS = {
  all: ["leaderboards"] as const,
  list: (params: LeaderboardParams) =>
    [...LEADERBOARD_KEYS.all, "list", params] as const,
  detail: (id: string | undefined) =>
    [...LEADERBOARD_KEYS.all, "detail", id] as const,
};

export const RAFFLE_KEYS = {
  all: ["raffles"] as const,
  list: (params: RaffleParams) => [...RAFFLE_KEYS.all, "list", params] as const,
  detail: (id: string | undefined) =>
    [...RAFFLE_KEYS.all, "detail", id] as const,
};
