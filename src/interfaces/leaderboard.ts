export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: LeaderboardStatus;
  scoringType: LeaderboardScoringType;
  prizes: LeaderboardPrize[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: LeaderboardPrizeType;
  amount: number;
  imageUrl: string;
}

export enum LeaderboardStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export enum LeaderboardScoringType {
  POINTS = "points",
  WINS = "wins",
  WAGERED = "wagered",
}

export enum LeaderboardPrizeType {
  COINS = "coins",
  FREE_SPIN = "freeSpin",
  BONUS = "bonus",
}
