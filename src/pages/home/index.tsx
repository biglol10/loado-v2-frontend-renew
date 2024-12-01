import { AppBar, Box, Button, CardMedia, Grid2, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledTypography, StyledCardContent, StyledCard, StyledToolbar } from './styles/styles';
import { useTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';
import ItemPriceDashboardImage from '@/assets/images/item-price-dashboard-image.png';
import SimulationImage from '@/assets/images/simulation-image.png';

const sampleLostArkImage =
  'data:image/jpeg;base64,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';

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
              src={sampleLostArkImage}
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography color="white">{t('home.label.welcome_title')}</Typography>
            </Box>
          </Box>
        </StyledToolbar>

        <Grid2 container spacing={2} columns={12} sx={{ marginTop: '50px' }}>
          {cardData.map((card, idx) => {
            return (
              <Grid2 size={{ xs: 12, md: 6 }} key={`card_${idx}`}>
                <StyledCard
                  variant="outlined"
                  tabIndex={idx}
                  onClick={() => navigate('/item-price')}
                >
                  <CardMedia
                    component={'img'}
                    alt={`image_${idx}`}
                    image={card.img}
                    sx={{
                      aspectRatio: '16 / 9',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <StyledCardContent>
                    <Typography gutterBottom variant="caption" component={'div'}>
                      {card.tag}
                    </Typography>
                    <Typography gutterBottom variant="h6" component={'div'}>
                      {card.title}
                    </Typography>
                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                      {card.description}
                    </StyledTypography>
                  </StyledCardContent>
                </StyledCard>
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </AppBar>
  );
};

export default Home;
