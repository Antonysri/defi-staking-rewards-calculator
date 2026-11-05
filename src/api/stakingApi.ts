import axios from 'axios';
import { BASE_URL } from '../config/config';
import {
  StakingCalculationRequest,
  StakingCalculationData,
  ApiResponse,
} from '../components/StakingCalculator/types';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Call backend to calculate staking rewards and time-series projection
 */
export async function calculateStakingRewardsApi(
  params: StakingCalculationRequest
): Promise<StakingCalculationData> {
  try {
    const response = await apiClient.post<ApiResponse<StakingCalculationData>>(
      '/api/calculate-rewards',
      params
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || 'Failed to calculate staking rewards.');
  } catch (error: any) {
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      throw new Error(error.response.data.errors.join(' '));
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Network error occurred while connecting to calculation server.');
  }
}
