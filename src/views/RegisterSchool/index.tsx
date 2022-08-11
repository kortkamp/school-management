import { Route, Switch } from 'react-router-dom';
import RegisterSchool from './RegisterSchool';

/**
 * Routes for "About" view
 * url: /bem-vindo/*
 */
const HomeRoutes = () => {
  return (
    <Switch>
      <Route component={RegisterSchool} />
    </Switch>
  );
};

export default HomeRoutes;
