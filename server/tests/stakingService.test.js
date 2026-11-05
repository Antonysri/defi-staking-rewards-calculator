const {
  calculateBalanceAtTime,
  calculateStakingRewards,
  normalizeDuration,
  generateGrowthTimeSeries,
  COMPOUNDING_PERIODS,
} = require('../services/stakingService');

describe('Staking Calculation Service - Mathematical Reasoning Engine', () => {
  describe('normalizeDuration', () => {
    test('normalizes days correctly', () => {
      const { durationYears, durationDays } = normalizeDuration(365, 'days');
      expect(durationYears).toBeCloseTo(1.0, 5);
      expect(durationDays).toBe(365);
    });

    test('normalizes months correctly', () => {
      const { durationYears, durationDays } = normalizeDuration(18, 'months');
      expect(durationYears).toBeCloseTo(1.5, 5);
      expect(durationDays).toBeCloseTo(547.5, 1);
    });

    test('normalizes fractional years correctly', () => {
      const { durationYears, durationDays } = normalizeDuration(1.5, 'years');
      expect(durationYears).toBe(1.5);
      expect(durationDays).toBeCloseTo(547.5, 1);
    });

    test('defaults to days when unit is omitted or unknown', () => {
      const { durationYears, durationDays } = normalizeDuration(730);
      expect(durationYears).toBeCloseTo(2.0, 5);
      expect(durationDays).toBe(730);
    });
  });

  describe('calculateBalanceAtTime - Compound Interest Formula: A = P(1 + r/n)^(nt)', () => {
    test('computes annual compounding correctly (n = 1)', () => {
      // P = 1000, r = 10% (0.10), n = 1, t = 2 years
      // A = 1000 * (1 + 0.10)^2 = 1210
      const balance = calculateBalanceAtTime(1000, 0.10, 1, 2);
      expect(balance).toBeCloseTo(1210.0, 4);
    });

    test('computes daily compounding correctly (n = 365)', () => {
      // P = 1000, r = 5% (0.05), n = 365, t = 1 year
      // A = 1000 * (1 + 0.05/365)^365 ≈ 1051.267
      const balance = calculateBalanceAtTime(1000, 0.05, 365, 1);
      expect(balance).toBeCloseTo(1051.267496, 4);
    });

    test('computes weekly compounding correctly (n = 52)', () => {
      // P = 1000, r = 10% (0.10), n = 52, t = 1 year
      // A = 1000 * (1 + 0.10/52)^52 ≈ 1105.064
      const balance = calculateBalanceAtTime(1000, 0.10, 52, 1);
      expect(balance).toBeCloseTo(1105.064, 2);
    });

    test('computes monthly compounding correctly (n = 12)', () => {
      // P = 1000, r = 12% (0.12), n = 12, t = 1 year
      // A = 1000 * (1 + 0.12/12)^12 = 1000 * (1.01)^12 ≈ 1126.825
      const balance = calculateBalanceAtTime(1000, 0.12, 12, 1);
      expect(balance).toBeCloseTo(1126.825, 2);
    });

    test('handles fractional durations (1.5 years)', () => {
      // P = 2000, r = 8% (0.08), n = 12, t = 1.5 years
      // nt = 12 * 1.5 = 18 periods
      // A = 2000 * (1 + 0.08/12)^18 ≈ 2254.096
      const balance = calculateBalanceAtTime(2000, 0.08, 12, 1.5);
      expect(balance).toBeCloseTo(2254.096, 2);
    });

    test('handles edge case: zero APY (r = 0)', () => {
      const balance = calculateBalanceAtTime(5000, 0, 365, 3);
      expect(balance).toBe(5000);
    });

    test('handles edge case: zero duration (t = 0)', () => {
      const balance = calculateBalanceAtTime(5000, 0.15, 365, 0);
      expect(balance).toBe(5000);
    });

    test('handles edge case: zero principal (P = 0)', () => {
      const balance = calculateBalanceAtTime(0, 0.15, 365, 1);
      expect(balance).toBe(0);
    });
  });

  describe('calculateStakingRewards - Full Calculation & Projections', () => {
    test('calculates standard DeFi staking scenario with daily compounding', () => {
      const result = calculateStakingRewards({
        principal: 1000,
        apy: 5,
        duration: 365,
        durationUnit: 'days',
        compoundingFrequency: 'daily',
      });

      expect(result.principal).toBe(1000);
      expect(result.apy).toBe(5);
      expect(result.duration).toBe(365);
      expect(result.durationUnit).toBe('days');
      expect(result.compoundingFrequency).toBe('daily');
      expect(result.compoundingPeriodsPerYear).toBe(365);

      // Final balance ≈ 1051.27
      expect(result.projectedFinalBalance).toBeCloseTo(1051.267, 2);
      expect(result.totalRewardsEarned).toBeCloseTo(51.267, 2);
      expect(result.totalReturnPercent).toBeCloseTo(5.1267, 2);

      // Time series array must be generated
      expect(Array.isArray(result.timeSeries)).toBe(true);
      expect(result.timeSeries.length).toBeGreaterThan(10);
      expect(result.timeSeries[0].balance).toBe(1000);
      expect(result.timeSeries[result.timeSeries.length - 1].balance).toBeCloseTo(1051.267, 2);
    });

    test('calculates with optional token price for USD valuations', () => {
      const result = calculateStakingRewards({
        principal: 50,
        apy: 12,
        duration: 1,
        durationUnit: 'years',
        compoundingFrequency: 'monthly',
        tokenPrice: 150.50, // e.g. $150.50 per SOL / ETH
      });

      expect(result.tokenPriceUsd).toBe(150.50);
      expect(result.initialInvestmentUsd).toBe(50 * 150.50);
      expect(result.projectedFinalBalanceUsd).toBeCloseTo(result.projectedFinalBalance * 150.50, 1);
      expect(result.totalRewardsEarnedUsd).toBeCloseTo(result.totalRewardsEarned * 150.50, 1);

      // Time series points should also contain USD values
      expect(result.timeSeries[0].balanceUsd).toBe(50 * 150.50);
      expect(result.timeSeries[result.timeSeries.length - 1].balanceUsd).toBeDefined();
    });

    test('correctly computes effective APY', () => {
      // Nominal rate 10% compounded daily: Effective APY = (1 + 0.10/365)^365 - 1 ≈ 10.5156%
      const result = calculateStakingRewards({
        principal: 1000,
        apy: 10,
        duration: 1,
        durationUnit: 'years',
        compoundingFrequency: 'daily',
      });

      expect(result.effectiveApy).toBeCloseTo(10.5156, 3);
    });

    test('monotonically increasing balance over time-series', () => {
      const result = calculateStakingRewards({
        principal: 1000,
        apy: 8,
        duration: 180,
        durationUnit: 'days',
        compoundingFrequency: 'daily',
      });

      for (let i = 1; i < result.timeSeries.length; i++) {
        expect(result.timeSeries[i].balance).toBeGreaterThanOrEqual(result.timeSeries[i - 1].balance);
        expect(result.timeSeries[i].rewardsEarned).toBeGreaterThanOrEqual(result.timeSeries[i - 1].rewardsEarned);
      }
    });
  });
});
