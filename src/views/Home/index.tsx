import { Route, Switch } from 'react-router-dom';
import HomeView from './Home';

/**
 * Routes for "About" view
 * url: /about/*
 */
const HomeRoutes = () => {
  return (
    <Switch>
      <Route component={HomeView} />
    </Switch>
  );
};

export default HomeRoutes;
