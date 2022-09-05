import { Route, Switch } from 'react-router-dom';
import { routeNames } from '../../routes';

import SchoolYearView from './SchoolYearView';

/**
 * Routes for "SchoolYear" view
 * url: /ano-letivo/*
 */
const ExamsRoutes = () => {
  return (
    <Switch>
      <Route exact path={routeNames.schoolYear.path} component={SchoolYearView} />
    </Switch>
  );
};

export default ExamsRoutes;
