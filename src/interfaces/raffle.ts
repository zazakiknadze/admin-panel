export interface Raffle {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: RaffleStatus;
  ticketPrice: number;
  maxTicketsPerUser: number;
  prizes: RafflePrize[];
  totalTicketLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RafflePrize {
  id: string;
  name: string;
  type: RafflePrizeType;
  amount: number;
  quantity: number;
  imageUrl: string;
}

export enum RaffleStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DRAWN = "drawn",
  CANCELLED = "cancelled",
}

export enum RafflePrizeType {
  COINS = "coins",
  FREE_SPIN = "freeSpin",
  BONUS = "bonus",
}
