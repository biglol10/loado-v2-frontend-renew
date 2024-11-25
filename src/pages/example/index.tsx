import { eventEmit } from '@/utils/events';
import { Box, Button, Typography } from '@mui/material';

const ExamplePage = () => {
  return (
    <Box>
      <Typography>This is Example Page</Typography>
      <Button
        onClick={() => {
          eventEmit('@login-redirect');
        }}
      >
        Go to main
      </Button>
    </Box>
  );
};

export default ExamplePage;
