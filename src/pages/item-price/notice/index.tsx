import { Box, Button, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ItemPriceNotice = () => {
  const navigate = useNavigate();

  return (
    <Modal open aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component={'h2'}>
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          descrption
        </Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    </Modal>
  );
};

export default ItemPriceNotice;
