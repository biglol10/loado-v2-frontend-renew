import { AppBar, Box, Button, CardMedia, Grid2, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledTypography, StyledCardContent, StyledCard, StyledToolbar } from './styles/styles';
import { useTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';
import ItemPriceDashboardImage from '@/assets/images/item-price-dashboard-image.png';
import SimulationImage from '@/assets/images/simulation-image.png';

const cardData = [
  {
    img: ItemPriceDashboardImage,
    tag: i18n.t('home.card.content1.tag'),
    title: i18n.t('home.card.content1.title'),
    description: i18n.t('home.card.content1.description'),
  },
  {
    img: SimulationImage,
    tag: i18n.t('home.card.content2.tag'),
    title: i18n.t('home.card.content2.title'),
    description: i18n.t('home.card.content2.description'),
  },
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box
              component={'img'}
              sx={{
                height: '50px',
                width: '50px',
                borderRadius: '50%',
                marginRight: '50px',
              }}
              src=""
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography color="white">{t('home.label.welcome_title')}</Typography>
            </Box>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Home;
