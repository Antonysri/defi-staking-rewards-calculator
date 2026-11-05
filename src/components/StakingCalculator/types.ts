export type DurationUnit = 'days' | 'months' | 'years';
export type CompoundingFrequency = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface StakingCalculationRequest {
  principal: number;
  apy: number;
  duration: number;
  durationUnit: DurationUnit;
  compoundingFrequency: CompoundingFrequency;
  tokenPrice?: number | null;
}

export interface TimeSeriesPoint {
  step: number;
  day: number;
  year: number;
  timeLabel: string;
  balance: number;
  rewardsEarned: number;
  balanceUsd?: number;
  rewardsEarnedUsd?: number;
}

export interface StakingCalculationData {
  principal: number;
  apy: number;
  effectiveApy: number;
  totalReturnPercent: number;
  duration: number;
  durationUnit: DurationUnit;
  durationYears: number;
  durationDays: number;
  compoundingFrequency: CompoundingFrequency;
  compoundingPeriodsPerYear: number;
  projectedFinalBalance: number;
  totalRewardsEarned: number;
  tokenPriceUsd?: number;
  initialInvestmentUsd?: number;
  projectedFinalBalanceUsd?: number;
  totalRewardsEarnedUsd?: number;
  timeSeries: TimeSeriesPoint[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
