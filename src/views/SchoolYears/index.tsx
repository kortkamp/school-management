import { Route, Switch } from 'react-router-dom';
import { routePaths } from '../../routes/RoutePaths';

import SchoolYearView from './SchoolYearView';

/**
 * Routes for "SchoolYear" view
 * url: /ano-letivo/*
 */
const ExamsRoutes = () => {
  return (
    <Switch>
      <Route exact path={routePaths.schoolYear.path} component={SchoolYearView} />
    </Switch>
  );
};

export default ExamsRoutes;
