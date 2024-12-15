import SharpDivider from '@/components/atomic/SharpDivider';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import {
  Modal,
  Backdrop,
  styled,
  css,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { imageSrcCollection } from '../const/imageSrcCollection';
import { useSingleItemPriceQuery } from '@/apis/itemPrice/useSingleItemPriceQuery';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchFormSchema, type SearchFormData } from './schema';
import { Controller } from 'react-hook-form';

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

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: '#1e2124',
  color: 'white',
}));

const SelectStyled = styled(Select)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: 'white',
  marginRight: theme.spacing(2),
  '& .MuiSelect-icon': {
    color: 'white',
  },
}));

const FormError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: '4px',
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
}));

const SingleItemPriceModal = () => {
  const { t } = useTranslation();
  const { selectedItemToView, setSelectedItemToView } = itemPriceStore();

  // State for actual query parameters (only updated when search is clicked)
  const [queryParams, setQueryParams] = useState({
    itemId: selectedItemToView?.itemId || '',
    yearValue: 2024,
    monthValue: 12,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      year: '2024',
      month: '12',
    },
  });

  const { data, isLoading, error } = useSingleItemPriceQuery(queryParams);

  const onSubmit = (data: SearchFormData) => {
    setQueryParams({
      itemId: selectedItemToView?.itemId || '',
      yearValue: parseInt(data.year),
      monthValue: parseInt(data.month),
    });
  };

  const historyBack = () => {
    setSelectedItemToView(undefined);
  };

  console.log('data is ', data);

  return (
    <Modal
      open={!!selectedItemToView}
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

        <HeaderContainer>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component={'img'}
              src={
                imageSrcCollection[selectedItemToView!.itemId! as keyof typeof imageSrcCollection]
              }
            />
            <Typography variant="h6" sx={{ marginLeft: '10px' }}>
              {selectedItemToView!.itemName}
            </Typography>
          </Box>

          <Box
            component="form"
            sx={{ display: 'flex', alignItems: 'center' }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <SelectStyled {...field} size="small" error={!!errors.year}>
                  <MenuItem value="2023">2023년</MenuItem>
                  <MenuItem value="2024">2024년</MenuItem>
                </SelectStyled>
              )}
            />

            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <SelectStyled {...field} size="small" error={!!errors.month}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <MenuItem key={month} value={String(month)}>
                      {month}월
                    </MenuItem>
                  ))}
                </SelectStyled>
              )}
            />

            <Button
              type="submit"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              조회
            </Button>

            {/* 에러 메시지 표시 */}
            {(errors.year || errors.month || errors.root) && (
              <FormError>
                {errors.year?.message || errors.month?.message || errors.root?.message}
              </FormError>
            )}
          </Box>
        </HeaderContainer>

        <p id="child-modal-description" className="modal-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
        {/* <ModalButton onClick={handleClose}>Close Child Modal</ModalButton> */}

        {isLoading && <div>Loading...</div>}
        {error && <div>Error occurred</div>}
        {data && (
          // Render your data here
          <div>{/* Your data visualization */}</div>
        )}

        {(errors.year || errors.month) && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errors.year?.message || errors.month?.message}
          </Typography>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SingleItemPriceModal;
