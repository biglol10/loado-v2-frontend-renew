/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from 'react-router-dom';
import lazyload from './utils/lazyload';
import Home from '@/pages/home';
import ScreenLog from '@/screen-control/ScreenLog';
import PrivateRoute from './utils/PrivateRoute';

const routeElements = [
  {
    element: <ScreenLog />,
    children: [
      { path: '/', element: <Navigate to={'home'} replace /> },
      { path: '/home', element: <Home /> },
      { path: '/example', element: lazyload(() => import('@/pages/example')) },
      {
        path: '/item-price',
        element: lazyload(() => import('@/pages/item-price')),
        children: [
          {
            path: 'notice',
            element: lazyload(() => import('@/pages/item-price/notice')),
          },
        ],
      },
      {
        path: '/item-price/:id',
        element: lazyload(() => import('@/pages/item-price/modal/SingleItemPriceModal')),
      },
      {
        path: '/admin-dashboard',
        element: <PrivateRoute>{lazyload(() => import('@/pages/admin-dashboard'))}</PrivateRoute>,
      },
    ],
  },
];

export default routeElements;
