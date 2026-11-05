import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from './types';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import TollRoundedIcon from '@mui/icons-material/TollRounded';

interface GrowthChartProps {
  data: TimeSeriesPoint[];
  hasUsd: boolean;
}

const CustomTooltip = ({ active, payload, isUsd }: any) => {
  if (active && payload && payload.length) {
    const point: TimeSeriesPoint = payload[0].payload;
    return (
      <Paper
        elevation={0}
        sx={{
          padding: '12px 16px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #334155',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            mb: 0.5,
          }}
        >
          {point.timeLabel} · Day {point.day}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#E2E8F0', fontSize: '13px' }}>
              Balance:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#38BDF8', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}
            >
              {isUsd && point.balanceUsd !== undefined
                ? `$${point.balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : `${point.balance.toLocaleString()} TOKENS`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#E2E8F0', fontSize: '13px' }}>
              Rewards:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: '#34D399', fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}
            >
              {isUsd && point.rewardsEarnedUsd !== undefined
                ? `+$${point.rewardsEarnedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : `+${point.rewardsEarned.toLocaleString()} TOKENS`}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }
  return null;
};

const GrowthChart: React.FC<GrowthChartProps> = ({ data, hasUsd }) => {
  const [viewMode, setViewMode] = useState<'tokens' | 'usd'>('tokens');

  const isUsd = hasUsd && viewMode === 'usd';
  const dataKey = isUsd ? 'balanceUsd' : 'balance';

  return (
    <Box
      sx={{
        width: '100%',
        p: '20px',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShowChartRoundedIcon sx={{ color: '#2563EB', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Projected Growth Trajectory
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Compound yield simulation over duration
            </Typography>
          </Box>
        </Box>

        {hasUsd && (
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            sx={{
              backgroundColor: '#F1F5F9',
              borderRadius: '8px',
              p: '2px',
              border: 'none',
              '& .MuiToggleButton-root': {
                border: 'none',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '12px',
                py: '4px',
                px: '12px',
                borderRadius: '6px',
                color: '#64748B',
                '&.Mui-selected': {
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                  '&:hover': { backgroundColor: '#FFFFFF' },
                },
              },
            }}
          >
            <ToggleButton value="tokens">
              <TollRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} /> Tokens
            </ToggleButton>
            <ToggleButton value="usd">
              <AttachMoneyRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} /> USD Value
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fintechGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#0284C7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={500}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={500}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={(value) =>
                isUsd ? `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}` : value
              }
            />
            <Tooltip content={<CustomTooltip isUsd={isUsd} />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#0284C7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#fintechGradient)"
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default GrowthChart;
