import { useRoutes } from 'react-router-dom';
import routeElements from './routeElements';

// const rootRouter = createBrowserRouter(routeElements); // BrowserActivity가 Router 와 동일한 레벨에 있으면 에러 발생

const Router = () => {
  const routes = useRoutes(routeElements);

  return routes;
};

export default Router;
