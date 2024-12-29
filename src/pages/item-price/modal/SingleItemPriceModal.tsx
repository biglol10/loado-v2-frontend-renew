import SharpDivider from '@/components/atomic/SharpDivider';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import { Modal, Backdrop, styled, css, Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { imageSrcCollection } from '../const/imageSrcCollection';
import { useSingleItemPriceQuery } from '@/apis/itemPrice/useSingleItemPriceQuery';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchFormSchema, type SearchFormData } from '../model/schema';
import dayjs from 'dayjs';
import FormSelect from '@/components/common/FormSelect';
import PriceChart from '../components/PriceChart';
import userStore from '@/store/user/userStore';
import ComponentWithSkeleton from '@/components/atomic/ComponentWithSkeleton';

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

const SingleItemPriceModal = () => {
  const { t } = useTranslation();
  const { isMobile } = userStore();
  const { selectedItemToView, setSelectedItemToView } = itemPriceStore();

  // State for actual query parameters (only updated when search is clicked)
  const [queryParams, setQueryParams] = useState({
    itemId: selectedItemToView?.itemId || '',
    yearValue: dayjs().year(),
    monthValue: dayjs().month() + 1,
  });

  const method = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      year: `${dayjs().get('year')}`,
      month: `${dayjs().get('month') + 1}`,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = method;

  const { data, isLoading, error } = useSingleItemPriceQuery(queryParams);

  const onSubmit = (formData: SearchFormData) => {
    const newParams = {
      itemId: selectedItemToView?.itemId || '',
      yearValue: parseInt(formData.year),
      monthValue: parseInt(formData.month),
    };

    setQueryParams(newParams);
  };

  const historyBack = () => {
    setSelectedItemToView(undefined);
  };

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
            <FormSelect<string>
              name="year"
              control={control}
              options={Array.from({ length: dayjs().diff('2023', 'year') + 1 }).map((_, index) => {
                const year = `${2023 + index}`;
                return { label: `${year}${t('label.year')}`, value: year };
              })}
            />

            <FormSelect<string>
              name="month"
              control={control}
              options={Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                return { label: `${month}${t('label.month')}`, value: String(month) };
              })}
            />

            <Button
              type="submit"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              {t('label.search')}
            </Button>
          </Box>
        </HeaderContainer>

        {/* {(errors.year || errors.month) && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errors.year?.message || errors.month?.message}
          </Typography>
        )} */}

        <ComponentWithSkeleton
          sx={{ height: 300 }}
          animation="wave"
          variant="rectangular"
          isLoading={isLoading}
        >
          {data && <PriceChart data={data} isMobile={isMobile} />}
          {error && <div>{t('common.error.unknown')}</div>}
        </ComponentWithSkeleton>
      </ModalContent>
    </Modal>
  );
};

export default SingleItemPriceModal;
