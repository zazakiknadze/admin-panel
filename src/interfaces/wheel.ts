export interface Wheel {
  id: string;
  name: string;
  description: string;
  status: WheelStatus;
  segments: WheelSegment[];
  maxSpinsPerUser: number;
  spinCost: number;
  backgroundColor: string;
  borderColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  prizeType: WheelSegmentPrizeType;
  prizeAmount: number;
  imageUrl: string;
}

export enum WheelStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum WheelSegmentPrizeType {
  COINS = "coins",
  FREE_SPIN = "freeSpin",
  BONUS = "bonus",
  NOTHING = "nothing",
}
