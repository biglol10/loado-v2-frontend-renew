import SharpDivider from '@/components/atomic/SharpDivider';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import { Modal, Backdrop, styled, css, Typography, Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
};

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const SingleItemPriceModal = () => {
  const { t } = useTranslation();
  const { setSelectedItemIdToView } = itemPriceStore();

  const historyBack = () => {
    setSelectedItemIdToView(undefined);
  };

  return (
    <Modal
      open
      onClose={historyBack}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slots={{ backdrop: StyledBackdrop }}
    >
      <ModalContent sx={[style, { width: '1140px' }]}>
        <Typography
          variant="h5"
          className="modal-title"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          {t('item-price.modal.title')}
        </Typography>

        <SharpDivider dividerColor="orange" />

        <Container>
          <Box width="100%" sx={{ display: 'flex', flexDirection: 'column' }}>
            asdf
          </Box>
        </Container>

        <p id="child-modal-description" className="modal-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
        {/* <ModalButton onClick={handleClose}>Close Child Modal</ModalButton> */}
      </ModalContent>
    </Modal>
  );
};

export default SingleItemPriceModal;
