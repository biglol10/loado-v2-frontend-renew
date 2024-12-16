import { Box } from '@mui/material';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

interface IDataResultBox {
  errors: FieldErrors<{
    year: string;
    month: string;
  }>;
}

const DataResultBox: React.FC<IDataResultBox> = ({ errors }) => {
  if (!!errors.year || !!errors.month) return null;

  return <Box sx={{ height: '500px' }}></Box>;
};

export default React.memo(DataResultBox);
