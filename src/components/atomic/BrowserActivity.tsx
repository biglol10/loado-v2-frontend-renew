import { eventEmit, eventRegister, eventRemove } from '@/utils/events';
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import userStore from '@/store/user/userStore';

const BrowserActivity = () => {
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
      eventEmit('@back', 'string');
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

    eventRegister('@back', listener);

    eventRegister('@login-redirect', goToLoginPage);

    return () => {
      eventRemove('@back', listener);
      eventRemove('@login-redirect', goToLoginPage);
    };
  }, [navigate]);

  return <></>;
};

export default BrowserActivity;
