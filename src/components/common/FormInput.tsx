import { Box, FormControl, InputLabel, TextField, styled } from '@mui/material';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { formatNumber, parseFormattedNumber } from '@/utils/numberFormat';
import { ErrorContainer, ErrorMessage } from './FormErrorStyles';

const StyeldTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    // backgroundColor: '#1e2124',
    // '& input': {
    //   color: 'white',
    // },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-error fieldset': {
      borderColor: '#d32f2f',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

interface FormInputProps<T extends FieldValues, K extends Path<T>> {
  name: K;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  onChangeValue?: (value: PathValue<T, K>) => PathValue<T, K>;
  numberFormat?: boolean;
  percentageFormat?: boolean;
  id?: string;
}

const formatValue = (
  value: string | number,
  numberFormat?: boolean,
  percentageFormat?: boolean
) => {
  if (numberFormat) {
    return formatNumber(value);
  }
  if (percentageFormat) {
    return `${value ?? 0}%`;
  }
  return value;
};

const FormInput = <T extends FieldValues, K extends Path<T>>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'small',
  onChangeValue,
  numberFormat,
  percentageFormat,
  id,
}: FormInputProps<T, K>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth={fullWidth}>
          {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
          <StyeldTextField
            {...field}
            id={id}
            label={label}
            placeholder={placeholder}
            type={type}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            error={!!error}
            size={size}
            value={formatValue(field.value, numberFormat, percentageFormat)}
            onChange={(event) => {
              const value = event.target.value;

              if (numberFormat) {
                // 숫자와 콤마만 허용
                const sanitizedValue = value.replace(/[^0-9,]/g, '');
                const numberValue = parseFormattedNumber(sanitizedValue);

                if (onChangeValue) {
                  const customValue = onChangeValue(numberValue as PathValue<T, K>);
                  field.onChange(customValue);
                  return;
                } else {
                  field.onChange(numberValue);
                  return;
                }
              }

              if (percentageFormat) {
                // 숫자만 허용
                const sanitizedValue = value.replace(/[^0-9]/g, '');
                const numberValue = parseFormattedNumber(sanitizedValue);

                if (onChangeValue) {
                  const customValue = onChangeValue(numberValue as PathValue<T, K>);
                  field.onChange(customValue);
                  return;
                } else {
                  field.onChange(numberValue);
                  return;
                }
              }

              if (onChangeValue) {
                const customValue = onChangeValue(value as PathValue<T, K>);
                field.onChange(customValue);
                return;
              }

              field.onChange(value);
            }}
            InputProps={{ sx: { backgroundColor: 'background.paper' } }}
          />
          {error && (
            <ErrorContainer>
              <ErrorMessage>{error.message}</ErrorMessage>
            </ErrorContainer>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormInput;
