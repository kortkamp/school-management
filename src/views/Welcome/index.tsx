import { Route, Switch } from 'react-router-dom';
import WelcomeView from './Welcome';

/**
 * Routes for "About" view
 * url: /bem-vindo/*
 */
const HomeRoutes = () => {
  return (
    <Switch>
      <Route component={WelcomeView} />
    </Switch>
  );
};

export default HomeRoutes;
