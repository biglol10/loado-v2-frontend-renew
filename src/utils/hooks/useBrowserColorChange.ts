import { useColorScheme } from '@mui/material';

export type TBrowserTheme = 'system' | 'light' | 'dark';

const useBrowserColorChange = () => {
  const { mode: browserThemeMode, setMode } = useColorScheme();

  const changeBrowserTheme = (value: TBrowserTheme) => {
    setMode(value);
  };

  return { browserThemeMode, changeBrowserTheme };
};

export default useBrowserColorChange;
