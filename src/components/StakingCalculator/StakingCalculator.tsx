import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Divider,
  Skeleton,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  StakingCalculationData,
  DurationUnit,
  CompoundingFrequency,
  StakingCalculationRequest,
} from './types';
import CalculatorForm from './CalculatorForm';
import SummaryCards from './SummaryCards';
import GrowthChart from './GrowthChart';
import { calculateStakingRewardsApi } from '../../api/stakingApi';

const DEFAULT_FORM = {
  principal: '1000',
  apy: '5.0',
  duration: '365',
  durationUnit: 'days' as DurationUnit,
  compoundingFrequency: 'daily' as CompoundingFrequency,
  tokenPrice: '1.50',
};

const StakingCalculator: React.FC = () => {
  const [formValues, setFormValues] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<StakingCalculationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const principalNum = parseFloat(formValues.principal);
    if (!formValues.principal || isNaN(principalNum)) {
      newErrors.principal = 'Please enter a valid principal amount.';
    } else if (principalNum <= 0) {
      newErrors.principal = 'Principal must be greater than 0.';
    }

    const apyNum = parseFloat(formValues.apy);
    if (formValues.apy === '' || isNaN(apyNum)) {
      newErrors.apy = 'Please enter a valid APY.';
    } else if (apyNum < 0) {
      newErrors.apy = 'APY cannot be negative.';
    } else if (apyNum > 10000) {
      newErrors.apy = 'APY cannot exceed 10,000%.';
    }

    const durationNum = parseFloat(formValues.duration);
    if (!formValues.duration || isNaN(durationNum)) {
      newErrors.duration = 'Please enter a valid duration.';
    } else if (durationNum <= 0) {
      newErrors.duration = 'Duration must be greater than 0.';
    }

    if (formValues.tokenPrice !== '') {
      const priceNum = parseFloat(formValues.tokenPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.tokenPrice = 'Token price must be a non-negative number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues]);

  const executeCalculation = useCallback(async () => {
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const payload: StakingCalculationRequest = {
        principal: parseFloat(formValues.principal),
        apy: parseFloat(formValues.apy),
        duration: parseFloat(formValues.duration),
        durationUnit: formValues.durationUnit,
        compoundingFrequency: formValues.compoundingFrequency,
        tokenPrice: formValues.tokenPrice ? parseFloat(formValues.tokenPrice) : null,
      };

      const result = await calculateStakingRewardsApi(payload);
      setData(result);
    } catch (err: any) {
      setApiError(err.message || 'Failed to fetch calculation results from backend.');
    } finally {
      setIsLoading(false);
    }
  }, [formValues, validate]);

  // Initial calculation on mount
  useEffect(() => {
    executeCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleReset = () => {
    setFormValues(DEFAULT_FORM);
    setErrors({});
    setApiError(null);
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '2px solid #00dbe3',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 219, 227, 0.08)',
        mb: 4,
      }}
    >
      {/* Header bar matching DeFi design */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #173039 0%, #1e4552 60%, #00b4c9 100%)',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccountBalanceIcon sx={{ color: '#00dbe3', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, lineHeight: 1.2 }}>
              Staking Rewards Calculator
            </Typography>
            <Typography variant="caption" sx={{ color: '#9FF1D2' }}>
              Compound yield simulation & mathematical projection engine
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            backgroundColor: 'rgba(0, 219, 227, 0.15)',
            color: '#00dbe3',
            border: '1px solid rgba(0, 219, 227, 0.4)',
            px: 1.5,
            py: 0.5,
            borderRadius: '20px',
            fontWeight: 600,
          }}
        >
          REST API Integrated
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Error Alert State */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            <AlertTitle>Calculation Error</AlertTitle>
            {apiError}
          </Alert>
        )}

        {/* Input Parameters Form */}
        <CalculatorForm
          formValues={formValues}
          errors={errors}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={executeCalculation}
          onReset={handleReset}
        />

        <Divider sx={{ my: 3.5, borderColor: '#e2e8f0' }} />

        {/* Loading Skeleton State */}
        {isLoading && !data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '12px' }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px' }} />
          </Box>
        )}

        {/* Success Output State */}
        {data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* KPI Summary Cards */}
            <SummaryCards data={data} />

            {/* Interactive Time-series Chart */}
            <GrowthChart
              data={data.timeSeries}
              hasUsd={Boolean(data.tokenPriceUsd && data.tokenPriceUsd > 0)}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StakingCalculator;
