import { Box, styled } from '@mui/material';

export const ErrorContainer = styled(Box)({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: '4px',
  border: '1px solid red',
  backgroundColor: 'crimson',
  borderRadius: '4px',
  zIndex: 1,
  marginBottom: '10px',
});

export const ErrorMessage = styled('div')({
  color: 'white',
  fontSize: '0.75rem',
  padding: '2px',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
});
