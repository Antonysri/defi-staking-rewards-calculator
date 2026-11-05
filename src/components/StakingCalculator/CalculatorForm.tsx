import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';
import { DurationUnit, CompoundingFrequency } from './types';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

interface CalculatorFormProps {
  formValues: {
    principal: string;
    apy: string;
    duration: string;
    durationUnit: DurationUnit;
    compoundingFrequency: CompoundingFrequency;
    tokenPrice: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onReset: () => void;
}

const DURATION_PRESETS = [
  { label: '30D', duration: '30', unit: 'days' as DurationUnit },
  { label: '90D', duration: '90', unit: 'days' as DurationUnit },
  { label: '180D', duration: '180', unit: 'days' as DurationUnit },
  { label: '1Y', duration: '1', unit: 'years' as DurationUnit },
  { label: '2Y', duration: '2', unit: 'years' as DurationUnit },
];

const APY_PRESETS = ['5', '8', '12', '16'];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.15s ease-in-out',
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0F172A',
      borderWidth: '1.5px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748B',
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#0F172A',
      fontWeight: 600,
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '11px',
    mt: 0.5,
  },
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  formValues,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2.5}>
        {/* Principal Amount */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Principal Amount"
            placeholder="1000"
            value={formValues.principal}
            onChange={(e) => onInputChange('principal', e.target.value)}
            error={Boolean(errors.principal)}
            helperText={errors.principal || 'Initial token amount to stake'}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#0F172A',
                      backgroundColor: '#E2E8F0',
                      px: 1,
                      py: 0.3,
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  >
                    TOKENS
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* APY */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Annual Percentage Yield (APY)"
            placeholder="5.0"
            value={formValues.apy}
            onChange={(e) => onInputChange('apy', e.target.value)}
            error={Boolean(errors.apy)}
            helperText={errors.apy || 'Nominal annual yield rate (%)'}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B' }}>
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
          {/* Quick APY pills */}
          <Box sx={{ display: 'flex', gap: 0.8, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '11px', fontWeight: 500 }}>
              Quick APY:
            </Typography>
            {APY_PRESETS.map((preset) => {
              const isActive = formValues.apy === preset;
              return (
                <Chip
                  key={preset}
                  label={`${preset}%`}
                  size="small"
                  clickable
                  onClick={() => onInputChange('apy', preset)}
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    backgroundColor: isActive ? '#0F172A' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: '1px solid',
                    borderColor: isActive ? '#0F172A' : '#E2E8F0',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#1E293B' : '#E2E8F0',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Grid>

        {/* Duration & Unit */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              sx={{ ...inputSx, flex: 2 }}
              label="Staking Duration"
              placeholder="365"
              value={formValues.duration}
              onChange={(e) => onInputChange('duration', e.target.value)}
              error={Boolean(errors.duration)}
              helperText={errors.duration}
            />
            <TextField
              select
              sx={{ ...inputSx, flex: 1.2 }}
              label="Unit"
              value={formValues.durationUnit}
              onChange={(e) => onInputChange('durationUnit', e.target.value)}
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="months">Months</MenuItem>
              <MenuItem value="years">Years</MenuItem>
            </TextField>
          </Box>
          {/* Quick Duration pills */}
          <Box sx={{ display: 'flex', gap: 0.8, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '11px', fontWeight: 500 }}>
              Quick Presets:
            </Typography>
            {DURATION_PRESETS.map((p) => {
              const isActive = formValues.duration === p.duration && formValues.durationUnit === p.unit;
              return (
                <Chip
                  key={p.label}
                  label={p.label}
                  size="small"
                  clickable
                  onClick={() => {
                    onInputChange('duration', p.duration);
                    onInputChange('durationUnit', p.unit);
                  }}
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    backgroundColor: isActive ? '#0F172A' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: '1px solid',
                    borderColor: isActive ? '#0F172A' : '#E2E8F0',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#1E293B' : '#E2E8F0',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Grid>

        {/* Compounding Frequency */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Compounding Frequency"
            value={formValues.compoundingFrequency}
            onChange={(e) => onInputChange('compoundingFrequency', e.target.value)}
            helperText="Periods per year compound rewards are reinvested"
            sx={inputSx}
          >
            <MenuItem value="daily">Daily (365/yr - Highest yield)</MenuItem>
            <MenuItem value="weekly">Weekly (52/yr)</MenuItem>
            <MenuItem value="monthly">Monthly (12/yr)</MenuItem>
            <MenuItem value="annually">Annually (1/yr)</MenuItem>
          </TextField>
        </Grid>

        {/* Optional Token Price */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Optional Token Price (USD)"
            placeholder="1.50"
            value={formValues.tokenPrice}
            onChange={(e) => onInputChange('tokenPrice', e.target.value)}
            error={Boolean(errors.tokenPrice)}
            helperText={errors.tokenPrice || 'Enable USD portfolio conversion'}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B' }}>
                    $
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Actions */}
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: { sm: 0.5 } }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={16} color="inherit" /> : <BoltRoundedIcon sx={{ fontSize: 18 }} />
            }
            sx={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontWeight: 600,
              px: 3,
              py: '10px',
              borderRadius: '9px',
              textTransform: 'none',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#1E293B',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
              },
            }}
          >
            {isLoading ? 'Calculating...' : 'Calculate Rewards'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={onReset}
            disabled={isLoading}
            startIcon={<RestartAltRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: '#E2E8F0',
              color: '#64748B',
              fontWeight: 600,
              py: '10px',
              px: 2,
              borderRadius: '9px',
              textTransform: 'none',
              fontSize: '13px',
              '&:hover': {
                borderColor: '#CBD5E1',
                backgroundColor: '#F8FAFC',
                color: '#0F172A',
              },
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalculatorForm;
