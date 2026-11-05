import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { StakingCalculationData } from './types';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

interface SummaryCardsProps {
  data: StakingCalculationData;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const hasUsd = Boolean(data.tokenPriceUsd && data.tokenPriceUsd > 0);
  const apyDelta = +(data.effectiveApy - data.apy).toFixed(2);

  return (
    <Grid container spacing={2}>
      {/* 1. Projected Final Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
            height: '100%',
            '&:hover': {
              borderColor: '#CBD5E1',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.06)',
            },
          }}
        >
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                Final Projected Balance
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletRoundedIcon sx={{ color: '#0F172A', fontSize: 18 }} />
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '22px',
                lineHeight: 1.2,
              }}
            >
              {data.projectedFinalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {hasUsd && data.projectedFinalBalanceUsd !== undefined ? (
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, fontSize: '12px' }}>
                  ≈ ${data.projectedFinalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, fontSize: '12px' }}>
                  Initial: {data.principal.toLocaleString()} TOKENS
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. Total Rewards Earned */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: '1px solid #A7F3D0',
            backgroundColor: '#F0FDF4',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 3px 0 rgba(16, 185, 129, 0.05)',
            height: '100%',
            '&:hover': {
              borderColor: '#6EE7B7',
              boxShadow: '0 4px 12px -2px rgba(16, 185, 129, 0.12)',
            },
          }}
        >
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#047857', fontWeight: 600, fontSize: '13px' }}>
                Total Rewards Earned
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ color: '#059669', fontSize: 18 }} />
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#047857',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '22px',
                lineHeight: 1.2,
              }}
            >
              +{data.totalRewardsEarned.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              {hasUsd && data.totalRewardsEarnedUsd !== undefined ? (
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>
                  +${data.totalRewardsEarnedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}>
                  Yield on {data.principal.toLocaleString()} staked
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 3. Effective APY */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
            height: '100%',
            '&:hover': {
              borderColor: '#CBD5E1',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.06)',
            },
          }}
        >
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                Effective APY
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PercentRoundedIcon sx={{ color: '#2563EB', fontSize: 18 }} />
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '22px',
                lineHeight: 1.2,
              }}
            >
              {data.effectiveApy.toFixed(2)}%
            </Typography>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1, fontSize: '12px' }}>
              Nominal {data.apy}% · {data.compoundingFrequency}
              {apyDelta > 0 ? ` (+${apyDelta}%)` : ''}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 4. Total Yield Return */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.03)',
            height: '100%',
            '&:hover': {
              borderColor: '#CBD5E1',
              boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.06)',
            },
          }}
        >
          <CardContent sx={{ p: '20px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '13px' }}>
                Total Yield Return
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpRoundedIcon sx={{ color: '#059669', fontSize: 18 }} />
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#059669',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '22px',
                lineHeight: 1.2,
              }}
            >
              +{data.totalReturnPercent.toFixed(2)}%
            </Typography>

            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1, fontSize: '12px' }}>
              Over {data.duration} {data.durationUnit} ({data.durationDays}d)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
