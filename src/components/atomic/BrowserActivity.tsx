import { eventEmit, eventRegister, eventRemove } from '@/utils/events';
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import userStore from '@/store/user/userStore';
import setupLocatorUI from '@locator/runtime';

const BrowserActivity = () => {
  const isLocal = process.env.MODE === 'local';

  const navigate = useNavigate();
  const { setIsMobile } = userStore();

  useLayoutEffect(() => {
    if (isMobile) {
      return setIsMobile(true);
    }
    setIsMobile(false);
  }, [setIsMobile]);

  useEffect(() => {
    window.onpopstate = (event) => {
      console.log(event);
      eventEmit('@back', 'string'); // event.detail = 'string'
    };

    const listener = (e: Event) => {
      const event = e as CustomEvent<string>;
      const data = event.detail;

      console.log(data);
      alert('@back');
    };

    const goToLoginPage = () => {
      navigate('/');
    };

    const activateLocatorJs = (event: any) => {
      if (event.ctrlKey && event.altKey && event.key.toLocaleLowerCase() === 'l') {
        if (isLocal) {
          setupLocatorUI();
        }
      }
    };

    eventRegister('@back', listener);

    eventRegister('@login-redirect', goToLoginPage);

    // ctrl + alt + l 하면 locatorjs 활성화
    eventRegister('keydown', activateLocatorJs);

    return () => {
      eventRemove('@back', listener);
      eventRemove('@login-redirect', goToLoginPage);
      eventRemove('keydown', activateLocatorJs);
    };
  }, [navigate]);

  return <></>;
};

export default BrowserActivity;
