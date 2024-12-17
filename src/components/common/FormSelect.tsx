import { Box, MenuItem, Select, styled } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Option {
  label: string | number;
  value: string;
}

interface IFormSelect<T> {
  name: string;
  control: any;
  options: Option[];
  onChangeValue?: (value: T) => T;
  showErrorBox?: boolean;
}

const ErrorContainer = styled(Box)({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: '4px',
  border: '1px solid red',
  backgroundColor: 'crimson',
  borderRadius: '4px',
});

const ErrorMessage = styled('div')({
  color: 'white',
  fontSize: '0.75rem',
  padding: '2px',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
});

const FormSelect = <T,>({
  name,
  control,
  options,
  onChangeValue,
  showErrorBox,
}: IFormSelect<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box position={'relative'}>
          <Select<T>
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
            value={value}
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
        </Box>
      )}
    />
  );
};

export default FormSelect;
