import './styles.css';

import NProgress from 'nprogress';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

export function ProgressBar() {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = window.setTimeout(() => {
      NProgress.done();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
