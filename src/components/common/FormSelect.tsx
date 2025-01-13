import { Box, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { ErrorContainer, ErrorMessage } from './FormErrorStyles';

interface Option {
  label: string | number | ReactNode;
  value: string | number;
}

interface IFormSelect<T> {
  id?: string;
  name: string;
  control: any;
  options: Option[];
  onChangeValue?: (value: T) => T;
  defaultValue?: T;
  label?: string;
  fullWidth?: boolean;
  showErrorBox?: boolean;
}

const FormSelect = <T,>({
  id,
  name,
  control,
  options,
  onChangeValue,
  defaultValue,
  label,
  fullWidth = true,
  showErrorBox,
}: IFormSelect<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth={fullWidth} sx={{ minWidth: 'auto' }}>
          {label && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
          <Select<T>
            id={id}
            label={label}
            labelId={`${id}-label`}
            value={value}
            sx={(theme) => ({
              backgroundColor: 'transparent',
              color: 'white',
              marginRight: theme.spacing(2),
              '& .MuiSelect-icon': {
                color: 'white',
              },
            })}
            onChange={(event) => {
              if (onChangeValue) {
                const customValue = onChangeValue(event.target.value as T);
                onChange(customValue);
                return;
              }
              onChange(event.target.value);
            }}
            size="small"
            error={!!error}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {showErrorBox && error && error.message && (
            <ErrorContainer>
              <ErrorMessage>{error.message}</ErrorMessage>
            </ErrorContainer>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormSelect;
