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
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
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
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      {/* Clean Top Header Bar */}
      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 2.5,
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalculateRoundedIcon sx={{ color: '#0F172A', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>
              Staking Rewards Calculator
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '12px' }}>
              Compound interest projection engine with customizable duration & frequencies
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.8,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            px: 1.5,
            py: 0.5,
            borderRadius: '20px',
          }}
        >
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981' }} />
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontSize: '11px' }}>
            REST API Connected
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Error Alert */}
        {apiError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '10px',
              border: '1px solid #FECDD3',
              backgroundColor: '#FFF1F2',
              color: '#9F1239',
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Calculation Error</AlertTitle>
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

        <Divider sx={{ my: 3.5, borderColor: '#F1F5F9' }} />

        {/* Loading State Skeleton */}
        {isLoading && !data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '12px' }} />
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '12px' }} />
          </Box>
        )}

        {/* Results State */}
        {data && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Summary KPI Cards */}
            <SummaryCards data={data} />

            {/* Growth Curve Chart */}
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
