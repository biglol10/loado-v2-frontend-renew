import { Box, styled, alpha } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type TLanguage = 'ko' | 'en';

const LanguageToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: alpha(theme.palette.background.paper, 0.1),
  borderRadius: theme.shape.borderRadius,
  padding: '4px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const LanguageOption = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  padding: '4px 12px',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius - 2,
  transition: 'all 0.2s ease',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  fontWeight: active ? 600 : 400,
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.05),
  },
}));

const Divider = styled('span')(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.3),
  margin: '0 4px',
}));
const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = useCallback(
    (language: TLanguage) => {
      localStorage.setItem('language', language);
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  useEffect(() => {
    const language = localStorage.getItem('language');
    if (language) {
      handleLanguageChange(language as TLanguage);
    }
  }, [handleLanguageChange]);

  return (
    <LanguageToggleContainer>
      <LanguageOption active={i18n.language === 'ko'} onClick={() => handleLanguageChange('ko')}>
        한글
      </LanguageOption>
      <Divider>|</Divider>
      <LanguageOption active={i18n.language === 'en'} onClick={() => handleLanguageChange('en')}>
        English
      </LanguageOption>
    </LanguageToggleContainer>
  );
};

export default LanguageSelector;
