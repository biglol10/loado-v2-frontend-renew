import { Box, TextField, styled } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const ErrorMessage = styled('div')({
  color: 'white',
  fontSize: '0.75rem',
  padding: '2px',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
});

const StyeldTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#1e2124',
    '& input': {
      color: 'white',
    },
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

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  fullWidth = true,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box position={'relative'} mb={3}>
          <StyeldTextField
            {...field}
            label={label}
            placeholder={placeholder}
            type={type}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            error={!!error}
            onChange={(e) => {
              field.onChange(e);
            }}
          />
          {error && (
            <ErrorContainer>
              <ErrorMessage>{error.message}</ErrorMessage>
            </ErrorContainer>
          )}
        </Box>
      )}
    />
  );
};

export default FormInput;
