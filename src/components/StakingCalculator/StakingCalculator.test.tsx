import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StakingCalculator from './StakingCalculator';
import * as stakingApi from '../../api/stakingApi';

// Mock the API layer
jest.mock('../../api/stakingApi');

const mockCalculatedData = {
  principal: 1000,
  apy: 5,
  effectiveApy: 5.1267,
  totalReturnPercent: 5.1267,
  duration: 365,
  durationUnit: 'days' as const,
  durationYears: 1,
  durationDays: 365,
  compoundingFrequency: 'daily' as const,
  compoundingPeriodsPerYear: 365,
  projectedFinalBalance: 1051.27,
  totalRewardsEarned: 51.27,
  tokenPriceUsd: 1.5,
  initialInvestmentUsd: 1500,
  projectedFinalBalanceUsd: 1576.91,
  totalRewardsEarnedUsd: 76.91,
  timeSeries: [
    {
      step: 0,
      day: 0,
      year: 0,
      timeLabel: 'Day 0',
      balance: 1000,
      rewardsEarned: 0,
      balanceUsd: 1500,
      rewardsEarnedUsd: 0,
    },
    {
      step: 1,
      day: 365,
      year: 1,
      timeLabel: 'Day 365',
      balance: 1051.27,
      rewardsEarned: 51.27,
      balanceUsd: 1576.91,
      rewardsEarnedUsd: 76.91,
    },
  ],
};

describe('StakingCalculator Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (stakingApi.calculateStakingRewardsApi as jest.Mock).mockResolvedValue(mockCalculatedData);
  });

  test('renders calculator inputs correctly with default values', async () => {
    render(<StakingCalculator />);

    expect(screen.getByText(/Staking Rewards Calculator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Principal Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Percentage Yield \(APY\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Staking Duration/i)).toBeInTheDocument();

    const calculateBtn = await screen.findByRole('button', { name: /Calculate Rewards/i });
    expect(calculateBtn).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Final Projected Balance/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Rewards Earned/i)).toBeInTheDocument();
    });
  });

  test('displays validation errors on invalid inputs', async () => {
    render(<StakingCalculator />);

    const calculateBtn = await screen.findByRole('button', { name: /Calculate Rewards/i });
    const principalInput = screen.getByLabelText(/Principal Amount/i);

    fireEvent.change(principalInput, { target: { value: '-50' } });
    fireEvent.click(calculateBtn);

    const errorMsg = await screen.findByText(/Principal must be greater than 0/i);
    expect(errorMsg).toBeInTheDocument();
  });

  test('displays API calculation results and summary cards upon calculation', async () => {
    render(<StakingCalculator />);

    expect(await screen.findByText(/Final Projected Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Rewards Earned/i)).toBeInTheDocument();
    expect(screen.getByText(/Effective APY/i)).toBeInTheDocument();
    expect(screen.getAllByText(/5\.13%/i).length).toBeGreaterThanOrEqual(1);
  });

  test('handles API errors gracefully with an Alert component', async () => {
    (stakingApi.calculateStakingRewardsApi as jest.Mock).mockRejectedValue(
      new Error('Failed to connect to backend server.')
    );

    render(<StakingCalculator />);

    const alertTitle = await screen.findByText(/Calculation Error/i);
    expect(alertTitle).toBeInTheDocument();
    expect(screen.getByText(/Failed to connect to backend server/i)).toBeInTheDocument();
  });
});
